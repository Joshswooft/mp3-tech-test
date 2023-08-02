import { FileHandle } from "fs/promises";
import { MPEG_LAYER, MPEG_VERSION, BIT_RATES, SAMPLE_RATE_MAP } from "../..";
import { extractBitRateFromHeader, extractLayerFromHeader as extractLayerIndexFromHeader, extractSampleRateIndexFromHeader, extractVersionIndexFromHeader as extractVersionIndexFromHeader, getLayerByIndex, getMPEGVersionByIndex, getSyncWordFromHeader } from "./utils";

// The sync word is a specific bit pattern used to mark the beginning of an MP3 frame within an MP3 audio stream
const SYNC_WORD = 0b11111111111;
const HEADER_BYTE_SIZE = 4; // 32 bits or 4 bytes


export interface MP3FrameHeader {
    version: MPEG_VERSION | null;
    layer: MPEG_LAYER | null;
    hasPadding: boolean;
    GetMpegBitRate: () => number;
    GetSampleRate: () => number;
}

// some MP3 files can contain metadata before the first frame
export async function findFirstFrameHeader(fileDescriptor: FileHandle, bufSize = 4096): Promise<{ buffer: Buffer, offset: number } | null> {
    // note: this might not work if there is more metadata before the first frame
    const buffer = Buffer.alloc(bufSize); // Read up to 4096 bytes at a time
    let bytesRead = 0;

    while (bytesRead < buffer.length) {
        const { bytesRead: bytes } = await fileDescriptor.read(buffer, 0, buffer.length, bytesRead);
        if (bytes === 0) {
            // Reached the end of the file without finding a valid frame header
            return null;
        }
        const headerOffset = buffer.indexOf(SYNC_WORD);
        if (headerOffset !== -1) {
            // Found the first frame header
            return { buffer: buffer.subarray(headerOffset, headerOffset + HEADER_BYTE_SIZE), offset: headerOffset };
        }

        bytesRead += bytes;
    }

    return null;
}

/**
 * Assumes that the given buffer is lined up so the first 11 bits match the frame sync
 * @param buffer a buffer of atleast 32 bits representing the mp3 frame header
 * @returns MP3FrameHeader containing the information needed to decode an MP3 file
 */
export function parseMP3Header(buffer: Buffer): MP3FrameHeader {
    // 32-bits represents the header
    if (buffer.length < HEADER_BYTE_SIZE) {
        throw new Error("buffer size is too small to parse mp3 frame header")
    }

    const header = buffer.readUInt32BE(0);

    const syncWord = getSyncWordFromHeader(header);
    if ((syncWord & SYNC_WORD) !== SYNC_WORD) {
        throw new Error("Invalid MP3 file: sync word not found")
    }

    // does this extract binary or an actual number?
    // see here: https://github.com/spreaker/node-mp3-header/blob/master/src/Mp3Header.js#L109C5-L109C5
    const versionIndex = extractVersionIndexFromHeader(header);
    const layer = extractLayerIndexFromHeader(header);
    const bitrateIndex = extractBitRateFromHeader(header);
    const samplerateIndex = extractSampleRateIndexFromHeader(header);
    const hasPadding = Boolean(+header.toString(2)[24])   // grab the 23rd bit, TODO: make this more performant

    const mpegVersion: MPEG_VERSION | undefined = getMPEGVersionByIndex(versionIndex);

    if (!mpegVersion) {
        throw new Error("Invalid MP3 file: Unsupported MPEG version")
    }
    const mpegLayer: MPEG_LAYER | undefined = getLayerByIndex(layer);

    if (!mpegLayer) {
        throw new Error("Invalid MP3 file: unsupported layer")
    }

    if (bitrateIndex === 15) {
        throw new Error('Invalid MP3 file: Header corrupt invalid bitrate index');
    }

    // sample rate 3 = reserved
    if (samplerateIndex === 3) {
        throw new Error('Invalid MP3 file: Header corrupt invalid samplerate index');
    }

    return {
        version: mpegVersion,
        layer: mpegLayer,
        hasPadding,
        GetSampleRate: (): number => {
            return SAMPLE_RATE_MAP[mpegVersion][samplerateIndex]

        },
        GetMpegBitRate: (): number => {
            try {

                if (bitrateIndex === 0) {
                    throw new Error("free bitrate not supported")
                }

                if (bitrateIndex < 0 || bitrateIndex > 15) {
                    throw new Error(`invalid bitrate index from header: ${bitrateIndex}`)
                }

                return BIT_RATES[bitrateIndex][mpegVersion][mpegLayer]

            }
            catch (err) {
                throw new Error("Mp3 file has an invalid bitrate: ", err)
            }
        },
    };
}
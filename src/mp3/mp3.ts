import * as fs from 'fs';
import { findFirstFrameHeader, parseMP3Header } from './frame/header';
import { FRAME_SIZE_COEFFICIENT_MAP, SLOT_SIZE_MAP } from './consts';
import { MPEG_LAYER, MPEG_VERSION } from './types';

/**
 * handles constant bit rate mp3 files
 * 
 * Throws an error if there are problems with the file or no file is found.
 * 
 * @param filePath a file path fo an mp3 file e.g. /foo/bar/baz.mp3
 * @returns total number of frames in the mp3 file
 */
export async function getMP3FrameCount(filePath: string): Promise<number> {
    const fileDescriptor = await fs.promises.open(filePath, 'r');
    const { buffer: headerBuffer, offset } = await findFirstFrameHeader(fileDescriptor);
    await fileDescriptor.close()
    if (!headerBuffer) {
        throw new Error('No valid MP3 frame header found.');
    }
    const header = parseMP3Header(headerBuffer);

    const frameSize = calculateframeSize(header.GetMpegBitRate(), header.GetSampleRate(), header.hasPadding, header.layer, header.version)
    const fileStats = await fs.promises.stat(filePath);

    // inconsistencies between 2 different libraries, this might be ceil() instead?
    // const frameCount = Math.floor(Math.ceil(fileStats.size - offset) / frameSize);
    const frameCount = Math.round((fileStats.size - offset) / frameSize);
    return frameCount;

}

/**
 * 
 * @param bitrate bitrate in kps. The bitrate represents the amount of data used to represent one second of audio. Higher bitrates result in better audio quality but also larger file sizes.
 * @param samplerate The sample rate determines how many samples are taken per second to represent the audio. Common sample rates are 44.1 kHz (CD quality) and 48 kHz.
 * @param hasPadding a boolean determining whether the frame header has a padding bit
 * @param layer the MPEG layer
 * @param version the MPEG version
 * @returns the size of a single frame
 */
function calculateframeSize(bitrate: number, samplerate: number, hasPadding: boolean, layer: MPEG_LAYER, version: MPEG_VERSION): number {

    // // we multiply by 1000 to convert kps to bps
    // if (layer === "Layer 1" && version === "MPEG Version 1") {
    //     console.log("frame size for layer 1: ", Math.floor(((12 * bitrate * 1000 / samplerate) + (hasPadding ? 1 : 0) * 4)))
    //     //   return Math.floor(((12 * bitrate * 1000 / samplerate) + (hasPadding ? 1 : 0) * 4))
    // }

    // console.log("using bitrate calc: ", Math.round(
    //     ((144 * bitrate * 1000) /
    //         samplerate) +
    //     (hasPadding ? 1 : 0)
    // ))

    // // The constant 144 ensures that the result is given in bytes (bits per second are converted to bytes per second).
    // // Note: if a sample rate of 0 is passed here then we get Infinity returned - should probably add error handling here
    // return Math.floor(
    //   ((144 * bitrate * 1000) /
    //     samplerate) +
    //   (hasPadding ? 1 : 0)
    // )

    // const numSamplesPerFrame = NUM_SAMPLES_MAP[version][layer]
    // console.log("num samples calc: ", Math.floor(Math.floor((numSamplesPerFrame / 8 * (bitrate * 1000)) / samplerate) + (hasPadding ? 1 : 0)))
    // console.log("new calc result: ", Math.round(((FRAME_SIZE_COEFFICIENT_MAP[version][layer] * (bitrate * 1000)) / samplerate + (hasPadding ? 1 : 0)) * SLOT_SIZE_MAP[layer]))

    return Math.floor(((FRAME_SIZE_COEFFICIENT_MAP[version][layer] * (bitrate * 1000)) / samplerate + (hasPadding ? 1 : 0)) * SLOT_SIZE_MAP[layer])

}



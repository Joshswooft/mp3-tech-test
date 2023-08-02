import { findFirstFrameHeader, parseMP3Header, MPEG_LAYER, MPEG_VERSION } from "../src/mp3/";
import { metaDataTable } from "../assets/fixtures/file_metadata"
import * as fs from 'fs';


function convertBinaryToBuffer(binary): Buffer {
    // Convert the binary number to bytes
    const numBytes = Math.ceil(Math.log2(binary + 1) / 8);
    const buffer = Buffer.alloc(numBytes);

    for (let i = 0; i < numBytes; i++) {
        const byteValue = (binary >> (numBytes - 1 - i) * 8) & 0xFF;
        buffer[i] = byteValue;
    }
    return buffer;

}



describe("parses mp3 header", () => {
    it("given a valid mp3 header it should correctly parse the details", () => {

        const headerBinary = 0b11111111111110111001000000000000;
        const header = parseMP3Header(convertBinaryToBuffer(headerBinary));

        const expectedVersion: MPEG_VERSION = "MPEG Version 1"
        expect(header.version).toBe(expectedVersion)

        const expectedLayer: MPEG_LAYER = "Layer 3"
        expect(header.layer).toBe(expectedLayer)
        expect(header.GetSampleRate()).toBe(44100)
        expect(header.GetMpegBitRate()).toBe(128)
        expect(header.hasPadding).toBe(false)

    })

    it("should get correct header for mp3 file", async () => {

        for (const fixture of metaDataTable) {
            await performTest(fixture)
        }


        async function performTest(fixture) {
            const fileDescriptor = await fs.promises.open(`assets/fixtures/${fixture.filename}`, 'r');
            const { buffer: headerBuffer } = await findFirstFrameHeader(fileDescriptor);

            if (!headerBuffer) {
                throw new Error("didnt find header buffer for file: ", fixture.filename)
            }
            await fileDescriptor.close()
            const header = parseMP3Header(headerBuffer);


            const layers: Record<number, MPEG_LAYER> = {
                1: "Layer 1",
                2: "Layer 2",
                3: "Layer 3"
            }

            const versions: Record<number, MPEG_VERSION> = {
                1.0: "MPEG Version 1",
                2.0: "MPEG Version 2",
                2.5: "MPEG Version 2.5"
            }

            type Obj = {
                bitrate: number;
                samplerate: number;
                layer: MPEG_LAYER;
                version: MPEG_VERSION
            }

            const actual: Obj = {
                bitrate: header.GetMpegBitRate(),
                samplerate: header.GetSampleRate(),
                layer: header.layer,
                version: header.version
            }

            const expected: Obj = {
                bitrate: fixture.bitrate,
                samplerate: fixture.samplerate,
                layer: layers[fixture.layer],
                version: versions[fixture.version]
            }

            try {
                expect(actual).toEqual(expected)
            }
            catch (err) {
                throw new Error(`fixture: ${fixture.filename} failed, err=${err}`)
            }

        }

    })

    it("header should have a padding bit", () => {
        const headerBinary = 0b11111111111110111001000010000000;
        const header = parseMP3Header(convertBinaryToBuffer(headerBinary));

        expect(header.hasPadding).toBe(true)
    })
})
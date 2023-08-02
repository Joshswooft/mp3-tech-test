import { MPEG_LAYER, MPEG_VERSION } from "../..";

function extractBits(value: number, startBit: number, bitLength: number): number {
    // TODO: make this more performant by using bit shifting
    return parseInt(value.toString(2).substring(startBit, startBit + bitLength), 2)

}

const VERSION_BIT_NO_START = 11;    // bit 12 - 14
const VERSION_BIT_LENGTH = 2;
export const extractVersionIndexFromHeader = (header: number) => extractBits(header, VERSION_BIT_NO_START, VERSION_BIT_LENGTH)

const LAYER_BIT_NO_START = 13;  // bit 14 - 16
const LAYER_BIT_LENGTH = 2;
export const extractLayerFromHeader = (header: number) => extractBits(header, LAYER_BIT_NO_START, LAYER_BIT_LENGTH)

const BIT_RATE_NO_START = 16;   // bit 17 - 21
const BIT_RATE_LENGTH = 4;
export const extractBitRateFromHeader = (header: number) => extractBits(header, BIT_RATE_NO_START, BIT_RATE_LENGTH);

const SAMPLE_RATE_BIT_NO_START = 20;    // bit 21 - 23
const SAMPLE_RATE_BIT_LENGTH = 2;
export const extractSampleRateIndexFromHeader = (header: number) => extractBits(header, SAMPLE_RATE_BIT_NO_START, SAMPLE_RATE_BIT_LENGTH)

export function getMPEGVersionByIndex(index: number): MPEG_VERSION | undefined {
    const versionMap: Map<number, MPEG_VERSION> = new Map([
        [0b00, "MPEG Version 2.5"],
        [0b01, "Reserved"],
        [0b10, "MPEG Version 2"],
        [0b11, "MPEG Version 1"]

    ]);

    return versionMap.get(index)
}

export function getLayerByIndex(index: number): MPEG_LAYER | undefined {
    const layerMap: Map<number, MPEG_LAYER> = new Map([
        [0b00, "Layer Reserved"],
        [0b01, "Layer 3"],
        [0b10, "Layer 2"],
        [0b11, "Layer 1"]
    ]);

    return layerMap.get(index)

}

// assumes that the frameHeader is 32 bits
export function getSyncWordFromHeader(frameHeader: number): number {
    const syncMask = 0xFFE00000//0b11111111111;
    return (frameHeader & syncMask) >>> 21;
}

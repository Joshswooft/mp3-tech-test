import { MPEG_LAYER, MPEG_VERSION } from "../src/mp3";
import { extractBitRateFromHeader, extractVersionIndexFromHeader, extractSampleRateIndexFromHeader, getSyncWordFromHeader, getMPEGVersionByIndex, getLayerByIndex } from "../src/mp3/frame/header/utils";

describe("extracts the bit rate index from the header", () => {
    test("happy path", () => {
        const headerBinary = 0b11111111111110111001000000000000;
        const expectedBitRateIndex = 0b1001;

        expect(extractBitRateFromHeader(headerBinary)).toBe(expectedBitRateIndex)
    })
})

describe("extracts the MPEG version index from the header", () => {
    test("happy path", () => {
        const headerBinary = 0b11111111111110111001000000000000;
        const expectedVersionIndex = 0b11;

        expect(extractVersionIndexFromHeader(headerBinary)).toBe(expectedVersionIndex)
    })
})

describe("extracts the sample rate index from the header", () => {
    test("happy path", () => {
        const headerBinary = 0b11111111111110111001000000000000;
        const expectedSampleRateIndex = 0b00;

        expect(extractSampleRateIndexFromHeader(headerBinary)).toBe(expectedSampleRateIndex)
    })
})


describe("extract the frame sync from the header", () => {
    test("happy path", () => {
        const headerBinary = 0b11111111111110111001000000000000;
        const SYNC_WORD = 0b11111111111;

        expect(getSyncWordFromHeader(headerBinary)).toBe(SYNC_WORD)
    })
})

describe("gets the correct MPEG version from an index", () => {
    test("it should return 'MPEG Version 1' when the binary = '11'", () => {
        const index = 0b11;
        const expectedMPEGVersion: MPEG_VERSION = "MPEG Version 1"
        expect(getMPEGVersionByIndex(index)).toBe(expectedMPEGVersion)
    })
    test("it should return 'MPEG Version 2' from binary '10'", () => {
        const index = 0b10;
        const expectedMPEGVersion: MPEG_VERSION = "MPEG Version 2"
        expect(getMPEGVersionByIndex(index)).toBe(expectedMPEGVersion)
    })
    test("it should return MPEG Version 2.5 from binary '00'", () => {
        const index = 0b00;
        const expectedMPEGVersion: MPEG_VERSION = "MPEG Version 2.5"
        expect(getMPEGVersionByIndex(index)).toBe(expectedMPEGVersion)
    })

    test("it should return 'Reserved' from binary '01'", () => {
        const index = 0b01;
        const expectedMPEGVersion: MPEG_VERSION = "Reserved"
        expect(getMPEGVersionByIndex(index)).toBe(expectedMPEGVersion)
    })
})

describe("gets the correct Layer version from an index", () => {
    test("it should get the 'Reserved' layer from index 00", () => {
        const index = 0b00;
        const expectedLayer: MPEG_LAYER = "Layer Reserved"

        expect(getLayerByIndex(index)).toBe(expectedLayer);
    })

    test("it should get the 'Layer 3' layer from index 00", () => {
        const index = 0b01;
        const expectedLayer: MPEG_LAYER = "Layer 3"

        expect(getLayerByIndex(index)).toBe(expectedLayer);
    })

    test("it should get the 'Layer 2' layer from index 00", () => {
        const index = 0b10;
        const expectedLayer: MPEG_LAYER = "Layer 2"

        expect(getLayerByIndex(index)).toBe(expectedLayer);
    })

    test("it should get the 'Layer 1' layer from index 00", () => {
        const index = 0b11;
        const expectedLayer: MPEG_LAYER = "Layer 1"

        expect(getLayerByIndex(index)).toBe(expectedLayer);
    })
})
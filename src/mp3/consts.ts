import { MPEG_LAYER, MPEG_VERSION } from "./types";

type AllowedLayers = Omit<Record<MPEG_LAYER, number>, "Layer Reserved">
type AllowedVersions = Omit<Record<MPEG_VERSION, AllowedLayers>, "Reserved">;
type BitRateTable = Record<number, AllowedVersions>

// all values are in kps
// export const BIT_RATES: Record<MPEG_VERSION, Record<MPEG_LAYER, number[]>> = {
//     'MPEG Version 2.5': {
//         'Layer Reserved': [],
//         'Layer 3': [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
//         'Layer 2': [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
//         'Layer 1': [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
//     },
//     'MPEG Version 2': {
//         'Layer Reserved': [],
//         'Layer 3': [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
//         'Layer 2': [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
//         'Layer 1': [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
//     },
//     'MPEG Version 1': {
//         'Layer Reserved': [],
//         'Layer 3': [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
//         'Layer 2': [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
//         'Layer 1': [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
//     },
//     "Reserved": {
//         "Layer Reserved": [],
//         "Layer 3": [],
//         "Layer 2": [],
//         "Layer 1": [],
//     }
// };


// all values in kps
export const BIT_RATES: BitRateTable = {
    0b0001: {
        'MPEG Version 1': { 'Layer 1': 32, 'Layer 2': 32, 'Layer 3': 32 },
        'MPEG Version 2': { 'Layer 1': 32, 'Layer 2': 8, 'Layer 3': 8 },
        'MPEG Version 2.5': { 'Layer 1': 32, 'Layer 2': 8, 'Layer 3': 8 },
    },
    0b0010: {
        'MPEG Version 1': { 'Layer 1': 64, 'Layer 2': 48, 'Layer 3': 40 },
        'MPEG Version 2': { 'Layer 1': 48, 'Layer 2': 16, 'Layer 3': 16 },
        'MPEG Version 2.5': { 'Layer 1': 48, 'Layer 2': 16, 'Layer 3': 16 },
    },
    0b0011: {
        'MPEG Version 1': { 'Layer 1': 96, 'Layer 2': 56, 'Layer 3': 48 },
        'MPEG Version 2': { 'Layer 1': 56, 'Layer 2': 24, 'Layer 3': 24 },
        'MPEG Version 2.5': { 'Layer 1': 56, 'Layer 2': 24, 'Layer 3': 24 },
    },
    0b0100: {
        'MPEG Version 1': { 'Layer 1': 128, 'Layer 2': 64, 'Layer 3': 56 },
        'MPEG Version 2': { 'Layer 1': 64, 'Layer 2': 32, 'Layer 3': 32 },
        'MPEG Version 2.5': { 'Layer 1': 64, 'Layer 2': 32, 'Layer 3': 32 },
    },
    0b0101: {
        'MPEG Version 1': { 'Layer 1': 160, 'Layer 2': 80, 'Layer 3': 64 },
        'MPEG Version 2': { 'Layer 1': 80, 'Layer 2': 40, 'Layer 3': 40 },
        'MPEG Version 2.5': { 'Layer 1': 80, 'Layer 2': 40, 'Layer 3': 40 },
    },
    0b0110: {
        'MPEG Version 1': { 'Layer 1': 192, 'Layer 2': 96, 'Layer 3': 80 },
        'MPEG Version 2': { 'Layer 1': 96, 'Layer 2': 48, 'Layer 3': 48 },
        'MPEG Version 2.5': { 'Layer 1': 96, 'Layer 2': 48, 'Layer 3': 48 },
    },
    0b0111: {
        'MPEG Version 1': { 'Layer 1': 224, 'Layer 2': 112, 'Layer 3': 96 },
        'MPEG Version 2': { 'Layer 1': 112, 'Layer 2': 56, 'Layer 3': 56 },
        'MPEG Version 2.5': { 'Layer 1': 112, 'Layer 2': 56, 'Layer 3': 56 },
    },
    0b1000: {
        'MPEG Version 1': { 'Layer 1': 256, 'Layer 2': 128, 'Layer 3': 112 },
        'MPEG Version 2': { 'Layer 1': 128, 'Layer 2': 64, 'Layer 3': 64 },
        'MPEG Version 2.5': { 'Layer 1': 128, 'Layer 2': 64, 'Layer 3': 64 },
    },
    0b1001: {
        'MPEG Version 1': { 'Layer 1': 288, 'Layer 2': 160, 'Layer 3': 128 },
        'MPEG Version 2': { 'Layer 1': 144, 'Layer 2': 80, 'Layer 3': 80 },
        'MPEG Version 2.5': { 'Layer 1': 144, 'Layer 2': 80, 'Layer 3': 80 },
    },
    0b1010: {
        'MPEG Version 1': { 'Layer 1': 320, 'Layer 2': 192, 'Layer 3': 160 },
        'MPEG Version 2': { 'Layer 1': 160, 'Layer 2': 96, 'Layer 3': 96 },
        'MPEG Version 2.5': { 'Layer 1': 160, 'Layer 2': 96, 'Layer 3': 96 },
    },
    0b1011: {
        'MPEG Version 1': { 'Layer 1': 352, 'Layer 2': 224, 'Layer 3': 192 },
        'MPEG Version 2': { 'Layer 1': 176, 'Layer 2': 112, 'Layer 3': 112 },
        'MPEG Version 2.5': { 'Layer 1': 176, 'Layer 2': 112, 'Layer 3': 112 },
    },
    0b1100: {
        'MPEG Version 1': { 'Layer 1': 384, 'Layer 2': 256, 'Layer 3': 224 },
        'MPEG Version 2': { 'Layer 1': 192, 'Layer 2': 128, 'Layer 3': 128 },
        'MPEG Version 2.5': { 'Layer 1': 192, 'Layer 2': 128, 'Layer 3': 128 },
    },
    0b1101: {
        'MPEG Version 1': { 'Layer 1': 416, 'Layer 2': 320, 'Layer 3': 256 },
        'MPEG Version 2': { 'Layer 1': 224, 'Layer 2': 144, 'Layer 3': 144 },
        'MPEG Version 2.5': { 'Layer 1': 224, 'Layer 2': 144, 'Layer 3': 144 },
    },
    0b1110: {
        'MPEG Version 1': { 'Layer 1': 448, 'Layer 2': 384, 'Layer 3': 320 },
        'MPEG Version 2': { 'Layer 1': 256, 'Layer 2': 160, 'Layer 3': 160 },
        'MPEG Version 2.5': { 'Layer 1': 256, 'Layer 2': 160, 'Layer 3': 160 },
    },
};


// Values in Hz
export const SAMPLE_RATE_MAP = {
    'MPEG Version 1': {
        0b00: 44100,
        0b01: 48000,
        0b10: 32000
    },
    'MPEG Version 2': {
        0b00: 22050,
        0b01: 24000,
        0b10: 16000
    },
    'MPEG Version 2.5': {
        0b00: 11025,
        0b01: 12000,
        0b10: 8000
    },
}

export const NUM_SAMPLES_MAP: Omit<Record<MPEG_VERSION, AllowedLayers>, "Reserved"> = {
    'MPEG Version 1': {
        'Layer 1': 384,
        'Layer 2': 1152,
        'Layer 3': 1152,
    },
    'MPEG Version 2': {
        'Layer 1': 384,
        'Layer 2': 1152,
        'Layer 3': 576,
    },
    'MPEG Version 2.5': {
        'Layer 1': 384,
        'Layer 2': 1152,
        'Layer 3': 576,
    },
};


export const FRAME_SIZE_COEFFICIENT_MAP: Omit<Record<MPEG_VERSION, AllowedLayers>, "Reserved"> = {
    "MPEG Version 1": {
        'Layer 1': 12,
        "Layer 2": 144,
        "Layer 3": 144
    },
    "MPEG Version 2": {
        "Layer 1": 12,
        "Layer 2": 144,
        "Layer 3": 72
    },
    "MPEG Version 2.5": {
        "Layer 1": 12,
        "Layer 2": 144,
        "Layer 3": 72
    }
}


export const SLOT_SIZE_MAP: AllowedLayers = {
    "Layer 1": 4,
    "Layer 2": 1,
    "Layer 3": 1
}
# MP3 Tech test

[![Sponsor][sponsor-badge]][sponsor]
[![TypeScript version][ts-badge]][typescript-5-0]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][license]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]

👩🏻‍💻 Developer Ready: A comprehensive template. Works out of the box for most [Node.js][nodejs] projects.

🏃🏽 Instant Value: All basic tools included and configured:

- [TypeScript][typescript] [5.0][typescript-5-0]
- [ESM][esm]
- [ESLint][eslint] with some initial rules recommendation
- [Jest][jest] for fast unit testing and code coverage
- Type definitions for Node.js and Jest
- [Prettier][prettier] to enforce consistent code style
- NPM [scripts](#available-scripts) for common operations
- [EditorConfig][editorconfig] for consistent coding style
- Reproducible environments thanks to [Volta][volta]
- Example configuration for [GitHub Actions][gh-actions]
- Simple example of TypeScript code and unit test

🤲 Free as in speech: available under the APLv2 license.

## Description

The aim of this task is to create an API endpoint that accepts an MP3 file upload and responds with the number of frames in the file.

This program provides a simple express server with an API endpoint (`/file-upload`) which allows a user to upload an .mp3 file and it returns a number containing the number of frames.

## Known limitations

This program doesn't handle variable/average bit rate (VBR/ABR) mp3 files. It might also fail to get an accurate frame rate for files that contain additional wrappers/meta data. 

It doesn't contain a complete header corruption check. For instance theres certain audio modes that are not allowed to be combined with various MPEG layers and versions. In cases like this the program will try to run regardless.

One of the CBR tests fails, and it's because of some channel/audio setting that needs to be accounted for within frame count calculation.


## Background Information

This section contains some information about mp3 files.

Sources:
- https://en.wikipedia.org/wiki/MP3#File_structure
- https://www.codeproject.com/Articles/8295/MPEG-Audio-Frame-Header
- https://checkmate.gissen.nl/headers.php

An mp3 file is made up of MP3 frames consisting of a header and a data block. 
It is a sequence of frames which don't have arbitrary frame boundaries.

The data block contains the compressed audio info in terms of frequencies and amplitudes. But really its the header block which we are interested in the most. 

The header block contains a "sync word" which describes the start of a valid frame. 
Next bit defines the MPEG standard and 2 bits that indicate that layer 3 is used; hence MPEG-1 Audio, Audio Layer 3 or MP3.

After this the data will differ depending on the type of MP3 file...

Most MP3 files today contain ID3 metadata, which precedes or follows the MP3 frames, as noted in the diagram. The data stream can contain an optional checksum.

Bit 16 in the header contains a protection bit 

0 - protected by CRC (16 bit CRC followed after header - remember header = 32 bits)
1 - Not protected.


CBR - Constant bit rate
VBR - Variable bit rate
ABR - Average bit rate

### Things that influence frame size

The frame size in an MP3 file is influenced by several factors, primarily the `MPEG version`, `Layer`, `Bitrate`, and `Sample Rate` used during the audio compression. 
The frame size is a crucial parameter as it determines how much audio data is encoded within each frame of the MP3 file. Here are the main factors that influence the frame size:

MPEG Version: MP3 supports three MPEG versions: MPEG Version 1, MPEG Version 2, and MPEG Version 2.5. Each version has slightly different specifications, and this affects the frame size calculation.

Layer: MP3 allows three layers: Layer 1, Layer 2, and Layer 3. The layer also impacts the frame size calculation.

Bitrate: The bitrate represents the amount of data used to represent one second of audio. Higher bitrates result in better audio quality but also larger file sizes. Different bitrates will affect the frame size.

Sample Rate: The sample rate determines how many samples are taken per second to represent the audio. Common sample rates are 44.1 kHz (CD quality) and 48 kHz. The sample rate also influences the frame size.

Padding Bit: The padding bit is an additional bit added to the frame if necessary to ensure that frames are aligned correctly. It affects the frame size calculation.

The formula for calculating the frame size varies depending on the MPEG version and the layer used. Here are the frame size calculation formulas for different combinations:

For MPEG Version 1, Layer 1: ((12 * Bitrate * 1000) / Sample Rate + Padding Bit) * 4

For MPEG Version 1, Layer 2, and Layer 3: ((144 * Bitrate * 1000) / Sample Rate + Padding Bit)

For MPEG Version 2 and Version 2.5, Layer 1: Not used in practice.

For MPEG Version 2 and Version 2.5, Layer 2: ((144 * Bitrate * 1000) / Sample Rate + Padding Bit)

For MPEG Version 2 and Version 2.5, Layer 3: ((72 * Bitrate * 1000) / Sample Rate + Padding Bit)

Each frame in the MP3 file should be of the same size, except for the last frame, which might be smaller if the audio doesn't fill the complete frame. These frame size calculations are essential for accurately decoding and playing back the MP3 audio. Different combinations of the factors mentioned above result in different frame sizes, ultimately affecting the audio quality and file size of the MP3 file. 

For a VBR file, the frame sizes differ which makes the process a lot more complicated. 

Additionally, some files may use a hybrid approach, such as "ABR" (Average Bitrate) or "VBR with CBR header," making the identification more challenging.
Mp3 files can contain additional metadata either at the begining or at the end of an audio file. These are known as ID3 tags

## Getting Started

This project is intended to be used with the latest Active LTS release of [Node.js][nodejs].

### Clone repository

To clone the repository, use the following commands:

```sh
git clone https://github.com/Joshswooft/mp3-tech-test
cd mp3-tech-test
```

### Installation

First install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) and install node version `v18.13.0` (any version 18 LTS should do)

E.g. `nvm install 18.13.0`

This project is using pnpm (a more disk optimized version of npm), you can find installation instructions for pnpm [here](https://pnpm.io/installation).
Alternatively you can stick to using npm.

Note: I had some issues with the pnpm registry not finding certain files so for now npm will be your best bet.
`pnpm install` or `npm install`

## Available Scripts

- `dev` - Runs a development build of the program
- `clean` - remove coverage data, Jest cache and transpiled files,
- `prebuild` - lint source files and tests before building,
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `prettier` - reformat files,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests

## Analyzing audio

First install [checkmate mp3 analyzer](https://checkmate.gissen.nl/download.php).

For CLI:

```sh
mpck assets/song1.mp3
```

If instead you want to send requests against the API you can use the `upload.sh` script.

First make sure you have execute permissions:

```sh
chmod +x upload.sh
```

Example usage:

```sh
./upload.sh assets/song1.mp3
```

### Why include Volta

[Volta][volta]’s toolchain always keeps track of where you are, it makes sure the tools you use always respect the settings of the project you’re working on. This means you don’t have to worry about changing the state of your installed software when switching between projects. For example, it's [used by engineers at LinkedIn][volta-tomdale] to standardize tools and have reproducible development environments.

I recommend to [install][volta-getting-started] Volta and use it to manage your project's toolchain.

### ES Modules

This template uses native [ESM][esm]. Make sure to read [this][nodejs-esm], and [this][ts47-esm] first.

If your project requires CommonJS, you will have to [convert to ESM][sindresorhus-esm].

Please do not open issues for questions regarding CommonJS or ESM on this repo.

## Backers & Sponsors

Support this project by becoming a [sponsor][sponsor].

## License

Licensed under the APLv2. See the [LICENSE](https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-5.0-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2018.12-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v18.x/docs/api/
[gha-badge]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml
[typescript]: https://www.typescriptlang.org/
[typescript-5-0]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/
[license-badge]: https://img.shields.io/badge/license-APLv2-blue.svg
[license]: https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://github.com/sponsors/jsynowiec
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[wiki-js-tests]: https://github.com/jsynowiec/node-typescript-boilerplate/wiki/Unit-tests-in-plain-JavaScript
[prettier]: https://prettier.io
[volta]: https://volta.sh
[volta-getting-started]: https://docs.volta.sh/guide/getting-started
[volta-tomdale]: https://twitter.com/tomdale/status/1162017336699838467?s=20
[gh-actions]: https://github.com/features/actions
[repo-template-action]: https://github.com/jsynowiec/node-typescript-boilerplate/generate
[esm]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[sindresorhus-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[nodejs-esm]: https://nodejs.org/docs/latest-v16.x/api/esm.html
[ts47-esm]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#esm-nodejs
[editorconfig]: https://editorconfig.org

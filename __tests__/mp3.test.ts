import { getMP3FrameCount } from "../src/mp3";
import { MetaData, metaDataTable } from "../assets/fixtures/file_metadata"
import { fail } from "assert";

describe("calculate total frame count for a mp3 file", () => {

  it("should return the correct total frames for a mp3 file", async () => {
    const expectedFrameCount = 7886;
    expect(await getMP3FrameCount("assets/song1.mp3")).toBe(expectedFrameCount)
  })

  it("should return an error when we attempt to analysis a file that doesnt exist", async () => {
    await expect(getMP3FrameCount("foo/bar.mp3")).rejects.toThrow()
  })

  it("should return correct total frames for all the fixtures with 'type=CBR'", async () => {

    let numPasses = 0;

    const cbrFixtures = metaDataTable.filter(m => m.type === "cbr")

    for (const fixture of cbrFixtures) {
      const pass = await performTest(fixture);
      if (pass) {
        numPasses++
      }
    }

    async function performTest(meta: MetaData) {

      const totalFrames = await getMP3FrameCount(`assets/fixtures/${meta.filename}`)
      const FRAME_TOLERANCE = 1;
      const hasPassed = Math.abs(totalFrames - meta.total_frames) <= FRAME_TOLERANCE;

      if (!hasPassed) {
        console.error("test failed: ", meta.filename, meta.total_frames, totalFrames)
        fail(`fixture: '${meta.filename}' FAILED! expectedFrameCount = ${meta.total_frames}, actualFrameCount = ${totalFrames} `)
      }
      return hasPassed
    }

    console.log(`num passes: ${numPasses} out of ${cbrFixtures.length} tests`)

  })


})

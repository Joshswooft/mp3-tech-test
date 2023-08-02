import request from 'supertest';
import app from "../src/app";
import { metaDataTable } from '../assets/fixtures/file_metadata';

describe('File Upload API Tests', () => {

  test('should throw an error if the user uploaded a form without the "file" field', async () => {
    const response = await request(app)
      .post('/file-upload')
      .field('otherField', 'someValue'); // No "file" field provided

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'No MP3 file provided');
  });

  test('should throw an error if the correct mime type is NOT specified', async () => {
    const invalidMp3FilePath = 'assets/invalid_mp3_file.txt'; // File with invalid extension
    const response = await request(app)
      .post('/file-upload', function (err) {
        console.log(err);
      })
      .attach('file', invalidMp3FilePath);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid file type');
  });

  test('should return the correct frame count when a valid mp3 file is uploaded', async () => {
    const validMp3FilePath = `assets/fixtures/${metaDataTable[0].filename}`; // Path to a valid MP3 file
    const response = await request(app)
      .post('/file-upload')
      .attach('file', validMp3FilePath);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('frameCount'); // Assuming the response contains 'frameCount'
  });

  test('should return 404 Not Found for an invalid API endpoint', async () => {
    const response = await request(app).get('/invalid');

    expect(response.status).toBe(404);
  });

});

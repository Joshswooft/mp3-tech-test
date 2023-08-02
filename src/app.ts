import express, { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { getMP3FrameCount } from './mp3';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Create the 'uploads' directory if it doesn't exist
const uploadDirectory = './uploads';
if (!fs.existsSync(uploadDirectory)) {
  console.log(`creating the uploads directory at: '${uploadDirectory}`)
  fs.mkdirSync(uploadDirectory);
}

// Multer configuration to store the uploaded MP3 files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const originalFileNameWithoutExtension = path.parse(
      file.originalname
    ).name;
    const fileName = originalFileNameWithoutExtension + '-' + uniqueSuffix + fileExtension;
    console.log('File will be saved as:', fileName); // Add this line for debugging
    cb(null, fileName);
  },
});

// Multer file filter to allow only .mp3 files
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  const validMimeTypes = ['audio/mpeg', 'audio/mp3'];

  if (validMimeTypes.includes(file.mimetype) && path.extname(file.originalname) === ".mp3") {
    // Accept .mp3 files
    cb(null, true);
  } else {
    // Reject other files
    const error = new MulterError('LIMIT_UNEXPECTED_FILE', "file")
    error.message = 'Only .mp3 files are allowed'
    cb(error, false);
  }
};

const upload = multer({ storage, fileFilter });

// API endpoint for uploading an MP3 file
app.post(
  '/file-upload',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No MP3 file provided' });
      }

      const filePath = path.join(uploadDirectory, req.file.filename);
      const frameCount = await getMP3FrameCount(filePath)

      res.json({ frameCount });
    } catch (err) {
      // Catch and handle any errors during file processing
      console.error(err);
      res.status(500).json({ error: 'Server error, please try again later' });
    }
  }
);


type ResponseError = {
  error: string;
}

// Error handling middleware for Multer-related errors and other errors
app.use(
  (
    err: Error | MulterError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof MulterError) {
      // Multer-related errors (e.g., file size, file type)

      let responseError: ResponseError = { error: 'File upload error' }

      switch (err.code) {
        case "LIMIT_UNEXPECTED_FILE": responseError = { error: "Invalid file type" }
      }

      return res.status(400).json(responseError);
    }

    // Other errors
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
);

export default app;
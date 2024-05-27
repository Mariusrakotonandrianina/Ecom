import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


function generateUniqueFilename(file) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(file.originalname);
  return file.fieldname + '-' + uniqueSuffix + ext;
}

const destination2 = path.join(__dirname, '../../front-test/public/images/imgAvatar');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination1 = path.join(__dirname, '../../front-feat-transaction/public/avatarClient');
    cb(null, destination1);
  },
  filename: (req, file, cb) => {
    const filename = generateUniqueFilename(file);
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const uploadAvatar = (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const originalPath = req.file.path;
    const newPath2 = path.join(destination2, req.file.filename);

    const readStream = fs.createReadStream(originalPath);
    const writeStream = fs.createWriteStream(newPath2);

    readStream.pipe(writeStream);
    next();
  });
};

export default uploadAvatar;

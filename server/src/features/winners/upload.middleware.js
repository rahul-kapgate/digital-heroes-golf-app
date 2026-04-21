import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../../utils/ApiError.js';

const UPLOAD_DIR = 'uploads/proofs';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `proof-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype)) {
    return cb(ApiError.badRequest('Only JPEG, PNG, and WebP images allowed'));
  }
  cb(null, true);
};

export const uploadProof = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('proof');
import express from 'express';
import { uploadProductImage } from '../controllers/uploadController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js'; // Aici e middleware-ul pentru poze

const router = express.Router();

// Când primim o cerere de tip POST la /api/upload, prima dată trecem prin auth (să fie admin),
// apoi prin `upload.single('image')` (care urcă poza pe Cloudinary), și la final salvăm linkul în DB
router.post('/', verifyToken, isAdmin, upload.single('image'), uploadProductImage);

export default router;
import express from 'express';
import { addToCart, getCart } from '../controllers/cartController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Extragem/Modificăm coșul utilizatorului logat
router.get('/', verifyToken, getCart);
router.post('/add', verifyToken, addToCart);

export default router;
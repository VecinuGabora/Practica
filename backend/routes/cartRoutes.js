import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Extragem/Modificăm coșul utilizatorului logat
router.get('/', verifyToken, getCart);
router.post('/add', verifyToken, addToCart);

// RUTA NOUĂ PENTRU ȘTERGERE
router.delete('/remove/:id', verifyToken, removeFromCart);

export default router;
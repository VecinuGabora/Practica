import express from 'express';
import { addAddress, placeOrder } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Doar utilizatorii logați pot adăuga adrese și plasa comenzi
router.post('/address', verifyToken, addAddress);
router.post('/', verifyToken, placeOrder);

export default router;
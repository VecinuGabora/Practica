import express from 'express';
import { createCheckoutSession, markOrderAsPaid } from '../controllers/paymentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout-session', verifyToken, createCheckoutSession);
router.post('/success', verifyToken, markOrderAsPaid);

export default router;
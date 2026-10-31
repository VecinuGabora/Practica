import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Definim rutele și le legăm de funcțiile din controller
router.post('/register', register);
router.post('/login', login);

export default router;
import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Oricine poate vedea categoriile (nu necesită token)
router.get('/', getCategories);

// DOAR administratorii pot crea categorii
router.post('/', verifyToken, isAdmin, createCategory);

export default router;
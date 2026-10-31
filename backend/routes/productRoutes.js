import express from 'express';
import { createProduct, getProducts } from '../controllers/productController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Oricine poate vedea produsele
router.get('/', getProducts);

// DOAR administratorii pot crea produse
router.post('/', verifyToken, isAdmin, createProduct);

export default router;
import express from 'express';
import { createProduct, getProducts, deleteProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Oricine poate vedea produsele (ruta publică)
router.get('/', getProducts);

// 2. DOAR Adminii logați pot adăuga sau șterge produse (rute protejate)
router.post('/', protect, admin, createProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
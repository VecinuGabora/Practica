import express from 'express';
import { createProduct, getProducts, deleteProduct, getRecommendedProducts } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta pentru recomandări (trebuie să fie prima)
router.get('/recommended', getRecommendedProducts);

// Rutele existente
router.get('/', getProducts);
router.post('/', protect, admin, createProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
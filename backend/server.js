import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';

// Importăm rutele
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js'; // IMPORT NOU

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Setăm URL-urile de bază
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes); // RUTĂ NOUĂ

app.get('/api/test', (req, res) => {
    res.json({ message: 'Salut din backend! Serverul functioneaza corect.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[SERVER] Backend-ul ruleaza pe portul ${PORT}`);
});
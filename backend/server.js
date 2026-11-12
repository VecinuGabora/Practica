import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; // IMPORT NOU

dotenv.config();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://practica-frontend-rho.vercel.app'],
    credentials: true
}));
app.use(express.json());

// Rute
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes); // RUTA NOUĂ

app.get('/', (req, res) => {
    res.send('Serverul Magazinului funcționează!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[SERVER] Backend-ul ruleaza pe portul ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';

// Importăm rutele
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Setăm URL-ul de bază pentru rutele de autentificare
app.use('/api/auth', authRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Salut din backend! Serverul functioneaza corect.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[SERVER] Backend-ul ruleaza pe portul ${PORT}`);
});
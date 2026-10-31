import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// 1. Verificăm dacă utilizatorul este logat (are token)
export const verifyToken = (req, res, next) => {
    // Extragem token-ul din header-ul "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acces interzis! Nu ești autentificat.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verificăm dacă token-ul este valid și nu a expirat
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Atașăm datele utilizatorului (id, role) la obiectul de request (req)
        req.user = decoded;

        // Trecem mai departe către funcția următoare (controller)
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token invalid sau expirat!' });
    }
};

// 2. Verificăm dacă utilizatorul are rol de administrator
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Autentificare necesară!' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acces respins! Doar administratorii pot face asta.' });
    }

    next();
};
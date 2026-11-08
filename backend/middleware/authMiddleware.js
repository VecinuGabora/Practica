import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// 1. PAZNICUL DE BAZĂ: Verifică dacă utilizatorul are un Token (dacă este logat)
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extragem token-ul (tăiem cuvântul 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Verificăm dacă token-ul este valid și n-a expirat
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Aducem datele utilizatorului din baza de date (fără parolă)
            const [users] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);

            if (users.length === 0) {
                return res.status(401).json({ message: 'Neautorizat: Utilizatorul nu mai există!' });
            }

            // Punem datele în req.user ca să le poată folosi următoarele funcții
            req.user = users[0];
            next(); // Dăm voie mai departe
        } catch (error) {
            console.error("Eroare la token:", error);
            res.status(401).json({ message: 'Neautorizat: Token invalid sau expirat!' });
        }
    } else {
        res.status(401).json({ message: 'Neautorizat: Nu există niciun token!' });
    }
};

// 2. PAZNICUL ȘEF: Verifică dacă utilizatorul logat are rolul de 'admin'
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Ești admin, treci mai departe!
    } else {
        res.status(403).json({ message: 'Acces interzis: Doar administratorii pot face asta!' });
    }
};

// ==========================================
// ALIASURI (Pentru compatibilitate cu rutele care folosesc numele vechi)
// ==========================================
export const verifyToken = protect;
export const isAdmin = admin;
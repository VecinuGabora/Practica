import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificăm dacă utilizatorul există deja
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Acest email este deja folosit!' });
        }

        // Criptăm parola (hash)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Salvăm utilizatorul în baza de date
        const [result] = await db.query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'Cont creat cu succes!', userId: result.insertId });
    } catch (error) {
        console.error('[AUTH ERROR]', error);
        res.status(500).json({ message: 'Eroare la server' });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Căutăm utilizatorul după email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email sau parolă incorectă!' });
        }

        const user = users[0];

        // Comparăm parola introdusă cu cea criptată din baza de date
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email sau parolă incorectă!' });
        }

        // Generăm Token-ul JWT (care va expira în 1 zi)
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Autentificare reușită!',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('[AUTH ERROR]', error);
        res.status(500).json({ message: 'Eroare la server' });
    }
};
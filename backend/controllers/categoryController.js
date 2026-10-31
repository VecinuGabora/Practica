import db from '../config/db.js';

// Obține toate categoriile (Public)
export const getCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        res.status(200).json(categories);
    } catch (error) {
        console.error('[CATEGORY ERROR]', error);
        res.status(500).json({ message: 'Eroare la obținerea categoriilor' });
    }
};

// Crează o categorie nouă (Doar Admin)
export const createCategory = async (req, res) => {
    try {
        const { name, slug } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ message: 'Numele și slug-ul sunt obligatorii!' });
        }

        const [result] = await db.query(
            'INSERT INTO categories (name, slug) VALUES (?, ?)',
            [name, slug]
        );

        res.status(201).json({ message: 'Categorie creată cu succes!', id: result.insertId });
    } catch (error) {
        // Verificăm dacă slug-ul există deja (eroare de constrângere UNIQUE în MySQL)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'O categorie cu acest slug există deja!' });
        }
        console.error('[CATEGORY ERROR]', error);
        res.status(500).json({ message: 'Eroare la crearea categoriei' });
    }
};
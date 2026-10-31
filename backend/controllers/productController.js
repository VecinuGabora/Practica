import db from '../config/db.js';

// 1. Crearea unui produs cu tot cu variantele sale (Doar Admin)
export const createProduct = async (req, res) => {
    // Extragem datele din cerere
    const { category_id, name, description, base_price, variants } = req.body;

    if (!name || !base_price || !variants || variants.length === 0) {
        return res.status(400).json({ message: 'Numele, prețul și cel puțin o variantă sunt obligatorii!' });
    }

    // Cerem o conexiune separată pentru a putea face o Tranzacție
    const connection = await db.getConnection();

    try {
        // Începem Tranzacția
        await connection.beginTransaction();

        // 1. Inserăm produsul de bază în tabelul `products`
        const [productResult] = await connection.query(
            'INSERT INTO products (category_id, name, description, base_price) VALUES (?, ?, ?, ?)',
            [category_id, name, description, base_price]
        );
        const newProductId = productResult.insertId;

        // 2. Inserăm fiecare variantă în tabelul `product_variants`
        for (const variant of variants) {
            await connection.query(
                'INSERT INTO product_variants (product_id, size, color, stock, sku) VALUES (?, ?, ?, ?, ?)',
                [newProductId, variant.size, variant.color, variant.stock, variant.sku]
            );
        }

        // Dacă totul a mers bine, Salvăm Definitiv (Commit)
        await connection.commit();
        res.status(201).json({ message: 'Produsul și variantele au fost create cu succes!', productId: newProductId });

    } catch (error) {
        // Dacă a apărut vreo eroare, Anulăm Tot (Rollback) ca să nu avem date incomplete
        await connection.rollback();

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Eroare: Un SKU (cod de bare) introdus există deja la alt produs!' });
        }
        console.error('[PRODUCT ERROR]', error);
        res.status(500).json({ message: 'Eroare la crearea produsului.' });
    } finally {
        // Eliberăm conexiunea înapoi în "piscină" ca să poată fi folosită de alți clienți
        connection.release();
    }
};

// 2. Obținerea tuturor produselor (Public)
export const getProducts = async (req, res) => {
    try {
        // Luăm produsele simple deocamdată (mai târziu vom adăuga și imaginile aici)
        const [products] = await db.query('SELECT * FROM products');
        res.status(200).json(products);
    } catch (error) {
        console.error('[PRODUCT ERROR]', error);
        res.status(500).json({ message: 'Eroare la obținerea produselor' });
    }
};
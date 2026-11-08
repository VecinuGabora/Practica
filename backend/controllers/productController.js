import db from '../config/db.js';

// 1. Crearea unui produs cu tot cu variantele sale (Admin)
export const createProduct = async (req, res) => {
    const { category_id, name, description, base_price, variants } = req.body;

    if (!name || !base_price || !variants || variants.length === 0) {
        return res.status(400).json({ message: 'Numele, prețul și cel puțin o variantă sunt obligatorii!' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [productResult] = await connection.query(
            'INSERT INTO products (category_id, name, description, base_price) VALUES (?, ?, ?, ?)',
            [category_id, name, description, base_price]
        );
        const newProductId = productResult.insertId;

        for (const variant of variants) {
            await connection.query(
                'INSERT INTO product_variants (product_id, size, color, stock, sku) VALUES (?, ?, ?, ?, ?)',
                [newProductId, variant.size, variant.color, variant.stock, variant.sku]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Produsul și variantele au fost create cu succes!', productId: newProductId });

    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Eroare: Un SKU (cod de bare) introdus există deja!' });
        }
        console.error('[PRODUCT ERROR]', error);
        res.status(500).json({ message: 'Eroare la crearea produsului.' });
    } finally {
        connection.release();
    }
};

// 2. Obținerea tuturor produselor (Public) - AICI AM REPARAT
export const getProducts = async (req, res) => {
    try {
        // Am adăugat un sub-query care extrage ID-ul primei variante a produsului
        const [products] = await db.query(`
            SELECT 
                p.*, 
                pi.image_url,
                (SELECT id FROM product_variants WHERE product_id = p.id LIMIT 1) AS variant_id
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
        `);
        res.status(200).json(products);
    } catch (error) {
        console.error("Eroare la preluarea produselor:", error);
        res.status(500).json({ message: 'Eroare la preluarea produselor' });
    }
};

// 3. Ștergerea unui produs (Admin)
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query('DELETE FROM product_images WHERE product_id = ?', [id]);
        await connection.query('DELETE FROM product_variants WHERE product_id = ?', [id]);
        await connection.query('DELETE FROM products WHERE id = ?', [id]);

        await connection.commit();
        res.status(200).json({ message: 'Produs șters cu succes!' });

    } catch (error) {
        await connection.rollback();
        console.error("Eroare la stergere:", error);
        res.status(500).json({ message: 'Eroare la ștergerea produsului.' });
    } finally {
        connection.release();
    }
};
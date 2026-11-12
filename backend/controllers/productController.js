import db from '../config/db.js';

// 1. Crearea unui produs (Admin)
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

// 2. Obținerea tuturor produselor (Public)
export const getProducts = async (req, res) => {
    try {
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

// 3. Ștergerea unui produs (Admin) - Actualizat pentru a preveni Eroarea 500 (Foreign Key)
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Identificăm toate variantele (mărimi/culori) acestui produs
        const [variants] = await connection.query('SELECT id FROM product_variants WHERE product_id = ?', [id]);

        if (variants.length > 0) {
            // Extragem doar ID-urile variantelor într-un array
            const variantIds = variants.map(v => v.id);

            // 2. Ștergem produsul din toate coșurile de cumpărături active (cart_items)
            await connection.query('DELETE FROM cart_items WHERE product_variant_id IN (?)', [variantIds]);

            // 3. Ștergem produsul din comenzile plasate (order_items)
            await connection.query('DELETE FROM order_items WHERE product_variant_id IN (?)', [variantIds]);
        }

        // 4. Acum putem șterge în siguranță baza produsului (imagini, variante, produs)
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

// 4. Algoritm local pentru Recomandări (NOU și REPARAT)
export const getRecommendedProducts = async (req, res) => {
    try {
        // Folosim ANY_VALUE() pentru a respecta regula only_full_group_by a MySQL
        const [recommended] = await db.query(`
            SELECT 
                p.id, 
                p.name, 
                p.base_price, 
                p.description,
                ANY_VALUE(pi.image_url) AS image_url,
                ANY_VALUE(pv.id) AS variant_id
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
            JOIN product_variants pv ON p.id = pv.product_id
            WHERE pv.stock > 0
            GROUP BY p.id, p.name, p.base_price, p.description
            ORDER BY RAND()
            LIMIT 4
        `);
        res.status(200).json(recommended);
    } catch (error) {
        console.error("Eroare la aducerea recomandarilor:", error);
        res.status(500).json({ message: 'Eroare la generarea recomandarilor' });
    }
};
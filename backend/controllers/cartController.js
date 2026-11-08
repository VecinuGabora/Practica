import db from '../config/db.js';

// 1. Adăugarea unui produs în coș
export const addToCart = async (req, res) => {
    const userId = req.user.id;
    const { product_variant_id, quantity } = req.body;

    if (!product_variant_id || !quantity) {
        return res.status(400).json({ message: 'Varianta produsului și cantitatea sunt obligatorii!' });
    }

    try {
        const [variants] = await db.query('SELECT stock FROM product_variants WHERE id = ?', [product_variant_id]);
        if (variants.length === 0) {
            return res.status(404).json({ message: 'Această variantă de produs nu a fost găsită!' });
        }

        if (variants[0].stock < quantity) {
            return res.status(400).json({ message: `Stoc insuficient! Mai sunt doar ${variants[0].stock} bucăți disponibile.` });
        }

        let [carts] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        let cartId;

        if (carts.length === 0) {
            const [newCart] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
            cartId = newCart.insertId;
        } else {
            cartId = carts[0].id;
        }

        const [existingItem] = await db.query(
            'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_variant_id = ?',
            [cartId, product_variant_id]
        );

        if (existingItem.length > 0) {
            const newQuantity = existingItem[0].quantity + quantity;

            if (variants[0].stock < newQuantity) {
                return res.status(400).json({ message: `Stoc insuficient pentru cantitatea totală cerută.` });
            }

            await db.query(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [newQuantity, existingItem[0].id]
            );
        } else {
            await db.query(
                'INSERT INTO cart_items (cart_id, product_variant_id, quantity) VALUES (?, ?, ?)',
                [cartId, product_variant_id, quantity]
            );
        }

        res.status(200).json({ message: 'Produs adăugat în coș cu succes!' });

    } catch (error) {
        console.error('[CART ERROR]', error);
        res.status(500).json({ message: 'Eroare la adăugarea produsului în coș.' });
    }
};

// 2. Vizualizarea Coșului
export const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
            SELECT 
                ci.id AS cart_item_id,
                p.name AS product_name,
                p.base_price AS price,
                pv.size,
                pv.color,
                ci.quantity,
                (p.base_price * ci.quantity) AS total_item_price
            FROM carts c
            JOIN cart_items ci ON c.id = ci.cart_id
            JOIN product_variants pv ON ci.product_variant_id = pv.id
            JOIN products p ON pv.product_id = p.id
            WHERE c.user_id = ?
        `;

        const [items] = await db.query(query, [userId]);

        const cartTotal = items.reduce((sum, item) => sum + parseFloat(item.total_item_price), 0);

        res.status(200).json({
            items: items,
            cartTotal: cartTotal.toFixed(2)
        });

    } catch (error) {
        console.error('[CART ERROR]', error);
        res.status(500).json({ message: 'Eroare la vizualizarea coșului.' });
    }
};

// 3. Ștergerea unui produs din coș (FUNCȚIA NOUĂ)
export const removeFromCart = async (req, res) => {
    const { id } = req.params; // ID-ul rândului din cart_items
    const userId = req.user.id;

    try {
        // Verificăm dacă acel coș îi aparține userului logat
        const [cart] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        if (cart.length === 0) return res.status(404).json({ message: 'Coșul nu a fost găsit.' });

        // Ștergem produsul din coș
        await db.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [id, cart[0].id]);

        res.status(200).json({ message: 'Produs eliminat cu succes!' });
    } catch (error) {
        console.error('[CART ERROR]', error);
        res.status(500).json({ message: 'Eroare la ștergerea produsului.' });
    }
};
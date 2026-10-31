import db from '../config/db.js';

// 1. Crearea unei Adrese (Necesară pentru Comandă)
export const addAddress = async (req, res) => {
    const userId = req.user.id;
    const { street, city, zip_code, country } = req.body;

    if (!street || !city || !zip_code || !country) {
        return res.status(400).json({ message: 'Toate câmpurile adresei sunt obligatorii!' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO addresses (user_id, street, city, zip_code, country) VALUES (?, ?, ?, ?, ?)',
            [userId, street, city, zip_code, country]
        );
        res.status(201).json({ message: 'Adresă adăugată cu succes!', addressId: result.insertId });
    } catch (error) {
        console.error('[ADDRESS ERROR]', error);
        res.status(500).json({ message: 'Eroare la adăugarea adresei.' });
    }
};

// 2. Plasarea Efectivă a Comenzii (Tranzacție)
export const placeOrder = async (req, res) => {
    const userId = req.user.id;
    const { shipping_address_id } = req.body;

    if (!shipping_address_id) {
        return res.status(400).json({ message: 'Trebuie să selectezi o adresă de livrare!' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Extragem datele din coș și verificăm stocurile din nou (siguranță)
        const cartQuery = `
            SELECT 
                ci.product_variant_id, 
                ci.quantity, 
                p.base_price, 
                pv.stock 
            FROM carts c
            JOIN cart_items ci ON c.id = ci.cart_id
            JOIN product_variants pv ON ci.product_variant_id = pv.id
            JOIN products p ON pv.product_id = p.id
            WHERE c.user_id = ?
        `;
        const [cartItems] = await connection.query(cartQuery, [userId]);

        if (cartItems.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Coșul este gol!' });
        }

        let totalAmount = 0;

        // Verificăm dacă cantitatea din coș nu a depășit stocul între timp
        for (const item of cartItems) {
            if (item.quantity > item.stock) {
                await connection.rollback();
                return res.status(400).json({ message: 'Ne pare rău, un produs din coș nu mai este în stoc suficient.' });
            }
            totalAmount += parseFloat(item.base_price) * item.quantity;
        }

        // 2. Creăm comanda principală
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, shipping_address_id, total_amount) VALUES (?, ?, ?)',
            [userId, shipping_address_id, totalAmount]
        );
        const newOrderId = orderResult.insertId;

        // 3. Mutăm itemele în order_items și scădem stocul
        for (const item of cartItems) {
            // Adăugăm în order_items cu prețul actual salvat
            await connection.query(
                'INSERT INTO order_items (order_id, product_variant_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [newOrderId, item.product_variant_id, item.quantity, item.base_price]
            );

            // Scădem cantitatea cumpărată din stocul Variantei
            await connection.query(
                'UPDATE product_variants SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_variant_id]
            );
        }

        // 4. Golim coșul utilizatorului
        const [userCart] = await connection.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        if (userCart.length > 0) {
            await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [userCart[0].id]);
        }

        // Salvăm definitiv modificările (Commit)
        await connection.commit();
        res.status(201).json({ message: 'Comanda a fost plasată cu succes!', orderId: newOrderId, total: totalAmount });

    } catch (error) {
        await connection.rollback();
        console.error('[ORDER ERROR]', error);
        res.status(500).json({ message: 'Eroare la plasarea comenzii.' });
    } finally {
        connection.release();
    }
};
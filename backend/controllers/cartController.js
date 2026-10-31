import db from '../config/db.js';

// 1. Adăugarea unui produs în coș
export const addToCart = async (req, res) => {
    // Extragem ID-ul utilizatorului din token (din middleware-ul de auth)
    const userId = req.user.id;

    // Extragem din request ID-ul variantei (ex: Tricoul Mărimea M Albastru) și cantitatea
    const { product_variant_id, quantity } = req.body;

    if (!product_variant_id || !quantity) {
        return res.status(400).json({ message: 'Varianta produsului și cantitatea sunt obligatorii!' });
    }

    try {
        // 1. Verificăm dacă există stoc suficient pentru varianta cerută
        const [variants] = await db.query('SELECT stock FROM product_variants WHERE id = ?', [product_variant_id]);
        if (variants.length === 0) {
            return res.status(404).json({ message: 'Această variantă de produs nu a fost găsită!' });
        }

        if (variants[0].stock < quantity) {
            return res.status(400).json({ message: `Stoc insuficient! Mai sunt doar ${variants[0].stock} bucăți disponibile.` });
        }

        // 2. Găsim coșul utilizatorului (sau îi creăm unul nou dacă nu are)
        let [carts] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        let cartId;

        if (carts.length === 0) {
            // Utilizatorul nu are coș, creăm unul
            const [newCart] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
            cartId = newCart.insertId;
        } else {
            cartId = carts[0].id;
        }

        // 3. Verificăm dacă produsul este deja în coș
        const [existingItem] = await db.query(
            'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_variant_id = ?',
            [cartId, product_variant_id]
        );

        if (existingItem.length > 0) {
            // Produsul e deja în coș, doar îi creștem cantitatea
            const newQuantity = existingItem[0].quantity + quantity;

            // Verificăm iar stocul maxim
            if (variants[0].stock < newQuantity) {
                return res.status(400).json({ message: `Stoc insuficient pentru cantitatea totală cerută.` });
            }

            await db.query(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [newQuantity, existingItem[0].id]
            );
        } else {
            // Produsul nu e în coș, îl adăugăm ca un rând nou
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
        // Folosim un JOIN complex pentru a aduce numele produsului, prețul, mărimea și cantitatea dorită
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

        // Calculăm și totalul general al coșului direct din JavaScript
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
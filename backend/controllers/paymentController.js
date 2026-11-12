import Stripe from 'stripe';
import db from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

// Inițializăm Stripe cu cheia din .env (dacă nu e setată, folosim un fallback temporar pentru a nu da crash)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

export const createCheckoutSession = async (req, res) => {
    const { orderId, totalAmount } = req.body;
    const userId = req.user.id;

    try {
        // Verificăm dacă comanda îi aparține utilizatorului
        const [orders] = await db.query('SELECT id FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Comanda nu a fost găsită.' });
        }

        // Creăm sesiunea Stripe
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'mdl',
                        product_data: {
                            name: `Comanda #${orderId} - Magazin Online`,
                        },
                        unit_amount: Math.round(totalAmount * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `http://localhost:5173/success?order_id=${orderId}`,
            cancel_url: `http://localhost:5173/checkout`,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('[STRIPE ERROR]', error);
        res.status(500).json({ message: 'Eroare la generarea sesiunii de plată.' });
    }
};

export const markOrderAsPaid = async (req, res) => {
    const { orderId } = req.body;
    const userId = req.user.id;

    try {
        await db.query(
            'UPDATE orders SET status = "Plătit Online (Stripe)" WHERE id = ? AND user_id = ?',
            [orderId, userId]
        );
        res.status(200).json({ message: 'Comanda a fost marcată ca plătită.' });
    } catch (error) {
        console.error('[PAYMENT UPDATE ERROR]', error);
        res.status(500).json({ message: 'Eroare la actualizarea comenzii.' });
    }
};
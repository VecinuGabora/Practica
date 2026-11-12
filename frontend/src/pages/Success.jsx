import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api.js';
import { useCart } from '../hooks/useCart.js';

const Success = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const [status, setStatus] = useState('Procesare...');
    const { fetchCart } = useCart();

    useEffect(() => {
        const confirmPayment = async () => {
            if (orderId) {
                try {
                    await API.post('/payment/success', { orderId });
                    await fetchCart(); // Golim coșul
                    setStatus('Plata a fost confirmată cu succes!');
                } catch (error) {
                    setStatus('Eroare la confirmarea plății în sistem.');
                }
            }
        };

        confirmPayment();
    }, [orderId, fetchCart]);

    return (
        <div style={{ textAlign: 'center', padding: '10rem 2rem', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#16140f' }}>Mulțumim!</h1>
            <p style={{ fontSize: '1.2rem', color: '#7a7469', marginBottom: '2rem' }}>{status}</p>
            <Link to="/magazin" style={{ padding: '1rem 2rem', background: '#16140f', color: '#f6f3ee', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>
                Întoarce-te la Magazin
            </Link>
        </div>
    );
};

export default Success;
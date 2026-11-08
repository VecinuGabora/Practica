import { useState, useEffect } from 'react';
import API from '../services/api.js';
import { useCart } from '../hooks/useCart.js';

const RecommendedProducts = () => {
    const [recommended, setRecommended] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await API.get('/products/recommended');
                setRecommended(response.data);
            } catch (error) {
                console.error("Eroare la incarcarea recomandarilor", error);
            }
        };
        fetchRecommendations();
    }, []);

    const handleAdd = (product) => {
        addToCart({
            ...product,
            variant_id: product.variant_id
        });
    };

    if (recommended.length === 0) return null;

    return (
        <div style={{ marginTop: '3rem', borderTop: '2px solid #e5e7eb', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                Poate te interesează și...
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {recommended.map(product => (
                    <div key={product.id} style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
                        <img
                            src={product.image_url}
                            alt={product.name}
                            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }}
                        />
                        <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{product.name}</h4>
                        <p style={{ fontWeight: 'bold', color: 'var(--color-accent)', marginBottom: '1rem' }}>{product.base_price} MDL</p>
                        <button
                            onClick={() => handleAdd(product)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
                        >
                            Adaugă rapid
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedProducts;
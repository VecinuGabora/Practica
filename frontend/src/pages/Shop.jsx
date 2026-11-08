import { useState, useEffect, useMemo, useRef } from 'react';
import { useCart } from '../hooks/useCart.js';
import API from '../services/api.js';
import '../styles/Shop.css';

const formatPrice = (value) =>
    `${Number(value).toLocaleString('ro-RO')} MDL`;

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sort, setSort] = useState('default');
    // feedback pe buton: { id, type: 'added' | 'error' }
    const [feedback, setFeedback] = useState(null);
    const feedbackTimer = useRef(null);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await API.get('/products');
                setProducts(response.data);
            } catch (err) {
                console.error('Eroare la aducerea produselor:', err);
                setError('Nu am putut încărca produsele. Te rugăm să revii mai târziu.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        return () => clearTimeout(feedbackTimer.current);
    }, []);

    const showFeedback = (id, type) => {
        clearTimeout(feedbackTimer.current);
        setFeedback({ id, type });
        feedbackTimer.current = setTimeout(() => setFeedback(null), 1800);
    };

    const handleAddToCart = (product) => {
        if (!product.variant_id) {
            showFeedback(product.id, 'error');
            return;
        }

        addToCart({
            ...product,
            variantId: product.variant_id,
            variant_id: product.variant_id
        });
        showFeedback(product.id, 'added');
    };

    const sortedProducts = useMemo(() => {
        const list = [...products];
        if (sort === 'price-asc') list.sort((a, b) => Number(a.base_price) - Number(b.base_price));
        if (sort === 'price-desc') list.sort((a, b) => Number(b.base_price) - Number(a.base_price));
        return list;
    }, [products, sort]);

    const buttonState = (product) => {
        if (feedback?.id !== product.id) return { label: 'Adaugă în coș', cls: '' };
        if (feedback.type === 'added') return { label: 'Adăugat ✓', cls: 'is-added is-visible' };
        return { label: 'Indisponibil', cls: 'is-error is-visible' };
    };

    const header = (
        <header className="shop-header">
            <span className="shop-eyebrow">Colecția 2026</span>
            <h1>Noua Colecție</h1>
            <p>Piese esențiale, croite cu grijă pentru detalii. Materiale alese, linii curate, o garderobă pe care o porți ani la rând.</p>
        </header>
    );

    if (loading) {
        return (
            <div className="shop-container">
                {header}
                <div className="products-grid" aria-busy="true">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="skeleton-card">
                            <div className="skeleton-image" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line short" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="shop-container">
                {header}
                <div className="shop-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="shop-container">
            {header}

            {products.length === 0 ? (
                <div className="no-products">
                    Momentan nu avem produse pe stoc.
                </div>
            ) : (
                <>
                    <div className="shop-toolbar">
                        <span className="shop-count">
                            {products.length} {products.length === 1 ? 'produs' : 'produse'}
                        </span>
                        <label className="shop-sort">
                            Sortează
                            <select value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value="default">Recomandate</option>
                                <option value="price-asc">Preț crescător</option>
                                <option value="price-desc">Preț descrescător</option>
                            </select>
                        </label>
                    </div>

                    <div className="products-grid">
                        {sortedProducts.map((product, index) => {
                            const btn = buttonState(product);
                            return (
                                <article
                                    key={product.id}
                                    className="product-card"
                                    style={{ '--i': Math.min(index, 12) }}
                                >
                                    <div className="product-image-container">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="product-image"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="no-image">Fără imagine</div>
                                        )}

                                        <button
                                            type="button"
                                            className={`add-to-cart-btn ${btn.cls}`}
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            {btn.label}
                                        </button>
                                    </div>

                                    <div className="product-info">
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-price">{formatPrice(product.base_price)}</p>
                                        <p className="product-description">{product.description}</p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default Shop;
import { useState, useEffect } from 'react';
import API from '../services/api.js';
import { useCart } from '../hooks/useCart.js';
import '../styles/Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await API.get('/products');
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Eroare preluare produse:", err);
                setError("Nu s-au putut încărca produsele. Verifică dacă serverul rulează.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="shop-status">Se încarcă produsele...</div>;
    if (error) return <div className="shop-status alert alert-error">{error}</div>;

    return (
        <div className="shop-container">
            <h1 className="shop-title">Toate Produsele</h1>

            {products.length === 0 ? (
                <p>Momentan nu există produse în magazin.</p>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">

                            {/* AICI ESTE MODIFICAREA: Dacă avem imagine o afișăm, dacă nu, afișăm "Fără Imagine" */}
                            {product.image_url ? (
                                <div className="product-image-container">
                                    <img src={product.image_url} alt={product.name} className="product-image" />
                                </div>
                            ) : (
                                <div className="product-image-placeholder">Fără Imagine</div>
                            )}

                            <div className="product-details">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-desc">{product.description}</p>
                                <div className="product-bottom">
                                    <span className="product-price">{product.base_price} MDL</span>

                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => addToCart(1, 1)}
                                    >
                                        Adaugă în coș
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;
import { useState, useEffect } from 'react';
import API from '../services/api.js';
import { useCart } from '../hooks/useCart.js'; // Importăm funcția pentru coș
import '../styles/Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Extragem funcția de adăugare în coș din contextul global
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
                            <div className="product-image-placeholder">Fără Imagine</div>

                            <div className="product-details">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-desc">{product.description}</p>
                                <div className="product-bottom">
                                    <span className="product-price">{product.base_price} MDL</span>

                                    {/* Aici am înlocuit butonul "Detalii" cu cel de "Adaugă în coș" */}
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
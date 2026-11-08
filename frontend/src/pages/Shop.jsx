import { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart.js';
import API from '../services/api.js';
import '../styles/Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await API.get('/products');
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Eroare la aducerea produselor:", err);
                setError('Nu am putut încărca produsele. Te rugăm să revii mai târziu.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // AICI E REPARAȚIA MAGIEI DE ADĂUGARE ÎN COȘ
    const handleAddToCart = (product) => {
        if (!product.variant_id) {
            alert("Eroare: Acest produs nu are stoc/variantă setată în baza de date.");
            return;
        }

        // Adăugăm id-ul variantei în pachetul pe care îl trimitem către Coș
        addToCart({
            ...product,
            variantId: product.variant_id, // Ne asigurăm că acoperim ambele moduri de scriere
            variant_id: product.variant_id
        });
    };

    if (loading) return <div className="shop-loader">Se încarcă magazinul...</div>;
    if (error) return <div className="shop-error">{error}</div>;

    return (
        <div className="shop-container">
            <div className="shop-header">
                <h1>Toate Produsele</h1>
                <p>Descoperă cea mai nouă colecție de haine.</p>
            </div>

            {products.length === 0 ? (
                <div className="no-products">
                    <h3>Momentan nu avem produse pe stoc.</h3>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-container">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                ) : (
                                    <div className="no-image">Fără Imagine</div>
                                )}
                            </div>

                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-price">{product.base_price} MDL</p>

                                <button
                                    className="btn btn-primary add-to-cart-btn"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Adaugă în coș
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;
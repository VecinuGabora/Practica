import { useState, useEffect } from 'react';
import API from '../services/api.js';
import '../styles/Shop.css'; // CSS-ul pe care îl vom crea imediat

const Shop = () => {
    // Aici stocăm produsele luate din baza de date (inițial o listă goală)
    const [products, setProducts] = useState([]);

    // Aici ținem minte dacă produsele încă se încarcă sau dacă a apărut o eroare
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect se execută o singură dată, imediat după ce pagina se încarcă pe ecran
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Facem o cerere de tip GET la http://localhost:5000/api/products
                const response = await API.get('/products');
                setProducts(response.data); // Punem datele primite în starea React
                setLoading(false); // Am terminat încărcarea
            } catch (err) {
                console.error("Eroare preluare produse:", err);
                setError("Nu s-au putut încărca produsele. Verifică dacă serverul rulează.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // [] înseamnă "rulează doar la prima montare a paginii"

    // Ce afișăm pe ecran CÂT TIMP se descarcă datele
    if (loading) return <div className="shop-status">Se încarcă produsele...</div>;

    // Ce afișăm dacă a "picat" cererea
    if (error) return <div className="shop-status alert alert-error">{error}</div>;

    // Ce afișăm DUPĂ CE datele au ajuns cu succes
    return (
        <div className="shop-container">
            <h1 className="shop-title">Toate Produsele</h1>

            {products.length === 0 ? (
                <p>Momentan nu există produse în magazin.</p>
            ) : (
                <div className="products-grid">
                    {/* Luăm fiecare produs din listă și îl transformăm într-un "card" vizual */}
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            {/* Vom adăuga imagini reale mai târziu, acum punem un placeholder gri */}
                            <div className="product-image-placeholder">Fără Imagine</div>

                            <div className="product-details">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-desc">{product.description}</p>
                                <div className="product-bottom">
                                    <span className="product-price">{product.base_price} MDL</span>
                                    <button className="btn btn-primary btn-sm">Detalii</button>
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
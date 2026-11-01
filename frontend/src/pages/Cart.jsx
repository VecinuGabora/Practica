import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import '../styles/Cart.css';

const Cart = () => {
    // Extragem datele coșului din memoria globală
    const { cartItems, cartTotal } = useCart();
    const { user } = useAuth();

    // Dacă utilizatorul nu este logat, îi spunem să se autentifice
    if (!user) {
        return (
            <div className="cart-empty">
                <h2>Trebuie să te autentifici!</h2>
                <p>Te rugăm să intri în cont pentru a vedea coșul de cumpărături.</p>
                <Link to="/login" className="btn btn-primary">Mergi la Autentificare</Link>
            </div>
        );
    }

    // Dacă este logat, dar coșul e gol
    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Coșul tău este gol</h2>
                <p>Se pare că nu ai adăugat încă niciun produs.</p>
                <Link to="/magazin" className="btn btn-primary">Întoarce-te la Magazin</Link>
            </div>
        );
    }

    // Dacă are produse în coș, afișăm interfața completă
    return (
        <div className="cart-container">
            <h1 className="cart-title">Coșul tău</h1>

            <div className="cart-content">
                {/* Partea stângă: Lista de produse */}
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.cart_item_id} className="cart-item-card">
                            <div className="cart-item-image">Poza</div>
                            <div className="cart-item-details">
                                <h3>{item.product_name}</h3>
                                <p className="cart-item-variant">Mărime: {item.size} | Culoare: {item.color}</p>
                                <div className="cart-item-actions">
                                    <span className="cart-item-quantity">Cantitate: {item.quantity}</span>
                                </div>
                            </div>
                            <div className="cart-item-price">
                                {item.total_item_price} MDL
                            </div>
                        </div>
                    ))}
                </div>

                {/* Partea dreaptă: Sumarul comenzii */}
                <div className="cart-summary">
                    <h3>Sumar Comandă</h3>
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>{cartTotal} MDL</span>
                    </div>
                    <div className="summary-row">
                        <span>Livrare:</span>
                        <span>Gratuită</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total:</span>
                        <span>{cartTotal} MDL</span>
                    </div>
                    <button className="btn btn-primary checkout-btn">
                        Finalizează Comanda
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
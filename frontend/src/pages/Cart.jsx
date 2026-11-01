import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import '../styles/Cart.css';

const Cart = () => {
    const { cartItems, cartTotal } = useCart();
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="cart-empty">
                <h2>Trebuie să te autentifici!</h2>
                <p>Te rugăm să intri în cont pentru a vedea coșul de cumpărături.</p>
                <Link to="/login" className="btn btn-primary">Mergi la Autentificare</Link>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Coșul tău este gol</h2>
                <p>Se pare că nu ai adăugat încă niciun produs.</p>
                <Link to="/magazin" className="btn btn-primary">Întoarce-te la Magazin</Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1 className="cart-title">Coșul tău</h1>

            <div className="cart-content">
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

                    {/* AICI ESTE BUTONUL NOU, CARE TE DUCE LA PAGINA DE CHECKOUT */}
                    <Link to="/checkout" className="btn btn-primary checkout-btn" style={{ display: 'block', textAlign: 'center', boxSizing: 'border-box' }}>
                        Finalizează Comanda
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default Cart;
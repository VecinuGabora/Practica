import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useCart } from '../hooks/useCart.js';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user, logoutAction } = useAuth();
    const { cartItems } = useCart();

    // Calculăm numărul total de BUCĂȚI (nu doar feluri de produse)
    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    MAGAZIN<span>.</span>
                </Link>

                <nav className="navbar-links">
                    <Link to="/" className="nav-link">Acasă</Link>
                    <Link to="/magazin" className="nav-link">Magazin</Link>

                    {/* Dacă utilizatorul există și rolul lui e admin, afișăm butonul */}
                    {user && user.role === 'admin' && (
                        <Link to="/admin" className="nav-link" style={{ color: 'var(--color-accent)', fontWeight: '700' }}>
                            Admin Panel
                        </Link>
                    )}
                </nav>

                <div className="navbar-actions">
                    {user ? (
                        <>
                            <span className="nav-link" style={{color: 'var(--color-primary)'}}>
                                Salut, {user.name} {user.role === 'admin' && '(Admin)'}
                            </span>
                            <button onClick={logoutAction} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem'}}>
                                Delogare
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link">Autentificare</Link>
                    )}

                    <Link to="/cos" className="btn btn-primary">Coș ({totalItemsInCart})</Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
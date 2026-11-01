import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js'; // Importăm Hook-ul nostru
import '../styles/Navbar.css';

const Navbar = () => {
    // Extragem starea utilizatorului și funcția de logout din memorie
    const { user, logoutAction } = useAuth();

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    MAGAZIN<span>.</span>
                </Link>

                <nav className="navbar-links">
                    <Link to="/" className="nav-link">Acasă</Link>
                    <Link to="/magazin" className="nav-link">Magazin</Link>
                </nav>

                <div className="navbar-actions">
                    {/* Logica: Dacă avem user, afișăm numele și Delogare. Dacă nu, afișăm Autentificare */}
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

                    <Link to="/cos" className="btn btn-primary">Coș (0)</Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
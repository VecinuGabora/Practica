import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // Vom crea acest CSS imediat

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="navbar-container">
                {/* Logo-ul din stânga */}
                <Link to="/" className="navbar-logo">
                    MAGAZIN<span>.</span>
                </Link>

                {/* Link-urile de navigare din mijloc */}
                <nav className="navbar-links">
                    <Link to="/" className="nav-link">Acasă</Link>
                    <Link to="/magazin" className="nav-link">Magazin</Link>
                </nav>

                {/* Butoanele din dreapta */}
                <div className="navbar-actions">
                    <Link to="/login" className="nav-link">Autentificare</Link>
                    <Link to="/cos" className="btn btn-primary">Coș (0)</Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
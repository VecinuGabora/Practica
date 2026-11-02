import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import '../../styles/Admin.css';

const AdminDashboard = () => {
    const { user } = useAuth();

    // Securitate suplimentară pe Frontend:
    // Dacă cineva încearcă să intre pe /admin dar nu e logat sau nu e admin, îl oprim.
    if (!user || user.role !== 'admin') {
        return (
            <div className="admin-denied">
                <h2>Acces Interzis</h2>
                <p>Nu ai permisiunile necesare pentru a accesa această pagină.</p>
                <Link to="/" className="btn btn-primary">Înapoi la Magazin</Link>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <h2>Panou Admin</h2>
                <nav className="admin-nav">
                    <Link to="/admin" className="admin-link">Statistici</Link>
                    <Link to="/admin/produse" className="admin-link">Gestionează Produse</Link>
                    <Link to="/admin/adauga-produs" className="admin-link">Adaugă Produs Nou</Link>
                    <Link to="/admin/comenzi" className="admin-link">Comenzi Noi</Link>
                </nav>
            </aside>

            <main className="admin-content">
                {/*
                    Aici va fi încărcat conținutul sub-paginilor de Admin.
                    (Dacă dai click pe "Adaugă Produs", formularul va apărea aici, nu va schimba toată pagina).
                */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;
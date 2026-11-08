import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx'; // IMPORTUL PENTRU PAGINA ACASĂ
import Shop from './pages/Shop.jsx';
import Login from './pages/Login.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import AdminDashboard from './pages/Admin/Dashboard.jsx';
import AddProduct from './pages/Admin/AddProduct.jsx';
import ManageProducts from './pages/Admin/ManageProducts.jsx';

function App() {
    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content">
                <Routes>
                    {/* AICI AM ÎNLOCUIT TEXTUL CU COMPONENTA HOME */}
                    <Route path="/" element={<Home />} />

                    <Route path="/magazin" element={<Shop />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cos" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />

                    {/* RUTELE PENTRU ADMINISTRARE */}
                    <Route path="/admin" element={<AdminDashboard />}>
                        <Route index element={<h2>Bine ai venit în Panoul de Administrare! Selectează o opțiune din meniul din stânga.</h2>} />

                        {/* Tabelul real de gestionare produse */}
                        <Route path="produse" element={<ManageProducts />} />

                        <Route path="adauga-produs" element={<AddProduct />} />
                        <Route path="comenzi" element={<h3>Aici vor fi comenzile clienților</h3>} />
                    </Route>

                    <Route path="*" element={<h2>Eroare 404: Pagina nu a fost găsită</h2>} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
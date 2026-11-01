import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Shop from './pages/Shop.jsx';
import Login from './pages/Login.jsx';
import Cart from './pages/Cart.jsx'; // IMPORT NOU

function App() {
  return (
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<h2>Pagina Principală (Acasă) - În curând</h2>} />
            <Route path="/magazin" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cos" element={<Cart />} /> {/* RUTĂ ACTUALIZATĂ */}
            <Route path="*" element={<h2>Eroare 404: Pagina nu a fost găsită</h2>} />
          </Routes>
        </main>
      </div>
  );
}

export default App;
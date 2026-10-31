import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'; // IMPORTĂM NAVBAR-UL AICI

function App() {
  return (
      <div className="app-container">
        {/* Navbar-ul este plasat în afara Rutelor, deci va apărea mereu, indiferent de pagină */}
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<h2>Pagina Principală (Acasă) - În curând</h2>} />
            <Route path="/magazin" element={<h2>Toate Produsele - În curând</h2>} />
            <Route path="/login" element={<h2>Pagina de Autentificare - În curând</h2>} />
            <Route path="/cos" element={<h2>Coșul de Cumpărături - În curând</h2>} />
            <Route path="*" element={<h2>Eroare 404: Pagina nu a fost găsită</h2>} />
          </Routes>
        </main>
      </div>
  );
}

export default App;
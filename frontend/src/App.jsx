import { Routes, Route } from 'react-router-dom';

function App() {
  return (
      <div className="app-container">
        {/* Aici vom pune mai tarziu componenta Navbar (Meniul de sus) */}

        <main className="main-content">
          <Routes>
            {/* Definim Rutele Paginii noastre */}
            <Route path="/" element={<h2>Pagina Principală (Acasă) - În curând</h2>} />
            <Route path="/magazin" element={<h2>Toate Produsele - În curând</h2>} />
            <Route path="/login" element={<h2>Pagina de Autentificare - În curând</h2>} />
            <Route path="/cos" element={<h2>Coșul de Cumpărături - În curând</h2>} />

            {/* Rută "Catch-all" pentru link-uri greșite */}
            <Route path="*" element={<h2>Eroare 404: Pagina nu a fost găsită</h2>} />
          </Routes>
        </main>

        {/* Aici vom pune mai tarziu Footer-ul (Subsolul) */}
      </div>
  );
}

export default App;
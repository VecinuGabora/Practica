import { Link } from 'react-router-dom';
import RecommendedProducts from '../components/RecommendedProducts.jsx';
import '../styles/Home.css';

const Home = () => {
    return (
        <div className="home-premium-container">

            {/* 1. Hero Banner - Vizualizare High-End */}
            <section className="hero-premium">
                <h1 className="hero-premium-title">Fără Limite.</h1>
                <p className="hero-premium-subtitle">
                    Design exclusivist gestionat inteligent. Alege produsele dorite și experimentează un sistem de comandă precis, creat special pentru a-ți respecta timpul.
                </p>
                <Link to="/magazin" className="hero-btn-premium">
                    Descoperă Colecția
                </Link>
            </section>

            {/* 2. Funcționalitățile Reale ale Proiectului - Carduri Carbon */}
            <section className="features-premium-grid">

                <div className="premium-card">
                    <span className="premium-icon">🛡️</span>
                    <h3>Securitate JWT</h3>
                    <p>Contul și istoricul tău de cumpărături sunt strict private. Folosim token-uri criptate pentru o experiență de navigare impenetrabilă.</p>
                </div>

                <div className="premium-card">
                    <span className="premium-icon">⚡</span>
                    <h3>Stoc în Timp Real</h3>
                    <p>Fără surprize la finalizare. Fiecare mărime este sincronizată instantaneu cu baza noastră de date MySQL. Dacă o poți adăuga în coș, este deja a ta.</p>
                </div>

                <div className="premium-card">
                    <span className="premium-icon">📦</span>
                    <h3>Plată la Destinație</h3>
                    <p>Livrăm oriunde în țară pe baza detaliilor tale exacte. Verifici comanda la ușă și achiți ramburs. Fără carduri reținute în sistem.</p>
                </div>

            </section>

            {/* 3. Recomandări integrate în noul design */}
            <section className="home-recs-premium">
                <h2 className="premium-section-title">Piese Esențiale</h2>
                <RecommendedProducts />
            </section>

        </div>
    );
};

export default Home;
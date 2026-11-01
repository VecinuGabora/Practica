import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import { useCart } from '../hooks/useCart.js';
import '../styles/Checkout.css';

const Checkout = () => {
    // Stările pentru formularul de adresă
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('Moldova');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { cartTotal, fetchCart, cartItems } = useCart();
    const navigate = useNavigate();

    // Dacă încearcă să intre pe checkout cu coșul gol, îl trimitem la magazin
    if (cartItems.length === 0) {
        navigate('/magazin');
        return null;
    }

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Salvăm adresa în baza de date
            const addressResponse = await API.post('/orders/address', {
                street,
                city,
                zip_code: zipCode,
                country
            });

            const addressId = addressResponse.data.addressId;

            // 2. Plasăm comanda folosind ID-ul adresei tocmai create
            await API.post('/orders', {
                shipping_address_id: addressId
            });

            // 3. Reîncărcăm coșul (care acum va fi gol pentru că serverul l-a șters)
            await fetchCart();

            // 4. Afișăm un mesaj de succes și ducem clientul pe pagina principală
            alert('Felicitări! Comanda a fost plasată cu succes!');
            navigate('/');

        } catch (err) {
            setError(err.response?.data?.message || 'A apărut o eroare la procesarea comenzii.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-card">
                <h2>Detalii Livrare</h2>
                <p className="checkout-subtitle">Total de plată: <strong>{cartTotal} MDL</strong></p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleCheckout} className="checkout-form">
                    <div className="form-group">
                        <label>Strada și numărul</label>
                        <input
                            type="text"
                            required
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder="ex: Str. Studenților 9/7"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Oraș</label>
                            <input
                                type="text"
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="ex: Chișinău"
                            />
                        </div>
                        <div className="form-group">
                            <label>Cod Poștal</label>
                            <input
                                type="text"
                                required
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                placeholder="ex: MD-2045"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Țara</label>
                        <input
                            type="text"
                            required
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary checkout-submit-btn" disabled={isLoading}>
                        {isLoading ? 'Se procesează...' : 'Confirmă Comanda'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import { useCart } from '../hooks/useCart.js';
import '../styles/Checkout.css';

const Checkout = () => {
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('Moldova');
    const [paymentMethod, setPaymentMethod] = useState('ramburs'); // NOU: Starea pentru metoda de plată

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { cartTotal, fetchCart, cartItems } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        navigate('/magazin');
        return null;
    }

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Salvăm adresa
            const addressResponse = await API.post('/orders/address', {
                street, city, zip_code: zipCode, country
            });
            const addressId = addressResponse.data.addressId;

            // 2. Plasăm comanda
            const orderResponse = await API.post('/orders', {
                shipping_address_id: addressId
            });
            const { orderId, total } = orderResponse.data;

            // 3. Verificăm metoda de plată
            if (paymentMethod === 'stripe') {
                // Dacă e Stripe, cerem URL-ul de plată și redirecționăm
                const stripeResponse = await API.post('/payment/create-checkout-session', {
                    orderId: orderId,
                    totalAmount: total
                });
                window.location.href = stripeResponse.data.url; // Redirecționare către Stripe
            } else {
                // Dacă e Ramburs, terminăm fluxul clasic
                await fetchCart();
                alert('Felicitări! Comanda a fost plasată cu succes (Plată la livrare).');
                navigate('/');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'A apărut o eroare la procesarea comenzii.');
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
                        <input type="text" required value={street} onChange={(e) => setStreet(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Oraș</label>
                            <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Cod Poștal</label>
                            <input type="text" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Țara</label>
                        <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} />
                    </div>

                    {/* SELECTOR METODĂ DE PLATĂ */}
                    <div className="form-group" style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                        <label style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'block' }}>Metodă de plată</label>
                        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="ramburs"
                                    checked={paymentMethod === 'ramburs'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                Plată la livrare (Ramburs)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="stripe"
                                    checked={paymentMethod === 'stripe'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                Plată cu Cardul (Securizat prin Stripe)
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary checkout-submit-btn" disabled={isLoading} style={{ marginTop: '2rem' }}>
                        {isLoading ? 'Se procesează...' : (paymentMethod === 'stripe' ? 'Plătește online' : 'Confirmă Comanda')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
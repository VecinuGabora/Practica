import { createContext, useState, useEffect } from 'react';
import API from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js'; // Avem nevoie de auth pentru a ști dacă userul e logat

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { token } = useAuth(); // Extragem token-ul din sistemul de auth
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    // Funcția care aduce coșul din backend
    const fetchCart = async () => {
        if (!token) {
            // Dacă userul dă logout, golim coșul vizual
            setCartItems([]);
            setCartTotal(0);
            return;
        }

        try {
            const response = await API.get('/cart');
            setCartItems(response.data.items);
            setCartTotal(response.data.cartTotal);
        } catch (error) {
            console.error('Eroare la încărcarea coșului:', error);
        }
    };

    // Apelăm fetchCart de fiecare dată când se schimbă token-ul (la login/logout)
    useEffect(() => {
        fetchCart();
    }, [token]);

    // Funcția pentru adăugarea în coș (va fi apelată de pe pagina de Magazin)
    const addToCart = async (productVariantId, quantity = 1) => {
        if (!token) {
            alert('Te rugăm să te autentifici pentru a adăuga produse în coș!');
            return;
        }

        try {
            await API.post('/cart/add', {
                product_variant_id: productVariantId,
                quantity: quantity
            });
            // După ce adăugarea e gata în backend, reîncărcăm coșul ca să actualizăm numărul de pe Navbar
            await fetchCart();
            alert('Produs adăugat în coș cu succes!');
        } catch (error) {
            alert(error.response?.data?.message || 'Eroare la adăugarea în coș');
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, cartTotal, addToCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
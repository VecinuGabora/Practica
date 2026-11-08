import { createContext, useState, useEffect } from 'react';
import API from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();

    // Aducem coșul din baza de date la logare
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const response = await API.get('/cart');
            // Backend-ul tău întoarce { items: [...], cartTotal: ... }
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error("Eroare la aducerea coșului:", error);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        if (!user) {
            alert("Trebuie să fii logat pentru a adăuga în coș!");
            return;
        }

        try {
            // AICI ESTE REPARAȚIA: Trimitem product_variant_id exact cum cere backend-ul tău!
            await API.post('/cart/add', {
                product_variant_id: product.variant_id || product.variantId,
                quantity: quantity
            });

            // După ce l-am salvat în MySQL, cerem noul coș ca să se actualizeze pe ecran
            fetchCart();

        } catch (error) {
            console.error("Eroare la adăugarea în coș:", error);
            alert(error.response?.data?.message || "Eroare la adăugarea în coș");
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
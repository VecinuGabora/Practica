import { createContext, useState, useEffect } from 'react';
import API from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
            setCartTotal(0);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const response = await API.get('/cart');
            setCartItems(response.data.items || []);
            setCartTotal(response.data.cartTotal || 0);
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
            await API.post('/cart/add', {
                product_variant_id: product.variant_id || product.variantId,
                quantity: quantity
            });
            fetchCart();
        } catch (error) {
            console.error("Eroare la adăugarea în coș:", error);
            alert(error.response?.data?.message || "Eroare la adăugarea în coș");
        }
    };

    // FUNCȚIA NOUĂ DE ȘTERGERE
    const removeFromCart = async (cartItemId) => {
        try {
            await API.delete(`/cart/remove/${cartItemId}`);
            fetchCart(); // Cerem iar coșul de la server ca să se actualizeze ecranul și totalul
        } catch (error) {
            console.error("Eroare la stergerea din cos:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, cartTotal, addToCart, fetchCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
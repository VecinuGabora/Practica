import { createContext, useState, useEffect } from 'react';
import API from '../services/api.js';

// Creăm contextul
export const AuthContext = createContext();

// Componenta care va „înveli” aplicația
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Pentru a preveni refresh-ul ciudat

    // Verificăm dacă avem deja un token salvat în browser (în localStorage) la deschiderea site-ului
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));

            // Adăugăm automat tokenul la fiecare cerere Axios viitoare
            API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    // Funcția apelată când utilizatorul se loghează cu succes
    const loginAction = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        API.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    // Funcția apelată când utilizatorul dă Logout
    const logoutAction = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete API.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loginAction, logoutAction, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { loginAction } = useAuth(); // Aducem funcția de salvare din Context
    const navigate = useNavigate(); // Pentru a-l trimite pe Acasă după logare

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenim refresh-ul paginii la submit
        setError('');
        setIsLoading(true);

        try {
            // Trimitem cererea exact cum făceam în api-tests.http
            const response = await API.post('/auth/login', { email, password });

            // Salvăm tokenul și datele în sistem
            loginAction(response.data.token, response.data.user);

            // Redirecționăm clientul înapoi la magazin
            navigate('/magazin');
        } catch (err) {
            setError(err.response?.data?.message || 'A apărut o eroare la conectare.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Bine ai revenit</h2>
                <p className="login-subtitle">Conectează-te la contul tău</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="adrian@test.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Parolă</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
                        {isLoading ? 'Se conectează...' : 'Autentificare'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
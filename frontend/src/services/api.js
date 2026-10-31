import axios from 'axios';

// Creăm o instanță axios pre-configurată cu URL-ul de bază al serverului nostru Node
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Aici vom adăuga mai târziu un interceptor pentru Token, când ajungem la Login
// ...

export default API;
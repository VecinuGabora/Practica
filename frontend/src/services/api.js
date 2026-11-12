import axios from 'axios';

const API = axios.create({
    // Am pus adresa de pe Render în loc de localhost
    baseURL: 'https://magazin-backend-api.onrender.com/api',
});

// ... restul codului tau (interceptori pentru token, etc.)
export default API;
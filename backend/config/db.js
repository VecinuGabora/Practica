import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Încărcăm variabilele din fișierul .env
dotenv.config();

// Creăm conexiunea cu baza de date AIVEN CLOUD
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
        rejectUnauthorized: false // Obligatoriu pentru servere cloud
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testăm conexiunea încă de la pornire
pool.getConnection()
    .then((connection) => {
        console.log(`[DATABASE] Conectat cu succes la MySQL Cloud (baza de date: ${process.env.DB_NAME})`);
        connection.release(); // Eliberăm conexiunea
    })
    .catch((error) => {
        console.error('[DATABASE] Eroare la conectarea cu MySQL Cloud:', error.message);
    });

export default pool;
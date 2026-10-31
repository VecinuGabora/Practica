import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json({ message: 'Salut din backend! Serverul functioneaza corect.' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`[SERVER] Backend-ul ruleaza pe portul ${PORT}`);
});
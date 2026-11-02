import { useState } from 'react';
import API from '../../services/api.js';

const AddProduct = () => {
    // 1. Stările pentru fiecare câmp de bază
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [categoryId, setCategoryId] = useState('1');
    const [image, setImage] = useState(null);

    // Stările pentru Varianta Obligatorie (deoarece backend-ul o cere)
    const [size, setSize] = useState('M');
    const [color, setColor] = useState('Negru');
    const [stock, setStock] = useState('10');
    const [sku, setSku] = useState('SKU-TEST-001');

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            // PASUL A: Creăm produsul cu tot cu varianta obligatorie
            const productResponse = await API.post('/products', {
                name,
                description,
                base_price: parseFloat(basePrice),
                category_id: parseInt(categoryId) || null,
                variants: [
                    {
                        size,
                        color,
                        stock: parseInt(stock),
                        sku
                    }
                ]
            });

            // Primim ID-ul noului produs
            const newProductId = productResponse.data.productId;

            // PASUL B: Trimitem poza pe Cloudinary
            if (image) {
                const formData = new FormData();
                formData.append('product_id', newProductId);
                formData.append('is_primary', 'true');
                formData.append('image', image);

                await API.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setMessage('Produsul, stocul și imaginea au fost adăugate cu succes!');

            // Curățăm formularul
            setName('');
            setDescription('');
            setBasePrice('');
            setSku(`SKU-TEST-00${Math.floor(Math.random() * 100)}`); // generăm alt sku
            setImage(null);
            document.getElementById('image-upload').value = '';

        } catch (error) {
            console.error("Eroare la adăugarea produsului:", error);
            setMessage('Eroare: Nu s-a putut salva produsul.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-form-container">
            <h2>Adaugă Produs Nou</h2>

            {message && <div className={message.includes('succes') ? 'alert alert-success' : 'alert alert-error'}>{message}</div>}

            <form onSubmit={handleSubmit} className="admin-form">

                {/* INFORMAȚII DE BAZĂ */}
                <div className="form-group">
                    <label>Nume Produs</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Hanorac" />
                </div>

                <div className="form-group">
                    <label>Descriere</label>
                    <textarea required rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Preț de Bază (MDL)</label>
                        <input type="number" required min="1" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>ID Categorie</label>
                        <input type="number" required min="1" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
                    </div>
                </div>

                <hr style={{margin: '1rem 0', borderColor: '#e5e7eb'}} />
                <h4>Setări Variantă & Stoc</h4>

                {/* INFORMAȚII VARIANTĂ (OBLIGATORII PENTRU BACKEND) */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Mărime</label>
                        <input type="text" required value={size} onChange={(e) => setSize(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Culoare</label>
                        <input type="text" required value={color} onChange={(e) => setColor(e.target.value)} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Stoc Disponibil</label>
                        <input type="number" required min="1" value={stock} onChange={(e) => setStock(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Cod SKU Unic</label>
                        <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} />
                    </div>
                </div>

                <div className="form-group image-upload-group">
                    <label>Imagine Produs</label>
                    <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} className="file-input" />
                    <small>Se acceptă doar JPG, PNG, WEBP.</small>
                </div>

                <button type="submit" className="btn btn-primary admin-submit-btn" disabled={isLoading}>
                    {isLoading ? 'Se procesează...' : 'Salvează Produsul'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
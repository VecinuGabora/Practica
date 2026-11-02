import { useState, useEffect } from 'react';
import API from '../../services/api.js';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Funcția care aduce produsele la încărcarea paginii
    const fetchProducts = async () => {
        try {
            const response = await API.get('/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Eroare la aducerea produselor:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Funcția care șterge un produs
    const handleDelete = async (id) => {
        const confirmare = window.confirm("Ești sigur că vrei să ștergi acest produs?");
        if (!confirmare) return;

        try {
            await API.delete(`/products/${id}`);
            // După ce s-a șters din baza de date, actualizăm și tabelul de pe ecran
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error("Eroare la ștergere:", error);
            alert("Nu s-a putut șterge produsul.");
        }
    };

    if (loading) return <div>Se încarcă produsele...</div>;

    return (
        <div>
            <h2 style={{color: 'var(--color-primary)', marginBottom: '1.5rem'}}>Gestionează Produsele</h2>

            {products.length === 0 ? (
                <p>Nu există produse în baza de date.</p>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imagine</th>
                            <th>Nume Produs</th>
                            <th>Preț (MDL)</th>
                            <th>Acțiuni</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>#{product.id}</td>
                                <td>
                                    {product.image_url ? (
                                        <img src={product.image_url} alt="Produs" style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px'}} />
                                    ) : (
                                        <span style={{color: '#9ca3af', fontSize: '0.8rem'}}>Fără poză</span>
                                    )}
                                </td>
                                <td style={{fontWeight: 'bold'}}>{product.name}</td>
                                <td>{product.base_price}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Șterge
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
import db from '../config/db.js';

export const uploadProductImage = async (req, res) => {
    // 1. Verificăm dacă fișierul a fost trimis cu succes
    if (!req.file) {
        return res.status(400).json({ message: 'Nicio imagine nu a fost încărcată.' });
    }

    const { product_id, is_primary } = req.body;

    if (!product_id) {
        return res.status(400).json({ message: 'Trebuie să specifici ID-ul produsului!' });
    }

    // Cloudinary a terminat treaba și ne-a trimis link-ul direct (path)
    const imageUrl = req.file.path;

    // Convertim string-ul "true"/"false" venit din form-data într-un boolean real pentru MySQL
    const isPrimaryBool = is_primary === 'true' || is_primary === true ? 1 : 0;

    try {
        // Salvăm link-ul pozei în baza de date, legat de produsul respectiv
        const [result] = await db.query(
            'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
            [product_id, imageUrl, isPrimaryBool]
        );

        res.status(201).json({
            message: 'Imagine încărcată și salvată cu succes!',
            imageId: result.insertId,
            imageUrl: imageUrl
        });

    } catch (error) {
        console.error('[UPLOAD ERROR]', error);
        res.status(500).json({ message: 'Eroare la salvarea imaginii în baza de date.' });
    }
};
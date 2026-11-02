import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Configurăm legătura cu contul tău
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configurăm unde și cum se vor salva pozele
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'magazin_online_haine', // Cloudinary va crea acest folder în contul tău
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Acceptăm doar imagini
        transformation: [{ width: 800, height: 800, crop: 'limit' }] // Limităm mărimea să nu ocupe mult spațiu
    }
});

// 3. Creăm "muncitorul" care va primi poza și o va urca folosind setările de mai sus
export const upload = multer({ storage: storage });
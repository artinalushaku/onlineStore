import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Konfigurimi i ruajtjes se file-ve
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');

        // Krijojme direktorine nese nuk ekziston
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Gjenerojme emrin e file-it per te shmangur konfliktet
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Filtri per tipe file-sh te lejuara
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error('Vetem imazhe ne formatet JPEG, JPG, PNG dhe WEBP jane te lejuara'), false);
    }
};

// Inicializimi i multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Maksimumi 5MB
    }
});

export default upload;
import express from 'express';
import upload from '../middleware/upload.middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Rruga për ngarkimin e imazheve
router.post('/', upload.array('images', 5), (req, res) => {
    try {
        console.log('Kërkesa për ngarkim të imazheve u prit');
        console.log('Files:', req.files);
        
        if (!req.files || req.files.length === 0) {
            console.log('Nuk u gjetën skedarë në kërkesë');
            return res.status(400).json({ message: 'Nuk u ngarkua asnjë imazh' });
        }

        // Kthe URL-të e imazheve të ngarkuara
        const urls = req.files.map(file => {
            console.log('Skedari i ngarkuar:', file);
            return `/uploads/${file.filename}`;
        });

        console.log('URL-të e krijuara:', urls);
        res.status(200).json({ urls });
    } catch (error) {
        console.error('Gabim gjatë ngarkimit të imazheve:', error);
        console.error('Detajet e gabimit:', error.message);
        res.status(500).json({ 
            message: 'Gabim në server gjatë ngarkimit të imazheve',
            error: error.message 
        });
    }
});

export default router; 
import Product from '../models/mysql/product.model.js';
import Category from '../models/mysql/category.model.js';

const adminController = {
    // Marrja e të gjitha produkteve
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.findAll({
                include: [Category]
            });
            res.json(products);
        } catch (error) {
            console.error('Gabim gjatë marrjes së produkteve:', error);
            res.status(500).json({ message: 'Gabim në server' });
        }
    },

    // Shtimi i produktit të ri
    createProduct: async (req, res) => {
        try {
            const { name, description, price, stock, categoryId, images, sku } = req.body;
            const product = await Product.create({
                name,
                description,
                price,
                stock,
                categoryId,
                images: images || [],
                sku
            });
            res.status(201).json(product);
        } catch (error) {
            console.error('Gabim gjatë krijimit të produktit:', error);
            res.status(500).json({ message: 'Gabim në server' });
        }
    },

    // Përditësimi i produktit
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, price, stock, categoryId, images } = req.body;
            
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Produkti nuk u gjet' });
            }

            await product.update({
                name,
                description,
                price,
                stock,
                categoryId,
                images: images || product.images
            });

            res.json(product);
        } catch (error) {
            console.error('Gabim gjatë përditësimit të produktit:', error);
            res.status(500).json({ message: 'Gabim në server' });
        }
    },

    // Fshirja e produktit
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            
            if (!product) {
                return res.status(404).json({ message: 'Produkti nuk u gjet' });
            }

            await product.destroy();
            res.json({ message: 'Produkti u fshi me sukses' });
        } catch (error) {
            console.error('Gabim gjatë fshirjes së produktit:', error);
            res.status(500).json({ message: 'Gabim në server' });
        }
    },

    // Marrja e të gjitha kategorive
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.findAll();
            res.json(categories);
        } catch (error) {
            console.error('Gabim gjatë marrjes së kategorive:', error);
            res.status(500).json({ message: 'Gabim në server' });
        }
    },

    // Ngarkimi i imazheve
    uploadImages: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'Nuk u ngarkua asnjë imazh' });
            }

            const urls = req.files.map(file => `/uploads/${file.filename}`);
            res.json({ urls });
        } catch (error) {
            res.status(500).json({ message: 'Gabim gjatë ngarkimit të imazheve:' });
        }
    }
};

export default adminController; 
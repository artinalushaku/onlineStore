import Product from '../models/mysql/product.model.js';
import Category from '../models/mysql/category.model.js';
import sequelize from '../config/db.mysql.js';
import { Op } from 'sequelize';

// Kontrolluesi i produkteve
const productController = {
  // Krijimi i nje produkti te ri (vetem admin)
  createProduct: async (req, res) => {
    try {
      const { name, description, price, stock, images, category, brand, sku } = req.body;
      
      // Verifikojme nese SKU ekziston tashme
      const existingProduct = await Product.findOne({ where: { sku } });
      if (existingProduct) {
        return res.status(400).json({ message: 'Produkti me kete SKU ekziston tashme' });
      }
      
      // Krijojme produktin e ri
      const product = await Product.create({
        name,
        description,
        price,
        stock,
        images: images || [],
        category,
        brand,
        sku
      });
      
      return res.status(201).json(product);
    } catch (error) {
      console.error('Gabim gjate krijimit te produktit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate krijimit te produktit' });
    }
  },
  
  // Marrja e te gjitha produkteve me filtrim dhe paginim
  getAllProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const whereClause = { isActive: true };
      
      // Debug: log all query params
      console.log('Product filter query:', req.query);

      // Filtrim sipas kategorise (prano 'categoryId' si parametër)
      if (req.query.categoryId) {
        // Gjej nënkategoritë e kësaj kategorie
        const subcategories = await Category.findAll({ where: { parent_id: req.query.categoryId } });
        const subcategoryIds = subcategories.map(cat => cat.id);
        // Përfshi edhe vetë kategorinë
        whereClause.categoryId = [req.query.categoryId, ...subcategoryIds];
      } else if (req.query.category) {
        whereClause.categoryId = req.query.category;
      }
      
      // Filtrim sipas çmimit
      if (req.query.minPrice && req.query.maxPrice) {
        whereClause.price = {
          [Op.between]: [parseFloat(req.query.minPrice), parseFloat(req.query.maxPrice)]
        };
      } else if (req.query.minPrice) {
        whereClause.price = {
          [Op.gte]: parseFloat(req.query.minPrice)
        };
      } else if (req.query.maxPrice) {
        whereClause.price = {
          [Op.lte]: parseFloat(req.query.maxPrice)
        };
      }
      
      // Kerkim sipas emrit (support both 'query' and 'search')
      const searchTerm = req.query.query || req.query.search;
      if (searchTerm) {
        whereClause.name = {
          [Op.like]: `%${searchTerm}%`
        };
      }

      // Logjika e sortimit
      let order = [['createdAt', 'DESC']]; // default: newest
      if (req.query.sort) {
        switch (req.query.sort) {
          case 'price_asc':
            order = [['price', 'ASC']];
            break;
          case 'price_desc':
            order = [['price', 'DESC']];
            break;
          case 'rating':
            order = [['rating', 'DESC']];
            break;
          case 'newest':
          default:
            order = [['createdAt', 'DESC']];
        }
      }
      
      // Marrja e te dhenave
      const { count, rows: products } = await Product.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Category,
            attributes: ['id', 'name', 'slug']
          }
        ],
        limit,
        offset,
        order
      });
      
      return res.status(200).json({
        products,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      console.error('Gabim gjate marrjes se produkteve:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se produkteve' });
    }
  },
  
  // Marrja e nje produkti te vetem sipas ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Produkti nuk u gjet' });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error('Gabim gjate marrjes se produktit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se produktit' });
    }
  },
  
  // Perditesimi i nje produkti (vetem admin)
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, stock, images, category, brand, isActive } = req.body;
      
      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Produkti nuk u gjet' });
      }
      
      // Perditesojme produktin
      await product.update({
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        stock: stock !== undefined ? stock : product.stock,
        images: images || product.images,
        category: category || product.category,
        brand: brand || product.brand,
        isActive: isActive !== undefined ? isActive : product.isActive
      });
      
      return res.status(200).json(product);
    } catch (error) {
      console.error('Gabim gjate perditesimit te produktit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate perditesimit te produktit' });
    }
  },
  
  // Fshirja e nje produkti (vetem admin)
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      
      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Produkti nuk u gjet' });
      }
      
      // Fshirja logjike (ndryshojme isActive ne false)
      await product.update({ isActive: false });
      
      return res.status(200).json({ message: 'Produkti u fshi me sukses' });
    } catch (error) {
      console.error('Gabim gjate fshirjes se produktit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate fshirjes se produktit' });
    }
  }
};

export default productController;
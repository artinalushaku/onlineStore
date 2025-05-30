const Wishlist = require('../models/mongo/wishlist.model');
const Product = require('../models/mysql/product.model');

// Kontrolluesi i listes se deshirave
const wishlistController = {
  // Marrja e listes se deshirave te perdoruesit
  getWishlist: async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ userId: req.user.id });
      if (!wishlist) {
        return res.status(200).json({ items: [] });
      }
      return res.status(200).json(wishlist);
    } catch (error) {
      console.error('Gabim gjatë marrjes së listës së dëshirave:', error);
      return res.status(500).json({ message: 'Gabim në server' });
    }
  },
  
  getWishlistCount: async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ userId: req.user.id });
      const count = wishlist ? wishlist.items.length : 0;
      return res.status(200).json({ count });
    } catch (error) {
      console.error('Gabim gjatë marrjes së numrit të artikujve:', error);
      return res.status(500).json({ message: 'Gabim në server' });
    }
  },
  
  // Shtimi i nje produkti ne listen e deshirave
  addToWishlist: async (req, res) => {
    try {
      const { productId } = req.params;
      
      // Merr produktin nga MySQL
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Produkti nuk u gjet' });
      }

      let wishlist = await Wishlist.findOne({ userId: req.user.id });
      
      if (!wishlist) {
        // Krijo listë të re të dëshirave
        wishlist = await Wishlist.create({
          userId: req.user.id,
          items: [{
            productId: product.id,
            name: product.name,
            price: product.price,
            image: Array.isArray(product.images) ? product.images[0] : (product.images || '')
          }]
        });
      } else {
        // Kontrollo nëse produkti ekziston tashmë në listë
        const existingItem = wishlist.items.find(item => item.productId === productId);
        
        if (existingItem) {
          return res.status(400).json({ message: 'Produkti është tashmë në listën e dëshirave' });
        }
        
        // Shto produkt të ri
        wishlist.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: Array.isArray(product.images) ? product.images[0] : (product.images || '')
        });
        
        await wishlist.save();
      }

      return res.status(200).json({ message: 'Produkti u shtua në listën e dëshirave' });
    } catch (error) {
      console.error('Gabim gjatë shtimit të produktit:', error);
      return res.status(500).json({ message: 'Gabim në server' });
    }
  },
  
  // Heqja e nje produkti nga lista e deshirave
  removeFromWishlist: async (req, res) => {
    try {
      const { productId } = req.params;

      const wishlist = await Wishlist.findOne({ userId: req.user.id });
      if (!wishlist) {
        return res.status(404).json({ message: 'Lista e dëshirave nuk u gjet' });
      }

      wishlist.items = wishlist.items.filter(item => item.productId !== parseInt(productId));
      await wishlist.save();

      return res.status(200).json({ message: 'Produkti u fshi nga lista e dëshirave' });
    } catch (error) {
      console.error('Gabim gjatë fshirjes së produktit:', error);
      return res.status(500).json({ message: 'Gabim në server' });
    }
  },
  
  // Pastrimi i listes se deshirave
  clearWishlist: async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ userId: req.user.id });
      if (!wishlist) {
        return res.status(404).json({ message: 'Lista e dëshirave nuk u gjet' });
      }

      wishlist.items = [];
      await wishlist.save();

      return res.status(200).json({ message: 'Lista e dëshirave u pastrua' });
    } catch (error) {
      console.error('Gabim gjatë pastrimit të listës së dëshirave:', error);
      return res.status(500).json({ message: 'Gabim në server' });
    }
  }
};

module.exports = wishlistController;
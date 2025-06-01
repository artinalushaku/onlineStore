import Review from '../models/mongo/review.model.js';
import Product from '../models/mysql/product.model.js';

// Kontrolluesi i komenteve
const reviewController = {
  // Krijimi i nje komenti te ri
  createReview: async (req, res) => {
    try {
      const { productId, rating, comment, images } = req.body;
      const userId = req.user.id;
      const userName = `${req.user.firstName} ${req.user.lastName}`;
      
      // Verifikojme nese produkti ekziston
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Produkti nuk u gjet' });
      }
      
      // Verifikojme nese perdoruesi ka bere tashme nje koment per kete produkt
      const existingReview = await Review.findOne({ userId, productId });
      if (existingReview) {
        return res.status(400).json({ message: 'Ju tashme keni komentuar kete produkt' });
      }
      
      // Krijojme komentin e ri
      const review = new Review({
        userId,
        userName,
        productId,
        rating,
        comment,
        images: images || [],
        verified: true // Supozojme se perdoruesi e ka blere produktin
      });
      
      await review.save();
      
      // Perditesojme vleresimin mesatar dhe numrin e komenteve te produktit
      const allReviews = await Review.find({ productId });
      const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
      
      await product.update({
        rating: avgRating.toFixed(2),
        reviewCount: allReviews.length
      });
      
      return res.status(201).json(review);
    } catch (error) {
      console.error('Gabim gjate krijimit te komentit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate krijimit te komentit' });
    }
  },
  
  // Marrja e komenteve per nje produkt
  getProductReviews: async (req, res) => {
    try {
      const { productId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Verifikojme nese produkti ekziston
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Produkti nuk u gjet' });
      }
      
      // Marrja e komenteve
      const reviews = await Review.find({ productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Review.countDocuments({ productId });
      
      return res.status(200).json({
        reviews,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    } catch (error) {
      console.error('Gabim gjate marrjes se komenteve:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se komenteve' });
    }
  },
  
  // Perditesimi i nje komenti
  updateReview: async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, comment, images } = req.body;
      const userId = req.user.id;
      
      // Gjejme komentin
      const review = await Review.findById(id);
      
      if (!review) {
        return res.status(404).json({ message: 'Komenti nuk u gjet' });
      }
      
      // Verifikojme nese perdoruesi eshte pronari i komentit
      if (review.userId !== userId) {
        return res.status(403).json({ message: 'Ju nuk keni te drejte te ndryshoni kete koment' });
      }
      
      // Perditesojme komentin
      review.rating = rating || review.rating;
      review.comment = comment || review.comment;
      review.images = images || review.images;
      
      await review.save();
      
      // Perditesojme vleresimin mesatar te produktit
      const productId = review.productId;
      const allReviews = await Review.find({ productId });
      const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
      
      await Product.update({
        rating: avgRating.toFixed(2)
      }, {
        where: { id: productId }
      });
      
      return res.status(200).json(review);
    } catch (error) {
      console.error('Gabim gjate perditesimit te komentit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate perditesimit te komentit' });
    }
  },
  
  // Fshirja e nje komenti
  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      
      // Gjejme komentin
      const review = await Review.findById(id);
      
      if (!review) {
        return res.status(404).json({ message: 'Komenti nuk u gjet' });
      }
      
      // Verifikojme nese perdoruesi eshte pronari i komentit ose admin
      if (review.userId !== userId && userRole !== 'admin') {
        return res.status(403).json({ message: 'Ju nuk keni te drejte te fshini kete koment' });
      }
      
      const productId = review.productId;
      
      // Fshijme komentin
      await Review.findByIdAndDelete(id);
      
      // Perditesojme vleresimin mesatar dhe numrin e komenteve te produktit
      const allReviews = await Review.find({ productId });
      
      if (allReviews.length > 0) {
        const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
        
        await Product.update({
          rating: avgRating.toFixed(2),
          reviewCount: allReviews.length
        }, {
          where: { id: productId }
        });
      } else {
        // Nese nuk ka me komente, vendosim vleresimin dhe numrin e komenteve ne 0
        await Product.update({
          rating: 0,
          reviewCount: 0
        }, {
          where: { id: productId }
        });
      }

      return res.status(200).json({ message: 'Komenti u fshi me sukses' });
    } catch (error) {
      console.error('Gabim gjate fshirjes se komentit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate fshirjes se komentit' });
    }
  }
};

export default reviewController;
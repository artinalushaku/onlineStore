import Wishlist from '../models/mongo/wishlist.model.js';
import Product from '../models/mysql/product.model.js';

// Kontrolluesi i listes se deshirave
const wishlistController = {
    // Marrja e listes se deshirave te perdoruesit
    getUserWishlist: async (req, res) => {
        try {
            const userId = req.user.id;

            // Gjejme wishlist-en e perdoruesit
            let wishlist = await Wishlist.findOne({ userId });

            // Nese nuk ekziston, krijojme nje te re te zbrazet
            if (!wishlist) {
                wishlist = new Wishlist({
                    userId,
                    items: []
                });
                await wishlist.save();
            }

            return res.status(200).json(wishlist);
        } catch (error) {
            console.error('Gabim gjate marrjes se wishlist:', error);
            return res.status(500).json({ message: 'Gabim ne server gjate marrjes se wishlist' });
        }
    },

    // Shtimi i nje produkti ne listen e deshirave
    addToWishlist: async (req, res) => {
        try {
            const { productId } = req.body;
            const userId = req.user.id;

            // Verifikojme nese produkti ekziston
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Produkti nuk u gjet' });
            }

            // Gjejme wishlist-en e perdoruesit
            let wishlist = await Wishlist.findOne({ userId });

            // Nese nuk ekziston, krijojme nje te re
            if (!wishlist) {
                wishlist = new Wishlist({
                    userId,
                    items: []
                });
            }

            // Kontrollojme nese produkti eshte tashme ne wishlist
            const itemExists = wishlist.items.some(item => item.productId == productId);

            if (itemExists) {
                return res.status(400).json({ message: 'Produkti eshte tashme ne listen e deshirave' });
            }

            // Shtojme produktin ne wishlist
            wishlist.items.push({
                productId,
                name: product.name,
                price: product.price,
                image: product.images[0] || '',
                addedAt: new Date()
            });

            await wishlist.save();

            return res.status(200).json(wishlist);
        } catch (error) {
            console.error('Gabim gjate shtimit ne wishlist:', error);
            return res.status(500).json({ message: 'Gabim ne server gjate shtimit ne wishlist' });
        }
    },

    // Heqja e nje produkti nga lista e deshirave
    removeFromWishlist: async (req, res) => {
        try {
            const { productId } = req.params;
            const userId = req.user.id;

            // Gjejme wishlist-en e perdoruesit
            const wishlist = await Wishlist.findOne({ userId });

            if (!wishlist) {
                return res.status(404).json({ message: 'Lista e deshirave nuk u gjet' });
            }

            // Heqim produktin nga lista
            wishlist.items = wishlist.items.filter(item => item.productId != productId);

            await wishlist.save();

            return res.status(200).json(wishlist);
        } catch (error) {
            console.error('Gabim gjate heqjes nga wishlist:', error);
            return res.status(500).json({ message: 'Gabim ne server gjate heqjes nga wishlist' });
        }
    },

    // Pastrimi i listes se deshirave
    clearWishlist: async (req, res) => {
        try {
            const userId = req.user.id;

            // Gjejme wishlist-en e perdoruesit
            const wishlist = await Wishlist.findOne({ userId });

            if (!wishlist) {
                return res.status(404).json({ message: 'Lista e deshirave nuk u gjet' });
            }

            // Zbrazim listen
            wishlist.items = [];

            await wishlist.save();

            return res.status(200).json({ message: 'Lista e deshirave u pastrua me sukses' });
        } catch (error) {
            console.error('Gabim gjate pastrimit te wishlist:', error);
            return res.status(500).json({ message: 'Gabim ne server gjate pastrimit te wishlist' });
        }
    }
};

export default wishlistController;
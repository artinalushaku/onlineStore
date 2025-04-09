const Cart = require('../models/mongo/cart.model');
const Product = require('../models/mysql/product.model');

// Kontrolluesi i shportes
const cartController = {
    // Marrja e shportes se perdoruesit
    getUserCart: async (req, res) => {
        try {
            const userId = req.user.id;

            // Gjejme shporten e perdoruesit
            let cart = await Cart.findOne({ userId });

            // Nese nuk ekziston, krijojme nje te re te zbrazet
            if (!cart) {
                cart = new Cart({
                    userId,
                    items: [],
                    total: 0
                });
                await cart.save();
            }

            return res.status(200).json(cart);
        } catch (error) {
            console.error('Gabim gjate marrjes se shportes:', error);
            return res.status(500).json({ message: 'Gabim ne server gjate marrjes se shportes' });
        }
    },

    // Shtimi i nje produkti ne shporte
    addToCart: async (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user.id;

            // Verifikojme nese produkti ekziston
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Produkti nuk u gjet' });
            }

            // Verifikojme nese ka stok te mjaftueshem
            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `Nuk ka stok te mjaftueshem. Disponueshmeria aktuale: ${product.stock}`
                });
            }

            // Gjejme shporten e perdoruesit
            let cart = await Cart.findOne({ userId });

            // Nese nuk ekziston, krijojme nje te re
            if (!cart) {
                cart = new Cart({
                    userId,
                    items: [],
                    total: 0
                });
            }

            // Kontrollojme nese produkti eshte tashme ne shporte
            const itemIndex = cart.items.findIndex(item => item.productId == productId);

            if (itemIndex > -1) {
                // Nese produkti eshte tashme ne shporte, perditesojme sasine
                const newQuantity = cart.items[itemIndex].quantity + quantity;

                // Verifikojme stokun per sasine e re
                if (product.stock < newQuantity) {
                    return res.status(400).json({
                        message: `Nuk ka stok te mjaftueshem. Disponueshmeria aktuale: ${product.stock}`
                    });
                }

                cart.items[itemIndex].quantity = newQuantity;
                cart.items[itemIndex].price = product.price; // Perditesojme çmimin ne rast ndryshimi
            } else {
                // Nese produkti nuk eshte ne shporte, e shtojme
                cart.items.push({
                    productId,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image: product.images[0] || ''
                });
            }

            // Rillogarisim totalin
            cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

            await cart.save();

            return res.status(200).json(cart);
        } catch (error) {
            console.error('Gabim gjate shtimit ne shporte:', error);
            return res.status(500).json({ message: 'Gabim ne server gjate shtimit ne shporte' });
        }
    },

    // Perditesimi i sasise se nje produkti ne shporte
    updateCartItem: async (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user.id;

            // Verifikojme nese produkti ekziston
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Produkti nuk u gjet' });
            }

            // Verifikojme nese ka stok te mjaftueshem
            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `Nuk ka stok te mjaftueshem. Disponueshmeria aktuale: ${product.stock}`
                });
            }

            // Gjejme shporten e perdoruesit
            const cart = await Cart.findOne({ userId });

            if (!cart) {
                return res.status(404).json({ message: 'Shporta nuk u gjet' });
            }

            // Gjejme produktin ne shporte
            const itemIndex = cart.items.findIndex(item => item.productId == productId);

            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Produkti nuk u gjet ne shporte' });
            }

            // Perditesojme sasine
            cart.items[itemIndex].quantity = quantity;
            cart.items[itemIndex].price = product.price; // Perditesojme çmimin ne rast ndryshimi

            // Rillogarisim totalin
            cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

            await cart.save();

            return res.status(200).json(cart);
        } catch (error) {
            console.error('Gabim gjate perditesimit te shportes:', error);
            return res.status(500).json({ message: 'Gabim ne server gjate perditesimit te shportes' });
        }
    },

    // Heqja e nje produkti nga shporta
    removeFromCart: async (req, res) => {
        try {
            const { productId } = req.params;
            const userId = req.user.id;

            // Gjejme shporten e perdoruesit
            const cart = await Cart.findOne({ userId });

            if (!cart) {
                return res.status(404).json({ message: 'Shporta nuk u gjet' });
            }

            // Heqim produktin nga shporta
            cart.items = cart.items.filter(item => item.productId != productId);

            // Rillogarisim totalin
            cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

            await cart.save();

            return res.status(200).json(cart);
        } catch (error) {
            console.error('Gabim gjate heqjes nga shporta:', error);
            return res.status(500).json({ message: 'Gabim ne server gjate heqjes nga shporta' });
        }
    },

    // Pastrimi i shportes
    clearCart: async (req, res) => {
        try {
            const userId = req.user.id;

            // Gjejme shporten e perdoruesit
            const cart = await Cart.findOne({ userId });

            if (!cart) {
                return res.status(404).json({ message: 'Shporta nuk u gjet' });
            }

            // Zbrazim shporten
            cart.items = [];
            cart.total = 0;

            await cart.save();

            return res.status(200).json({ message: 'Shporta u pastrua me sukses', cart });
        } catch (error) {
            console.error('Gabim gjate pastrimit te shportes:', error);
            return res.status(500).json({ message: 'Gabim ne server gjate pastrimit te shportes' });
        }
    }
};

module.exports = cartController;// JavaScript source code

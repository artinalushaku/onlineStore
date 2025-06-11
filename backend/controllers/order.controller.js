import Order from '../models/mysql/order.model.js';
import OrderItem from '../models/mysql/orderItem.model.js';
import Product from '../models/mysql/product.model.js';
import User from '../models/mysql/user.model.js';
import Cart from '../models/mongo/cart.model.js';
import Discount from '../models/mysql/discount.model.js';
import Shipping from '../models/mysql/shipping.model.js';
import Address from '../models/mysql/address.model.js';
import { Op } from 'sequelize';
import mongoose from 'mongoose';
import sequelize from '../config/db.mysql.js';

// Kontrolluesi i porosive
const orderController = {
  // Krijimi i nje porosie te re
  createOrder: async (req, res) => {
    // Perdorim transaksion per MySQL per te siguruar integritet te te dhenave
    const transaction = await sequelize.transaction();
    
    try {
      const {
        shipping,
        paymentMethod,
        discountCode,
        orderNotes
      } = req.body;
      
      const userId = req.user.id;
      
      // Gjejme shporten e perdoruesit
      const cart = await Cart.findOne({ userId });
      
      if (!cart || cart.items.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Shporta eshte e zbrazet' });
      }
      
      // Verifikojme dhe marrim metoden e dergeses
      const shippingMethod = await Shipping.findByPk(shipping.method);
      if (!shippingMethod || !shippingMethod.isActive) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Metoda e dergeses nuk u gjet ose nuk eshte aktive' });
      }
      
      // Verifikojme nese metoda e dergeses eshte e disponueshme per vendin e zgjedhur
      if (shippingMethod.countries.length > 0 && !shippingMethod.countries.includes(shipping.address.country)) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: 'Metoda e dergeses nuk eshte e disponueshme per vendin e zgjedhur'
        });
      }
      
      let discountAmount = 0;
      let validDiscount = null;
      
      // Verifikojme kodin e zbritjes nese eshte i dhene
      if (discountCode) {
        validDiscount = await Discount.findOne({
          where: {
            code: discountCode,
            isActive: true,
            validFrom: { [Op.lte]: new Date() },
            validUntil: { [Op.gte]: new Date() },
            [Op.or]: [
              { usageLimit: null },
              { usageCount: { [Op.lt]: sequelize.col('usage_limit') } }
            ]
          },
          transaction
        });
        
        if (validDiscount) {
          const cartTotal = cart.total;
          
          // Kontrollojme nese plotesohet vlera minimale e blerjes
          if (cartTotal >= validDiscount.minimumPurchase) {
            if (validDiscount.type === 'percentage') {
              discountAmount = (cartTotal * validDiscount.value) / 100;
              if (validDiscount.maxDiscount && discountAmount > validDiscount.maxDiscount) {
                discountAmount = validDiscount.maxDiscount;
              }
            } else if (validDiscount.type === 'fixed') {
              discountAmount = validDiscount.value;
              if (validDiscount.maxDiscount && discountAmount > validDiscount.maxDiscount) {
                discountAmount = validDiscount.maxDiscount;
              }
            }
            
            // Perditesojme numrin e perdorimeve te kodit
            await validDiscount.increment('usageCount', { transaction });
          } else {
            validDiscount = null;
          }
        }
      }
      
      // Llogarisim totalin e porosise
      const subtotal = Number(cart.total);
      const shippingCost = Number(shippingMethod.price);
      const total = subtotal + shippingCost - Number(discountAmount);
      
      // Fshi id nese ekziston ne adresen e zgjedhur
      const addressData = { ...shipping.address };
      delete addressData.id;
      
      // Kontrollo nese ekziston adresa per userin
      let shippingAddress = await Address.findOne({
        where: {
          userId: userId,
          firstName: addressData.firstName,
          lastName: addressData.lastName,
          address1: addressData.address1,
          address2: addressData.address2 || '',
          city: addressData.city,
          state: addressData.state,
          country: addressData.country,
          postalCode: addressData.postalCode,
          phone: addressData.phone,
          addressType: 'shipping'
        },
        transaction
      });
      
      if (!shippingAddress) {
        shippingAddress = await Address.create({
          ...addressData,
          userId: userId,
          addressType: 'shipping'
        }, { transaction });
      }
      
      // Mund të përdorësh të njëjtën për billing ose krijo një tjetër nëse ke formë të veçantë
      const billingAddress = shippingAddress;
      
      // Krijojme porosine
      const order = await Order.create({
        userId,
        status: 'pending',
        totalAmount: total,
        subTotal: subtotal,
        shippingAddressId: shippingAddress.id,
        billingAddressId: billingAddress.id,
        shippingMethod: shippingMethod.name,
        paymentMethod,
        paymentStatus: 'pending',
        discountCode: validDiscount ? validDiscount.code : null,
        discountAmount,
        orderNotes
      }, { transaction });
      
      // Krijojme artikujt e porosise dhe perditesojme inventarin
      for (const item of cart.items) {
        const product = await Product.findByPk(item.productId, { transaction });
        
        if (!product) {
          await transaction.rollback();
          return res.status(404).json({ message: `Produkti me ID ${item.productId} nuk u gjet` });
        }
        
        // Kontrollojme disponueshmerine e produktit
        if (product.stock < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Produkti ${product.name} ka vetem ${product.stock} njesi ne stok`
          });
        }
        
        // Krijojme elementin e porosise
        await OrderItem.create({
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          total: product.price * item.quantity,
          productName: product.name,
          productImage: product.images[0] || ''
        }, { transaction });
        
        // Perditesojme inventarin
        await product.update({
          stock: product.stock - item.quantity
        }, { transaction });
      }
      
      // Pastrojme shporten e perdoruesit
      await Cart.updateOne(
        { userId },
        { $set: { items: [], total: 0 } }
      );
      
      // Perfundojme transaksionin
      await transaction.commit();
      
      // Kthejme porosine e krijuar
      const createdOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              { model: Product, attributes: ['id', 'name', 'price', 'images', 'discount'] }
            ]
          },
          { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }
        ]
      });
      
      return res.status(201).json(createdOrder);
    } catch (error) {
      if (!transaction.finished) {
      await transaction.rollback();
      }
      console.error('Gabim gjate krijimit te porosise:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate krijimit te porosise' });
    }
  },
  
  // Marrja e porosive te perdoruesit
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const { count, rows: orders } = await Order.findAndCountAll({
        where: { userId },
        include: [
          { model: OrderItem, as: 'items' }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });
      
      return res.status(200).json({
        orders,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      console.error('Gabim gjate marrjes se porosive:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se porosive' });
    }
  },
  
  // Marrja e te gjitha porosive (vetem admin)
  getAllOrders: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      // Filtrat
      const whereClause = {};
      
      // Filtrim sipas statusit
      if (req.query.status) {
        whereClause.status = req.query.status;
      }
      
      // Filtrim sipas metodes se pageses
      if (req.query.paymentMethod) {
        whereClause.paymentMethod = req.query.paymentMethod;
      }
      
      // Filtrim sipas dates
      if (req.query.startDate && req.query.endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(req.query.startDate), new Date(req.query.endDate)]
        };
      } else if (req.query.startDate) {
        whereClause.createdAt = {
          [Op.gte]: new Date(req.query.startDate)
        };
      } else if (req.query.endDate) {
        whereClause.createdAt = {
          [Op.lte]: new Date(req.query.endDate)
        };
      }
      
      const { count, rows: orders } = await Order.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              { model: Product, attributes: ['id', 'name', 'price', 'images', 'discount'] }
            ]
          },
          { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });
      
      return res.status(200).json({
        orders,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      console.error('Gabim gjate marrjes se te gjitha porosive:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se te gjitha porosive' });
    }
  },
  
  // Marrja e nje porosie te vetme
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      
      // Gjejme porosine
      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              { model: Product, attributes: ['id', 'name', 'price', 'images', 'discount'] }
            ]
          },
          { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: Address, as: 'shippingAddress' }
        ]
      });
      
      if (!order) {
        return res.status(404).json({ message: 'Porosia nuk u gjet' });
      }
      
      console.log('Order userId:', order.userId, 'Request userId:', userId, 'Role:', userRole);
      
      // Verifikojme nese perdoruesi ka te drejte te shikoje porosine
      if (order.userId !== userId && userRole !== 'admin') {
        return res.status(403).json({ message: 'Ju nuk keni te drejte te shikoni kete porosi' });
      }
      
      return res.status(200).json(order);
    } catch (error) {
      console.error('Gabim gjate marrjes se porosise:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se porosise' });
    }
  },
  
  // Perditesimi i statusit te porosise (vetem admin)
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, trackingNumber } = req.body;
      
      const order = await Order.findByPk(id);
      
      if (!order) {
        return res.status(404).json({ message: 'Porosia nuk u gjet' });
      }
      
      // Perditesojme statusin e porosise
      await order.update({
        status: status || order.status,
        trackingNumber: trackingNumber || order.trackingNumber
      });
      
      return res.status(200).json(order);
    } catch (error) {
      console.error('Gabim gjate perditesimit te statusit te porosise:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate perditesimit te statusit te porosise' });
    }
  },
  
  // Anulimi i nje porosie
  cancelOrder: async (req, res) => {
    // Perdorim transaksion per MySQL per te siguruar integritet te te dhenave
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      
      const order = await Order.findByPk(id, {
        include: [{ model: OrderItem, as: 'items' }],
        transaction
      });
      
      if (!order) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Porosia nuk u gjet' });
      }
      
      // Verifikojme nese perdoruesi ka te drejte te anuloje porosine
      if (order.userId !== userId && userRole !== 'admin') {
        await transaction.rollback();
        return res.status(403).json({ message: 'Ju nuk keni te drejte te anuloni kete porosi' });
      }
      
      // Verifikojme nese porosia mund te anulohet
      if (order.status === 'shipped' || order.status === 'delivered') {
        await transaction.rollback();
        return res.status(400).json({ message: 'Nuk mund te anulohet nje porosi qe eshte derguar ose dorezuar' });
      }
      
      if (order.status === 'cancelled') {
        await transaction.rollback();
        return res.status(400).json({ message: 'Porosia eshte anuluar tashme' });
      }
      
      // Rikthejme inventarin e produkteve
      for (const item of order.items) {
        const product = await Product.findByPk(item.productId, { transaction });
        
        if (product) {
          await product.update({
            stock: product.stock + item.quantity
          }, { transaction });
        }
      }
      
      // Ndryshojme statusin e porosise
      await order.update({
        status: 'cancelled'
      }, { transaction });
      
      // Perfundojme transaksionin
      await transaction.commit();
      
      return res.status(200).json({ message: 'Porosia u anulua me sukses', order });
    } catch (error) {
      // Kthejme transaksionin mbrapa ne rast gabimi
      await transaction.rollback();
      console.error('Gabim gjate anulimit te porosise:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate anulimit te porosise' });
    }
  }
};

export default orderController;
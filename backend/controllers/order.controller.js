import Order from '../models/mysql/order.model';
import OrderItem from '../models/mysql/orderItem.model';
import Product from '../models/mysql/product.model';
import User from '../models/mysql/user.model';
import Cart from '../models/mongo/cart.model';
import Discount from '../models/mysql/discount.model';
import Shipping from '../models/mysql/shipping.model';
import { Op } from 'sequelize';
import mongoose from 'mongoose';
import sequelize from '../../config/db.mysql';

// Order controller
const orderController = {
  // Create a new order
  createOrder: async (req, res) => {
    // Use MySQL transaction to ensure data integrity
    const transaction = await sequelize.transaction();
    
    try {
      const {
        shippingAddress,
        shippingMethodId,
        paymentMethod,
        discountCode,
        orderNotes
      } = req.body;
      
      const userId = req.user.id;
      
      // Find user's cart
      const cart = await Cart.findOne({ userId });
      
      if (!cart || cart.items.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Shporta eshte e zbrazet' });
      }
      
      // Verify and get shipping method
      const shippingMethod = await Shipping.findByPk(shippingMethodId);
      if (!shippingMethod || !shippingMethod.isActive) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Metoda e dergeses nuk u gjet ose nuk eshte aktive' });
      }
      
      let discountAmount = 0;
      let validDiscount = null;
      
      // Verify discount code if provided
      if (discountCode) {
        validDiscount = await Discount.findOne({
          where: {
            code: discountCode,
            isActive: true,
            validFrom: { [Op.lte]: new Date() },
            validUntil: { [Op.gte]: new Date() },
            [Op.or]: [
              { usageLimit: null },
              { usageCount: { [Op.lt]: sequelize.col('usageLimit') } }
            ]
          },
          transaction
        });
        
        if (validDiscount) {
          const cartTotal = cart.total;
          
          // Check if minimum purchase is met
          if (cartTotal >= validDiscount.minimumPurchase) {
            if (validDiscount.type === 'percentage') {
              discountAmount = (cartTotal * validDiscount.value) / 100;
            } else if (validDiscount.type === 'fixed') {
              discountAmount = validDiscount.value;
            }
            
            // Update discount usage count
            await validDiscount.increment('usageCount', { transaction });
          } else {
            validDiscount = null;
          }
        }
      }
      
      // Calculate order total
      const subtotal = cart.total;
      const shippingCost = shippingMethod.price;
      const total = subtotal + shippingCost - discountAmount;
      
      // Create the order
      const order = await Order.create({
        userId,
        status: 'pending',
        total,
        shippingAddress,
        shippingMethod: shippingMethod.name,
        shippingCost,
        paymentMethod,
        paymentStatus: 'pending',
        discountCode: validDiscount ? validDiscount.code : null,
        discountAmount,
        orderNotes
      }, { transaction });
      
      // Create order items and update inventory
      for (const item of cart.items) {
        const product = await Product.findByPk(item.productId, { transaction });
        
        if (!product) {
          await transaction.rollback();
          return res.status(404).json({ message: `Produkti me ID ${item.productId} nuk u gjet` });
        }
        
        // Check product availability
        if (product.stock < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Produkti ${product.name} ka vetem ${product.stock} njesi ne stok`
          });
        }
        
        // Create order item
        await OrderItem.create({
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          total: product.price * item.quantity,
          productName: product.name,
          productImage: product.images[0] || ''
        }, { transaction });
        
        // Update inventory
        await product.update({
          stock: product.stock - item.quantity
        }, { transaction });
      }
      
      // Clear user's cart
      await Cart.updateOne(
        { userId },
        { $set: { items: [], total: 0 } }
      );
      
      // Commit the transaction
      await transaction.commit();
      
      // Return the created order
      const createdOrder = await Order.findByPk(order.id, {
        include: [
          { model: OrderItem, as: 'items' },
          { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }
        ]
      });
      
      return res.status(201).json(createdOrder);
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      console.error('Gabim gjate krijimit te porosise:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate krijimit te porosise' });
    }
  },
  
  // Get user orders
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
  
  // Get all orders (admin only)
  getAllOrders: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      // Filters
      const whereClause = {};
      
      // Filter by status
      if (req.query.status) {
        whereClause.status = req.query.status;
      }
      
      // Filter by payment method
      if (req.query.paymentMethod) {
        whereClause.paymentMethod = req.query.paymentMethod;
      }
      
      // Filter by date
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
          { model: OrderItem, as: 'items' },
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
  
  // Get a single order by ID
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      
      // Find the order
      const order = await Order.findByPk(id, {
        include: [
          { model: OrderItem, as: 'items' },
          { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }
        ]
      });
      
      if (!order) {
        return res.status(404).json({ message: 'Porosia nuk u gjet' });
      }
      
      // Verify if user has rights to view this order
      if (order.userId !== userId && userRole !== 'admin') {
        return res.status(403).json({ message: 'Ju nuk keni te drejte te shikoni kete porosi' });
      }
      
      return res.status(200).json(order);
    } catch (error) {
      console.error('Gabim gjate marrjes se porosise:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se porosise' });
    }
  },
  
  // Update order status (admin only)
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, trackingNumber } = req.body;
      
      const order = await Order.findByPk(id);
      
      if (!order) {
        return res.status(404).json({ message: 'Porosia nuk u gjet' });
      }
      
      // Update order status
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
  
  // Cancel an order
  cancelOrder: async (req, res) => {
    // Use MySQL transaction to ensure data integrity
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
      
      // Verify if user has rights to cancel this order
      if (order.userId !== userId && userRole !== 'admin') {
        await transaction.rollback();
        return res.status(403).json({ message: 'Ju nuk keni te drejte te anuloni kete porosi' });
      }
      
      // Verify if order can be cancelled
      if (order.status === 'shipped' || order.status === 'delivered') {
        await transaction.rollback();
        return res.status(400).json({ message: 'Nuk mund te anulohet nje porosi qe eshte derguar ose dorezuar' });
      }
      
      if (order.status === 'cancelled') {
        await transaction.rollback();
        return res.status(400).json({ message: 'Porosia eshte anuluar tashme' });
      }
      
      // Return products to inventory
      for (const item of order.items) {
        const product = await Product.findByPk(item.productId, { transaction });
        
        if (product) {
          await product.update({
            stock: product.stock + item.quantity
          }, { transaction });
        }
      }
      
      // Change order status
      await order.update({
        status: 'cancelled'
      }, { transaction });
      
      // Commit the transaction
      await transaction.commit();
      
      return res.status(200).json({ message: 'Porosia u anulua me sukses', order });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      console.error('Gabim gjate anulimit te porosise:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate anulimit te porosise' });
    }
  }
};

export default orderController;
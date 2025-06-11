import Order from '../models/mysql/order.model.js';
import User from '../models/mysql/user.model.js';
import Product from '../models/mysql/product.model.js';
import Category from '../models/mysql/category.model.js';
import { Op } from 'sequelize';

const statisticsController = {
    getStatistics: async (req, res) => {
        try {
            // Totali i porosive
            const totalOrders = await Order.count();
            // Totali i përdoruesve
            const totalUsers = await User.count();
            // Totali i produkteve
            const totalProducts = await Product.count();

            // Totali i të ardhurave
            const orders = await Order.findAll({ attributes: ['total_amount'] });
            const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

            // Porositë sipas muajve
            const ordersByMonth = await Order.findAll({
                attributes: [
                    [Order.sequelize.fn('DATE_FORMAT', Order.sequelize.col('created_at'), '%Y-%m'), 'month'],
                    [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'count']
                ],
                group: ['month'],
                order: [[Order.sequelize.fn('DATE_FORMAT', Order.sequelize.col('created_at'), '%Y-%m'), 'ASC']]
            });

            // Të ardhurat sipas muajve
            const revenueByMonth = await Order.findAll({
                attributes: [
                    [Order.sequelize.fn('DATE_FORMAT', Order.sequelize.col('created_at'), '%Y-%m'), 'month'],
                    [Order.sequelize.fn('SUM', Order.sequelize.col('total_amount')), 'amount']
                ],
                group: ['month'],
                order: [[Order.sequelize.fn('DATE_FORMAT', Order.sequelize.col('created_at'), '%Y-%m'), 'ASC']]
            });

            // Produktet sipas kategorive
            const productsByCategory = await Product.findAll({
                attributes: [
                    [Product.sequelize.col('Category.name'), 'category'],
                    [Product.sequelize.fn('COUNT', Product.sequelize.col('Product.id')), 'count']
                ],
                include: [{ model: Category, attributes: [] }],
                group: ['Category.name']
            });

            res.json({
                totalOrders,
                totalRevenue,
                totalUsers,
                totalProducts,
                ordersByMonth,
                revenueByMonth,
                productsByCategory
            });
        } catch (error) {
            console.error('Gabim gjatë marrjes së statistikave:', error);
            res.status(500).json({ message: 'Gabim në server gjatë marrjes së statistikave' });
        }
    }
};

export default statisticsController;

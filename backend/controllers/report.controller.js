// backend/controllers/report.controller.js
import { jsPDF } from 'jspdf';
import User from '../models/mysql/user.model.js';
import Product from '../models/mysql/product.model.js';
import Order from '../models/mysql/order.model.js';
import { Op } from 'sequelize';

const reportController = {
    generateReport: async (req, res) => {
        try {
            const { type, format, dateRange } = req.body;
            let startDate, endDate;
            if (dateRange) {
                startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
                endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;
            }
            // Only allow PDF export
            if (format !== 'pdf') {
                return res.status(400).json({ message: 'Lejohet vetëm eksportimi në PDF.' });
            }
            const doc = new jsPDF();
            if (type === 'customers') {
                // Fetch only customers in date range
                const where = { role: 'customer' };
                if (startDate && endDate) where.createdAt = { [Op.between]: [startDate, endDate] };
                else if (startDate) where.createdAt = { [Op.gte]: startDate };
                else if (endDate) where.createdAt = { [Op.lte]: endDate };
                const customers = await User.findAll({
                    where,
                    attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt']
                });
                doc.setFontSize(20);
                doc.text('Raporti i Klientëve', 105, 20, { align: 'center' });
                doc.setFontSize(12);
                doc.text(`Gjeneruar më: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
                doc.setFontSize(14);
                doc.text('Lista e Klientëve', 20, 45);
                // Table header
                const startY = 55;
                const lineHeight = 10;
                const colWidths = [15, 50, 60, 50];
                const startX = 20;
                doc.setFillColor(41, 128, 185);
                doc.rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), lineHeight, 'F');
                doc.setTextColor(255);
                doc.setFontSize(10);
                doc.text('ID', startX + 2, startY + 7);
                doc.text('Emri', startX + colWidths[0] + 2, startY + 7);
                doc.text('Email', startX + colWidths[0] + colWidths[1] + 2, startY + 7);
                doc.text('Regjistruar', startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, startY + 7);
                // Table rows
                doc.setTextColor(0);
                customers.forEach((c, index) => {
                    const y = startY + (index + 1) * lineHeight;
                    doc.text(String(c.id), startX + 2, y + 7);
                    doc.text(c.firstName + ' ' + c.lastName, startX + colWidths[0] + 2, y + 7);
                    doc.text(c.email, startX + colWidths[0] + colWidths[1] + 2, y + 7);
                    doc.text(new Date(c.createdAt).toLocaleDateString(), startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, y + 7);
                });
                const pdfBuffer = doc.output('arraybuffer');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=customers_report.pdf');
                res.send(Buffer.from(pdfBuffer));
                return;
            } else if (type === 'products') {
                // Fetch products in date range
                const where = {};
                if (startDate && endDate) where.createdAt = { [Op.between]: [startDate, endDate] };
                else if (startDate) where.createdAt = { [Op.gte]: startDate };
                else if (endDate) where.createdAt = { [Op.lte]: endDate };
                const products = await Product.findAll({
                    where,
                    attributes: ['id', 'name', 'price', 'stock', 'categoryId', 'createdAt']
                });
                doc.setFontSize(20);
                doc.text('Raporti i Produkteve', 105, 20, { align: 'center' });
                doc.setFontSize(12);
                doc.text(`Gjeneruar më: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
                doc.setFontSize(14);
                doc.text('Lista e Produkteve', 20, 45);
                // Table header
                const startY = 55;
                const lineHeight = 10;
                const colWidths = [15, 70, 30, 30, 30];
                const startX = 20;
                doc.setFillColor(41, 128, 185);
                doc.rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), lineHeight, 'F');
                doc.setTextColor(255);
                doc.setFontSize(10);
                doc.text('ID', startX + 2, startY + 7);
                doc.text('Emri', startX + colWidths[0] + 2, startY + 7);
                doc.text('Çmimi', startX + colWidths[0] + colWidths[1] + 2, startY + 7);
                doc.text('Stok', startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, startY + 7);
                doc.text('Kategori', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 2, startY + 7);
                // Table rows
                doc.setTextColor(0);
                products.forEach((p, index) => {
                    const y = startY + (index + 1) * lineHeight;
                    doc.text(String(p.id), startX + 2, y + 7);
                    doc.text(p.name, startX + colWidths[0] + 2, y + 7);
                    doc.text(String(p.price), startX + colWidths[0] + colWidths[1] + 2, y + 7);
                    doc.text(String(p.stock), startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, y + 7);
                    doc.text(String(p.categoryId || '-'), startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 2, y + 7);
                });
                const pdfBuffer = doc.output('arraybuffer');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=products_report.pdf');
                res.send(Buffer.from(pdfBuffer));
                return;
            } else if (type === 'sales') {
                // Fetch orders in date range
                const where = {};
                if (startDate && endDate) where.createdAt = { [Op.between]: [startDate, endDate] };
                else if (startDate) where.createdAt = { [Op.gte]: startDate };
                else if (endDate) where.createdAt = { [Op.lte]: endDate };
                const orders = await Order.findAll({
                    where,
                    attributes: ['id', 'total_amount', 'created_at', 'status'],
                    include: [
                        { model: User, attributes: ['firstName', 'lastName', 'email'] },
                        {
                            model: Order.sequelize.models.OrderItem,
                            as: 'items',
                            attributes: ['quantity', 'price'],
                            include: [
                                { model: Product, attributes: ['name'] }
                            ]
                        }
                    ]
                });
                console.log(JSON.stringify(orders, null, 2));
                // Fetch statistics
                const totalUsers = await User.count();
                const totalProducts = await Product.count();
                const totalOrders = await Order.count();
                // Calculate total revenue
                const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
                // Create PDF document
                doc.setFontSize(20);
                doc.text('Store Report', 105, 20, { align: 'center' });
                // Add date
                doc.setFontSize(12);
                doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
                // Add statistics
                doc.setFontSize(14);
                doc.text('Store Statistics', 20, 45);
                doc.setFontSize(12);
                doc.text(`Total Users: ${totalUsers}`, 20, 55);
                doc.text(`Total Products: ${totalProducts}`, 20, 62);
                doc.text(`Total Orders: ${totalOrders}`, 20, 69);
                doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 20, 76);
                // Add recent orders table
                doc.setFontSize(14);
                doc.text('Recent Orders', 20, 90);
                // Prepare table data
                const tableData = [];
                orders.forEach(order => {
                    const customerName = order.User ? `${order.User.firstName} ${order.User.lastName}` : '';
                    order.items.forEach(item => {
                        tableData.push([
                            order.id.toString(),
                            customerName,
                            item.Product ? item.Product.name : '',
                            String(item.quantity),
                            String(item.price),
                            new Date(order.created_at).toLocaleDateString()
                        ]);
                    });
                });
                // Add table manually
                const startY = 95;
                const lineHeight = 10;
                const colWidths = [20, 40, 40, 20, 20, 30];
                const startX = 20;
                // Draw table header
                doc.setFillColor(41, 128, 185);
                doc.rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), lineHeight, 'F');
                doc.setTextColor(255);
                doc.setFontSize(10);
                doc.text('Order ID', startX + 2, startY + 7);
                doc.text('Customer', startX + colWidths[0] + 2, startY + 7);
                doc.text('Product', startX + colWidths[0] + colWidths[1] + 2, startY + 7);
                doc.text('Qty', startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, startY + 7);
                doc.text('Price', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 2, startY + 7);
                doc.text('Date', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + 2, startY + 7);
                // Draw table rows
                doc.setTextColor(0);
                tableData.forEach((row, index) => {
                    const y = startY + (index + 1) * lineHeight;
                    row.forEach((cell, i) => {
                        doc.text(cell, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 2, y + 7);
                    });
                });
                // Get the PDF as a buffer
                const pdfBuffer = doc.output('arraybuffer');
                // Set response headers
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=store-report.pdf');
                // Send the PDF
                res.send(Buffer.from(pdfBuffer));
                return;
            }
        } catch (error) {
            console.error('Gabim gjatë gjenerimit të raportit:', error);
            res.status(500).json({ message: 'Gabim në server gjatë gjenerimit të raportit' });
        }
    },
    getCustomersReport: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const where = { role: 'customer' };
            if (startDate && endDate) where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            else if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) };
            else if (endDate) where.createdAt = { [Op.lte]: new Date(endDate) };
            const customers = await User.findAll({
                where,
                attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt']
            });
            // For each customer, you may want to calculate orders and totalSpent
            // For now, return basic info
            const result = customers.map(c => ({
                id: c.id,
                name: c.firstName + ' ' + c.lastName,
                email: c.email,
                orders: 0, // TODO: calculate real order count
                totalSpent: 0, // TODO: calculate real total spent
                registrationDate: c.createdAt
            }));
            res.json(result);
        } catch (error) {
            console.error('Gabim gjatë marrjes së raportit të klientëve:', error);
            res.status(500).json({ message: 'Gabim në server' });
        }
    },
    getReportData: async (req, res) => {
        try {
            const { reportType, startDate, endDate } = req.query;
            if (reportType === 'products') {
                const where = {};
                if (startDate && endDate) where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
                else if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) };
                else if (endDate) where.createdAt = { [Op.lte]: new Date(endDate) };
                const products = await Product.findAll({
                    where,
                    attributes: ['id', 'name', 'price', 'stock', 'categoryId', 'createdAt']
                });
                // ... send products ...
            } else if (reportType === 'sales') {
                const where = {};
                if (startDate && endDate) where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
                else if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) };
                else if (endDate) where.createdAt = { [Op.lte]: new Date(endDate) };
                const orders = await Order.findAll({
                    where,
                    attributes: ['id', 'total_amount', 'created_at', 'status']
                });
                // ... send orders ...
            }
            // ... existing code ...
        } catch (error) {
            // ... existing code ...
        }
    }
};

export default reportController; 
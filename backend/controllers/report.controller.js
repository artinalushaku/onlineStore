// backend/controllers/report.controller.js
import { jsPDF } from 'jspdf';
import User from '../models/mysql/user.model.js';
import Product from '../models/mysql/product.model.js';
import Order from '../models/mysql/order.model.js';

const reportController = {
    generateReport: async (req, res) => {
        try {
            // Fetch statistics
            const totalUsers = await User.count();
            const totalProducts = await Product.count();
            const totalOrders = await Order.count();
            
            // Calculate total revenue
            const orders = await Order.findAll({
                attributes: ['id', 'totalAmount', 'createdAt', 'status']
            });
            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);

            // Create PDF document
            const doc = new jsPDF();

            // Add title
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
            const tableData = orders.slice(0, 5).map(order => [
                order.id.toString(),
                new Date(order.createdAt).toLocaleDateString(),
                `$${parseFloat(order.totalAmount || 0).toFixed(2)}`
            ]);

            // Add table manually
            const startY = 95;
            const lineHeight = 10;
            const colWidths = [40, 60, 40];
            const startX = 20;

            // Draw table header
            doc.setFillColor(41, 128, 185);
            doc.rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), lineHeight, 'F');
            doc.setTextColor(255);
            doc.setFontSize(10);
            doc.text('Order ID', startX + 2, startY + 7);
            doc.text('Date', startX + colWidths[0] + 2, startY + 7);
            doc.text('Amount', startX + colWidths[0] + colWidths[1] + 2, startY + 7);

            // Draw table rows
            doc.setTextColor(0);
            tableData.forEach((row, index) => {
                const y = startY + (index + 1) * lineHeight;
                doc.text(row[0], startX + 2, y + 7);
                doc.text(row[1], startX + colWidths[0] + 2, y + 7);
                doc.text(row[2], startX + colWidths[0] + colWidths[1] + 2, y + 7);
            });

            // Get the PDF as a buffer
            const pdfBuffer = doc.output('arraybuffer');

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=store-report.pdf');
            
            // Send the PDF
            res.send(Buffer.from(pdfBuffer));

        } catch (error) {
            console.error('Gabim gjatë gjenerimit të raportit:', error);
            res.status(500).json({ message: 'Gabim në server gjatë gjenerimit të raportit' });
        }
    }
};

export default reportController; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Invoice = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setOrder(response.data);
            setLoading(false);
        } catch (error) {
            setError('Gabim gjatë marrjes së detajeve të porosisë');
            setLoading(false);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text('Fatura', 105, 20, { align: 'center' });

        // Detajet e kompanisë
        doc.setFontSize(12);
        doc.text('ON Store', 20, 30);
        doc.text('Rr. Nëna Terezë, Nr. 100', 20, 37);
        doc.text('Tirana, Shqipëri', 20, 44);
        doc.text('Tel: +355 4X XXX XXX', 20, 51);
        doc.text('Email: info@onstore.com', 20, 58);

        // Detajet e klientit
        doc.text('Klienti:', 20, 70);
        doc.text(`Emri: ${order.user.name}`, 20, 77);
        doc.text(`Email: ${order.user.email}`, 20, 84);

        // Detajet e faturës
        doc.text(`Numri i Faturës: ${order._id}`, 20, 96);
        doc.text(`Data: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 103);

        // Tabela e produkteve
        const tableColumn = ['Produkti', 'Sasia', 'Çmimi', 'Total'];
        const tableRows = order.items.map(item => [
            item.product.name,
            item.quantity,
            `${item.product.price}€`,
            `${(item.quantity * item.product.price).toFixed(2)}€`
        ]);

        // Shto totalin në fund të tabelës
        tableRows.push(['', '', 'Total:', `${order.totalAmount}€`]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 110,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold',
            },
        });

        // Shënime
        doc.setFontSize(10);
        doc.text('Faleminderit për blerjen tuaj!', 20, doc.autoTable.previous.finalY + 20);
        doc.text('Për çdo pyetje, ju lutemi na kontaktoni në info@onstore.com', 20, doc.autoTable.previous.finalY + 27);

        // Ruaj PDF
        doc.save(`fatura_${order._id}.pdf`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Fatura</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Detajet e Kompanisë</h2>
                        <p>ON Store</p>
                        <p>Rr. Nëna Terezë, Nr. 100</p>
                        <p>Tirana, Shqipëri</p>
                        <p>Tel: +355 4X XXX XXX</p>
                        <p>Email: info@onstore.com</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Detajet e Klientit</h2>
                        <p>Emri: {order.user.name}</p>
                        <p>Email: {order.user.email}</p>
                        <p>Numri i Faturës: {order._id}</p>
                        <p>Data: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Produktet</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produkti</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sasia</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Çmimi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product.price}€</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(item.quantity * item.product.price).toFixed(2)}€</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">Total:</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.totalAmount}€</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={generatePDF}
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Shkarko Faturën (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Invoice; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/admin/orders', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setOrders(response.data.orders);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së porosive:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/admin/orders/${orderId}/status`, {
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchOrders();
        } catch (error) {
            console.error('Gabim gjatë ndryshimit të statusit:', error);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Menaxhimi i Porosive</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID e Porosisë
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Klienti
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Totali
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statusi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Veprime
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.User ? `${order.User.firstName} ${order.User.lastName}` : ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.totalAmount}€
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                    >
                                        <option value="pending">Në Pritje</option>
                                        <option value="processing">Në Procesim</option>
                                        <option value="shipped">Dërguar</option>
                                        <option value="delivered">Dërguar</option>
                                        <option value="cancelled">Anuluar</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleViewDetails(order)}
                                        className="text-primary-600 hover:text-primary-900 mr-4"
                                    >
                                        Shiko Detajet
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Detajet e Porosisë
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <div className="mb-4">
                                    <h4 className="font-medium">Produktet:</h4>
                                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between mt-2">
                                            <span>{item.productName || (item.product && item.product.name) || ''}</span>
                                            <span>{item.quantity} x {item.price}€</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Adresa e Dërgesës:</h4>
                                    {(() => {
                                        let shipping = {};
                                        try {
                                            shipping = selectedOrder.shippingAddress ? JSON.parse(selectedOrder.shippingAddress) : {};
                                        } catch (e) {}
                                        return (
                                            <p className="text-sm text-gray-600">
                                                {shipping.address1 || ''},<br />
                                                {shipping.city || ''},<br />
                                                {shipping.country || ''}
                                            </p>
                                        );
                                    })()}
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Metoda e Pagesës:</h4>
                                    <p className="text-sm text-gray-600">
                                        {selectedOrder.paymentMethod}
                                    </p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Totali:</h4>
                                    <p className="text-sm text-gray-600">
                                        {selectedOrder.totalAmount}€
                                    </p>
                                </div>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleCloseDetails}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Mbyll
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement; 
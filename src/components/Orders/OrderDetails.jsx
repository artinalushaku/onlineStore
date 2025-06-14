import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
                console.error('Gabim gjatë marrjes së detajeve të porosisë:', error);
                setError('Nuk mund të merren detajet e porosisë. Ju lutemi provoni përsëri.');
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Në Pritje';
            case 'processing':
                return 'Në Procesim';
            case 'completed':
                return 'Përfunduar';
            case 'cancelled':
                return 'Anuluar';
            default:
                return status;
        }
    };

    // Funksion ndihmës për të marrë imazhin e parë nga struktura të ndryshme
    const getFirstImage = (images) => {
        if (!images) return '';
        if (Array.isArray(images)) return images[0];
        if (typeof images === 'string') {
            if (images.startsWith('[')) {
                try {
                    const arr = JSON.parse(images);
                    return Array.isArray(arr) ? arr[0] : '';
                } catch {
                    return '';
                }
            }
            return images;
        }
        return '';
    };

    const getImageSrc = (imgPath) => {
        if (!imgPath) return 'https://via.placeholder.com/80x80?text=No+Image';
        if (imgPath.startsWith('/uploads/')) {
            return `http://localhost:5000${imgPath}`;
        }
        if (imgPath.startsWith('http')) {
            return imgPath;
        }
        return `http://localhost:5000/uploads/${imgPath}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
                <Link to="/orders" className="text-primary hover:underline">
                    Kthehu te Lista e Porosive
                </Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    Porosia nuk u gjet
                </h1>
                <Link to="/orders" className="text-primary hover:underline">
                    Kthehu te Lista e Porosive
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Detajet e Porosisë</h1>
                    <Link to="/orders" className="text-primary hover:underline">
                        Kthehu te Lista
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Porosia #{order.id}
                                </h2>
                                <p className="text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="mt-2 md:mt-0">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    {getStatusText(order.status)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    Informacionet e Dërgesë
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-900">
                                        {(order.shipping?.firstName || order.shippingAddress?.firstName || '')} {(order.shipping?.lastName || order.shippingAddress?.lastName || '')}
                                    </p>
                                    <p className="text-gray-600">
                                        {order.shipping?.address1 || order.shippingAddress?.address1 || ''}
                                    </p>
                                    {(order.shipping?.address2 || order.shippingAddress?.address2) && (
                                        <p className="text-gray-600">
                                            {order.shipping?.address2 || order.shippingAddress?.address2}
                                        </p>
                                    )}
                                    <p className="text-gray-600">
                                        {(order.shipping?.city || order.shippingAddress?.city || '')}, {(order.shipping?.postalCode || order.shippingAddress?.postalCode || '')}
                                    </p>
                                    <p className="text-gray-600">
                                        {order.shipping?.country || order.shippingAddress?.country || ''}
                                    </p>
                                    <p className="text-gray-600">
                                        Telefon: {order.shipping?.phone || order.shippingAddress?.phone || ''}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    Informacionet e Pagesës
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-900">
                                        Metoda: {(order.payment?.method || order.paymentMethod) === 'card' ? 'Kartë Krediti' : 'Para në Dorë'}
                                    </p>
                                    <p className="text-gray-900">
                                        Totali: {order.total !== undefined && order.total !== null && !isNaN(Number(order.total)) ? Number(order.total).toFixed(2) : (order.totalAmount !== undefined && order.totalAmount !== null && !isNaN(Number(order.totalAmount)) ? Number(order.totalAmount).toFixed(2) : '0.00')}€
                                    </p>
                                    <p className="text-gray-900">
                                        Transporti: {order.shippingMethod?.price?.toFixed(2) || '0.00'}€
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Produktet e Porosisë
                            </h3>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex items-center bg-gray-50 rounded-lg p-4"
                                    >
                                        <img
                                            src={getImageSrc(getFirstImage(item.product?.images || item.Product?.images))}
                                            alt={item.Product?.name || item.product?.name || item.productName || 'Pa emër'}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                        <div className="ml-4 flex-1">
                                            <h4 className="font-medium">
                                                {item.Product?.name || item.product?.name || item.productName || 'Pa emër'}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Sasia: {item.quantity}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Çmimi: {item.price}€
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {(item.price * item.quantity).toFixed(2)}€
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails; 
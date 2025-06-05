import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderSuccess = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

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
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    Porosia nuk u gjet
                </h1>
                <Link to="/" className="btn btn-primary">
                    Kthehu në Faqen Kryesore
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Faleminderit për Porosinë!
                    </h1>
                    <p className="text-gray-600">
                        Porosia juaj u konfirmua me sukses
                    </p>
                </div>

                <div className="border-t border-b py-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h2 className="text-sm font-medium text-gray-600 mb-1">
                                Numri i Porosisë
                            </h2>
                            <p className="text-gray-900">{order._id}</p>
                        </div>
                        <div>
                            <h2 className="text-sm font-medium text-gray-600 mb-1">
                                Data e Porosisë
                            </h2>
                            <p className="text-gray-900">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <h2 className="text-sm font-medium text-gray-600 mb-1">
                                Metoda e Pagesës
                            </h2>
                            <p className="text-gray-900">
                                {order.paymentMethod === 'card' ? 'Kartë Krediti' : 'Para në Dorë'}
                            </p>
                        </div>
                        <div>
                            <h2 className="text-sm font-medium text-gray-600 mb-1">
                                Totali
                            </h2>
                            <p className="text-gray-900">{order.totalAmount.toFixed(2)}€</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Produktet e Porosisë</h2>
                    <div className="space-y-4">
                        {order.items.map(item => (
                            <div key={item._id} className="flex items-center">
                                <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <div className="ml-4 flex-1">
                                    <h3 className="font-medium">{item.product.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        Sasia: {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">
                                        {item.product.discount
                                            ? (item.product.price - (item.product.price * item.product.discount / 100)) * item.quantity
                                            : item.product.price * item.quantity}€
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Adresa e Dërgesë</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900">
                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                        </p>
                        <p className="text-gray-600">{order.shippingAddress.address}</p>
                        <p className="text-gray-600">
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                        </p>
                        <p className="text-gray-600">{order.shippingAddress.country}</p>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <Link to="/" className="btn btn-primary block">
                        Vazhdo Blerjet
                    </Link>
                    <Link to="/orders" className="btn btn-secondary block">
                        Shiko Porositë e Mia
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess; 
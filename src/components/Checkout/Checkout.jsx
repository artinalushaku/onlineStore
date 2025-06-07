import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../config/axios';
import { FaMapMarkerAlt, FaTruck, FaReceipt } from 'react-icons/fa';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        city: '',
        postalCode: '',
        country: '',
        phone: ''
    });

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = selectedShipping ? 
        Number(shippingMethods.find(m => m.id === selectedShipping)?.price) || 0 : 0;
    const total = subtotal + shippingCost;

    useEffect(() => {
        fetchShippingMethods();
    }, []);

    const fetchShippingMethods = async () => {
        try {
            const response = await axios.get('/api/shipping');
            setShippingMethods(response.data);
            if (response.data.length > 0) {
                setSelectedShipping(response.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching shipping methods:', error);
            setError('Could not fetch shipping methods');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const requiredFields = ['firstName', 'lastName', 'address1', 'city', 'postalCode', 'country', 'phone'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setError(`Please fill in ${field}`);
                return false;
            }
        }
        if (!selectedShipping) {
            setError('Please select a shipping method');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setError(null);
        try {
            const orderData = {
                shipping: {
                    address: formData,
                    method: selectedShipping
                },
                paymentMethod: 'cash' // Default to cash for now
            };
            const response = await axios.post('/api/orders', orderData);
            clearCart();
            navigate(`/order-confirmation/${response.data.id}`);
        } catch (error) {
            setError(error.response?.data?.message || 'Error placing order');
            setLoading(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Shipping Information */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex items-center mb-6 gap-3">
                            <span className="bg-blue-100 text-blue-700 rounded-full p-2">
                                <FaMapMarkerAlt size={20} />
                            </span>
                            <h2 className="text-xl font-semibold text-blue-900">Shipping Information</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address1"
                                    value={formData.address1}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center mb-4 gap-3">
                                    <span className="bg-blue-100 text-blue-700 rounded-full p-2">
                                        <FaTruck size={20} />
                                    </span>
                                    <h2 className="text-xl font-semibold text-blue-900">Shipping Method</h2>
                                </div>
                                <div className="space-y-2">
                                    {shippingMethods.map(method => (
                                        <label key={method.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="shippingMethod"
                                                value={method.id}
                                                checked={selectedShipping === method.id}
                                                onChange={() => setSelectedShipping(method.id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="ml-3">
                                                <span className="block text-sm font-medium text-gray-900">{method.name}</span>
                                                <span className="block text-sm text-gray-500">{method.price}€</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm mt-4">
                                    {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-xl text-white font-medium text-lg shadow transition-colors duration-150
                                    ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
                        <div className="flex items-center mb-4 gap-3">
                            <span className="bg-blue-100 text-blue-700 rounded-full p-2">
                                <FaReceipt size={20} />
                            </span>
                            <h2 className="text-xl font-semibold text-blue-900">Order Summary</h2>
                        </div>
                        <div className="mb-4">
                            {cart.items.map(item => (
                                <div key={item.productId} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                    <div className="flex items-center gap-2">
                                        {item.image && (
                                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                                        )}
                                        <div>
                                            <div className="font-medium text-blue-900">{item.name}</div>
                                            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                    <div className="font-medium">{(item.price * item.quantity).toFixed(2)}€</div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{subtotal.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{shippingCost.toFixed(2)}€</span>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>{total.toFixed(2)}€</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
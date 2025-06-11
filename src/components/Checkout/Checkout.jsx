import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../config/axios';
import { FaMapMarkerAlt, FaTruck, FaReceipt } from 'react-icons/fa';
import SavedAddresses from './SavedAddresses';
import AddressForm from './AddressForm';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = selectedShipping ? 
        Number(shippingMethods.find(m => m.id === selectedShipping)?.price) || 0 : 0;
    const total = subtotal + shippingCost - discountAmount;

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

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
        setShowAddressForm(false);
    };

    const handleAddNewAddress = () => {
        setShowAddressForm(true);
        setSelectedAddress(null);
    };

    const handleAddressSubmit = async (addressData) => {
        try {
            const response = await axios.post('/api/addresses', {
                ...addressData,
                addressType: 'shipping'
            });
            setSelectedAddress(response.data);
            setShowAddressForm(false);
        } catch (error) {
            setError('Could not save address');
        }
    };

    const validateForm = () => {
        if (!selectedAddress) {
            setError('Please select or add a shipping address');
                return false;
        }
        if (!selectedShipping) {
            setError('Please select a shipping method');
            return false;
        }
        return true;
    };

    const handleApplyCoupon = async () => {
        setCouponError('');
        setDiscountAmount(0);
        setAppliedCoupon(null);
        if (!discountCode) return;
        try {
            // Validate coupon with backend
            const response = await axios.post('/api/coupons/validate', {
                code: discountCode,
                cartTotal: subtotal
            });
            if (response.data.valid && response.data.amount > 0) {
                setDiscountAmount(response.data.amount);
                setAppliedCoupon(discountCode);
                setCouponError('');
            } else {
                setCouponError('Kuponi nuk është i vlefshëm ose nuk plotëson kushtet.');
            }
        } catch (err) {
            setCouponError(err.response?.data?.message || 'Kuponi nuk është i vlefshëm.');
        }
    };

    const handleRemoveCoupon = () => {
        setDiscountCode('');
        setDiscountAmount(0);
        setAppliedCoupon(null);
        setCouponError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setError(null);
        try {
            const orderData = {
                shipping: {
                    method: selectedShipping,
                    address: selectedAddress
                },
                paymentMethod: 'cash',
                discountCode: appliedCoupon || ''
            };
            const response = await axios.post('/api/orders', orderData);
            clearCart();
            navigate(`/order-success/${response.data.id}`);
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

                        {showAddressForm ? (
                            <AddressForm 
                                onSubmit={handleAddressSubmit}
                                onCancel={() => setShowAddressForm(false)}
                            />
                        ) : (
                            <SavedAddresses 
                                onSelectAddress={handleAddressSelect}
                                onAddNewClick={handleAddNewAddress}
                            />
                        )}

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
                            disabled={loading || !selectedAddress}
                            onClick={handleSubmit}
                            className={`w-full mt-6 py-3 px-4 rounded-xl text-white font-medium text-lg shadow transition-colors duration-150
                                ${loading || !selectedAddress ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex items-center mb-6 gap-3">
                            <span className="bg-blue-100 text-blue-700 rounded-full p-2">
                                <FaReceipt size={20} />
                            </span>
                            <h2 className="text-xl font-semibold text-blue-900">Order Summary</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {cart.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                        <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">{(item.price * item.quantity).toFixed(2)}€</p>
                                </div>
                            ))}
                            
                            <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                <span>{subtotal.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                <span>{shippingCost.toFixed(2)}€</span>
                            </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-green-700">Zbritje ({appliedCoupon})</span>
                                        <span className="text-green-700">- {discountAmount.toFixed(2)}€</span>
                                        <button onClick={handleRemoveCoupon} className="ml-2 text-xs text-red-500 underline">Hiq</button>
                                    </div>
                                )}
                                {!appliedCoupon && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="text"
                                            value={discountCode}
                                            onChange={e => setDiscountCode(e.target.value)}
                                            placeholder="Vendos kodin e kuponit"
                                            className="input flex-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                        >
                                            Apliko
                                        </button>
                                    </div>
                                )}
                                {couponError && <div className="text-red-500 text-xs mt-1">{couponError}</div>}
                                <div className="flex justify-between font-bold text-lg">
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
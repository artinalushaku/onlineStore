import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../config/axios';
import SavedAddresses from './SavedAddresses';
import AddressForm from './AddressForm';
import { FaMapMarkerAlt, FaTruck, FaCreditCard, FaReceipt } from 'react-icons/fa';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [filteredShippingMethods, setFilteredShippingMethods] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [formData, setFormData] = useState({
        paymentMethod: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: ''
    });
    const [expandedAddressId, setExpandedAddressId] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [errorAddresses, setErrorAddresses] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [editingAddress, setEditingAddress] = useState(null);

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = selectedShipping ? 
        Number(shippingMethods.find(m => m.id === selectedShipping)?.price) || 0 : 0;
    const total = subtotal + shippingCost - (appliedCoupon ? appliedCoupon.amount : 0);

    // Add payment methods
    const paymentMethods = [
        { value: 'card', label: 'Credit Card' }
    ];

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
        fetchShippingMethods();
    }, [user]);

    useEffect(() => {
        if (selectedAddress && shippingMethods && shippingMethods.length > 0) {
            const country = selectedAddress.country;
            const availableMethods = shippingMethods.filter(method => 
                method.isActive && (
                    !method.countries || 
                    method.countries.length === 0 || 
                    method.countries.includes(country)
                )
            );
            setFilteredShippingMethods(availableMethods);
            if (availableMethods.length > 0) {
                const defaultMethod = availableMethods.find(m => m.isDefault);
                setSelectedShipping(defaultMethod ? defaultMethod.id : availableMethods[0].id);
            } else {
                setSelectedShipping(null);
            }
        }
    }, [selectedAddress, shippingMethods]);

    const fetchAddresses = async () => {
        setLoadingAddresses(true);
        setErrorAddresses(null);
        try {
            const response = await axios.get('/api/addresses');
            setAddresses(response.data);
            setLoadingAddresses(false);
            // Set default address as selected if not already selected
            if (!selectedAddress) {
                const defaultAddress = response.data.find(addr => addr.isDefault);
                if (defaultAddress) setSelectedAddress(defaultAddress);
            }
        } catch (error) {
            setErrorAddresses('Could not load saved addresses');
            setLoadingAddresses(false);
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await axios.put(`/api/addresses/${addressId}/default`);
            await fetchAddresses();
        } catch (error) {
            setErrorAddresses('Could not set default address');
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            await axios.delete(`/api/addresses/${addressId}`);
            await fetchAddresses();
        } catch (error) {
            setErrorAddresses('Could not delete address');
        }
    };

    const fetchShippingMethods = async () => {
        try {
            const response = await axios.get('/api/shipping');
            setShippingMethods(response.data);
        } catch (error) {
            console.error('Error fetching shipping methods:', error);
            setError('Could not fetch shipping methods');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
    };

    const handleAddressSaved = (address) => {
        setSelectedAddress(address);
        setShowAddressForm(false);
    };

    const validateForm = () => {
        if (!selectedAddress) {
            setError('Please select or add an address');
            return false;
        }
        if (!selectedShipping) {
            setError('Please select a shipping method');
            return false;
        }
        if (formData.paymentMethod === 'card') {
            if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv) {
                setError('Please fill in all credit card fields');
                return false;
            }
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
                addressId: selectedAddress.id,
                shippingMethodId: selectedShipping,
                paymentMethod: formData.paymentMethod,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                subtotal,
                shippingCost,
                total
            };
            const response = await axios.post('/api/orders', orderData);
            clearCart();
            navigate(`/order-confirmation/${response.data.id}`);
        } catch (error) {
            setError(error.response?.data?.message || 'Error placing order');
            setLoading(false);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        try {
            const response = await axios.post('/api/coupons/apply', {
                code: couponCode.trim(),
                subtotal: subtotal
            });

            if (response.data) {
                setAppliedCoupon({
                    code: response.data.code,
                    amount: response.data.amount,
                    type: response.data.type,
                    value: response.data.value
                });
                setCouponError(null);
                setCouponCode('');
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            setCouponError(error.response?.data?.message || 'Error applying coupon');
            setAppliedCoupon(null);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError(null);
    };

    return (
        <div className="min-h-screen bg-blue-50 py-10 px-2 md:px-0">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-10 text-blue-900 tracking-tight text-center">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Address, Shipping, Payment */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Address Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center mb-4 gap-3">
                                <span className="bg-blue-100 text-blue-700 rounded-full p-2"><FaMapMarkerAlt size={20} /></span>
                                <h2 className="text-xl font-semibold text-blue-900">Shipping Address</h2>
                            </div>
                            {!showAddressForm ? (
                                <div>
                                    {/* Custom Address List */}
                                    {loadingAddresses ? (
                                        <div className="text-center py-4 text-gray-500">Loading addresses...</div>
                                    ) : errorAddresses ? (
                                        <div className="text-red-500 text-center py-4">{errorAddresses}</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {addresses && addresses.length > 0 ? addresses.map(address => (
                                                <div
                                                    key={address.id}
                                                    className={`border rounded-xl p-4 cursor-pointer transition-colors ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'} ${expandedAddressId === address.id ? 'shadow-lg' : ''}`}
                                                    onClick={() => setExpandedAddressId(expandedAddressId === address.id ? null : address.id)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="font-medium text-blue-900">
                                                            {address.firstName} {address.lastName} <span className="text-gray-500">({address.country})</span>
                                                            {address.isDefault && (
                                                                <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Default</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={e => { e.stopPropagation(); setEditingAddress(address); setShowAddressForm(true); }}
                                                                className="text-xs text-blue-600 hover:underline"
                                                            >Edit</button>
                                                            <div className="text-sm text-blue-600">{expandedAddressId === address.id ? 'Hide' : 'Show'}</div>
                                                        </div>
                                                    </div>
                                                    {expandedAddressId === address.id && (
                                                        <div className="mt-3 text-sm text-gray-700 space-y-1">
                                                            <div>{address.address1}</div>
                                                            {address.address2 && <div>{address.address2}</div>}
                                                            <div>{address.city}, {address.postalCode}</div>
                                                            <div>{address.phone}</div>
                                                            <div className="flex gap-4 mt-2">
                                                                {!address.isDefault && (
                                                                    <button
                                                                        onClick={e => { e.stopPropagation(); handleSetDefault(address.id); }}
                                                                        className="text-xs text-blue-600 hover:underline"
                                                                    >Set as Default</button>
                                                                )}
                                                                <button
                                                                    onClick={e => { e.stopPropagation(); handleDeleteAddress(address.id); }}
                                                                    className="text-xs text-red-600 hover:underline"
                                                                >Delete</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )) : (
                                                <div className="text-gray-500">No saved addresses found</div>
                                            )}
                                            <button
                                                onClick={() => setShowAddressForm(true)}
                                                className="w-full mt-4 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                                            >
                                                + Add New Address
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <AddressForm 
                                    initialData={editingAddress}
                                    onSaved={() => { setEditingAddress(null); setShowAddressForm(false); fetchAddresses(); }}
                                    onCancel={() => setEditingAddress(null)}
                                />
                            )}
                        </div>
                        {/* Shipping Method Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center mb-4 gap-3">
                                <span className="bg-blue-100 text-blue-700 rounded-full p-2"><FaTruck size={20} /></span>
                                <h2 className="text-xl font-semibold text-blue-900">Shipping Method</h2>
                            </div>
                            {filteredShippingMethods.length === 0 ? (
                                <div className="text-red-500">
                                    No shipping methods available for the selected country.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredShippingMethods.map(method => (
                                        <div
                                            key={method.id}
                                            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors duration-150 hover:bg-blue-50 
                                                ${selectedShipping === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                            onClick={() => setSelectedShipping(method.id)}
                                        >
                                            <input
                                                type="radio"
                                                name="shipping"
                                                checked={selectedShipping === method.id}
                                                onChange={() => setSelectedShipping(method.id)}
                                                className="mr-4 accent-blue-600"
                                            />
                                            <div className="flex-grow">
                                                <div className="font-medium text-blue-900">{method.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    Estimated delivery: {method.estimatedDelivery}
                                                </div>
                                                {method.description && (
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {method.description}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-medium text-blue-700">
                                                {method.price}€
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Payment Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center mb-4 gap-3">
                                <span className="bg-blue-100 text-blue-700 rounded-full p-2"><FaCreditCard size={20} /></span>
                                <h2 className="text-xl font-semibold text-blue-900">Payment Method</h2>
                            </div>
                            <div className="space-y-4">
                                {paymentMethods.map(method => (
                                    <div className="flex items-center" key={method.value}>
                                        <input
                                            type="radio"
                                            id={method.value}
                                            name="paymentMethod"
                                            value={method.value}
                                            checked={formData.paymentMethod === method.value}
                                            onChange={handleChange}
                                            className="mr-2 accent-blue-600"
                                        />
                                        <label htmlFor={method.value} className="font-medium text-blue-900">{method.label}</label>
                                    </div>
                                ))}
                            </div>
                            {formData.paymentMethod === 'card' && (
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                            placeholder="1234 5678 9012 3456"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                name="cardExpiry"
                                                value={formData.cardExpiry}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                                placeholder="MM/YY"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                name="cardCvv"
                                                value={formData.cardCvv}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                                placeholder="123"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
                            <div className="flex items-center mb-4 gap-3">
                                <span className="bg-blue-100 text-blue-700 rounded-full p-2"><FaReceipt size={20} /></span>
                                <h2 className="text-xl font-semibold text-blue-900">Order Summary</h2>
                            </div>
                            {/* Product Details */}
                            <div className="mb-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
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
                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-700">
                                        <span>Discount</span>
                                        <span>-{appliedCoupon.amount.toFixed(2)}€</span>
                                    </div>
                                )}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>{total.toFixed(2)}€</span>
                                    </div>
                                </div>

                                {/* Coupon Section - MOVED HERE */}
                                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                    <h3 className="text-lg font-semibold mb-3">Apply Coupon</h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Enter coupon code"
                                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={!!appliedCoupon}
                                        />
                                        {!appliedCoupon ? (
                                            <button
                                                onClick={handleApplyCoupon}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                Apply
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    {couponError && (
                                        <p className="mt-2 text-sm text-red-600">{couponError}</p>
                                    )}
                                    {appliedCoupon && (
                                        <div className="mt-2 p-2 bg-green-50 rounded-md">
                                            <p className="text-sm text-green-700">
                                                Coupon applied: {appliedCoupon.code} ({appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `${appliedCoupon.value}€`})
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm mt-4">
                                        {error}
                                    </div>
                                )}
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-xl text-white font-medium text-lg shadow transition-colors duration-150
                                        ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="w-full mt-2 py-2 px-4 rounded-xl text-blue-700 bg-blue-100 hover:bg-blue-200 font-medium transition-colors duration-150"
                                >
                                    Back to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
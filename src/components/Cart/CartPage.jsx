import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../config/axios';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/api/cart');
            setCartItems(response.data.items || []);
        } catch (err) {
            console.error('Gabim gjatë marrjes së produkteve:', err);
            setError(err.message || 'Nuk mund të merren produktet nga shporta. Ju lutemi provoni përsëri.');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            setError(null);
            await api.put(`/api/cart/update/${productId}`, { quantity: newQuantity });
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        } catch (err) {
            console.error('Gabim gjatë përditësimit të sasisë:', err);
            setError(err.message || 'Nuk mund të përditësohet sasia. Ju lutemi provoni përsëri.');
        }
    };

    const removeItem = async (productId) => {
        try {
            setError(null);
            await api.delete(`/api/cart/remove/${productId}`);
            setCartItems(prevItems =>
                prevItems.filter(item => item.productId !== productId)
            );
        } catch (err) {
            console.error('Gabim gjatë heqjes së produktit:', err);
            setError(err.message || 'Nuk mund të heqet produkti. Ju lutemi provoni përsëri.');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        navigate('/checkout');
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
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchCartItems}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Provoni Përsëri
                    </button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Shporta juaj është bosh</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                    Shiko Produktet
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Shporta Juaj</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    {cartItems.map(item => (
                        <div key={item.productId} className="flex items-center border-b py-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <div className="ml-4 flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-gray-600">{item.price}€</p>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                        className="px-2 py-1 border rounded"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        className="px-2 py-1 border rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => removeItem(item.productId)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Fshi
                            </button>
                        </div>
                    ))}
                </div>
                <div className="md:col-span-1">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Përmbledhje e Porosisë</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Nëntotali:</span>
                                <span>{calculateTotal().toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Transporti:</span>
                                <span>Llogaritet në checkout</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-semibold">
                                    <span>Totali:</span>
                                    <span>{calculateTotal().toFixed(2)}€</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                        >
                            Vazhdo me Pagesën
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage; 
import React from 'react';
// DEBUG: THIS IS PAGES/CARTPAGE.JSX
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CartPage = () => {
    const { cart, removeFromCart, loading } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleRemoveItem = async (productId) => {
        try {
            await removeFromCart(productId);
            toast.success('Produkti u hoq nga shporta');
        } catch (error) {
            toast.error('Gabim gjatë heqjes së produktit');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Duke u ngarkuar...</div>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Shporta Juaj</h1>
                <p>Shporta juaj është bosh.</p>
            </div>
        );
    }

    const calculateTotal = () => {
        return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Shporta Juaj</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    {cart.items.map(item => (
                        <div key={item.productId} className="flex items-center justify-between border-b py-4">
                            <div className="flex items-center">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover mr-4" />
                                <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">{item.price} €</p>
                                    <p className="text-sm text-gray-500">Sasia: {item.quantity}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</p>
                                <button
                                    onClick={() => handleRemoveItem(item.productId)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="md:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Përmbledhja e Porosisë</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Nëntotali:</span>
                                <span>{calculateTotal().toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Transporti:</span>
                                <span>0.00 €</span>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between font-semibold">
                                    <span>Totali:</span>
                                    <span>{calculateTotal().toFixed(2)} €</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
                        >
                            Porosit Tani
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
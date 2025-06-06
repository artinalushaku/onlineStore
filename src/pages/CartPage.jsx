import React from 'react';
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
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
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
                    <div className="bg-gray-100 p-4 rounded">
                        <h2 className="text-xl font-bold mb-4">Përmbledhje</h2>
                        <div className="flex justify-between mb-2">
                            <span>Nëntotali:</span>
                            <span>{cart.total} €</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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
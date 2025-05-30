import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const Cart = () => {
    const { cart, loading, removeFromCart, updateQuantity } = useCart();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Shporta Juaj është Bosh</h1>
                <Link
                    to="/products"
                    className="text-primary hover:underline"
                >
                    Shiko Produktet
                </Link>
            </div>
        );
    }

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shporta</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {cart.map(item => (
                        <div
                            key={item.id}
                            className="flex items-center border-b py-4"
                        >
                            <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                            <div className="ml-4 flex-1">
                                <h3 className="font-semibold">{item.product.name}</h3>
                                <p className="text-gray-600">{item.price}€</p>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        className="px-2 py-1 border rounded-md"
                                    >
                                        -
                                    </button>
                                    <span className="mx-4">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        className="px-2 py-1 border rounded-md"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">
                                    {(item.price * item.quantity).toFixed(2)}€
                                </p>
                                <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="text-red-500 hover:text-red-700 mt-2"
                                >
                                    Hiq
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Përmbledhja e Porosisë</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Nëntotali:</span>
                                <span>{calculateTotal().toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Transporti:</span>
                                <span>0.00€</span>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between font-semibold">
                                    <span>Totali:</span>
                                    <span>{calculateTotal().toFixed(2)}€</span>
                                </div>
                            </div>
                        </div>
                        <Link
                            to="/checkout"
                            className="block w-full bg-primary text-white text-center py-3 rounded-md mt-6 hover:bg-primary-dark transition-colors"
                        >
                            Vazhdo me Pagesën
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 
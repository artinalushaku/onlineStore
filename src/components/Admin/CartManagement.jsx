import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartManagement = () => {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCart, setSelectedCart] = useState(null);

    useEffect(() => {
        fetchCarts();
    }, []);

    const fetchCarts = async () => {
        try {
            const response = await axios.get('/api/admin/carts', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCarts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së shportave:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (cartId) => {
        if (window.confirm('A jeni të sigurt që dëshironi ta fshini këtë shportë?')) {
            try {
                await axios.delete(`/api/admin/carts/${cartId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                fetchCarts();
            } catch (error) {
                console.error('Gabim gjatë fshirjes së shportës:', error);
            }
        }
    };

    const handleViewDetails = (cart) => {
        setSelectedCart(cart);
    };

    const handleCloseDetails = () => {
        setSelectedCart(null);
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
            <h1 className="text-3xl font-bold mb-8">Menaxhimi i Shportave</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Përdoruesi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Numri i Produkteve
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Totali
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data e Krijimit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Veprime
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {carts.map(cart => (
                            <tr key={cart._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cart.user ? cart.user.name : 'Anonim'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cart.items.length}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cart.total}€
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(cart.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleViewDetails(cart)}
                                        className="text-primary-600 hover:text-primary-900 mr-4"
                                    >
                                        Shiko
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cart._id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Fshi
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedCart && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Detajet e Shportës
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <div className="mb-4">
                                    <h4 className="font-medium">Përdoruesi:</h4>
                                    <p className="text-sm text-gray-600">{selectedCart.user ? selectedCart.user.name : 'Anonim'}</p>
                                    <p className="text-sm text-gray-600">{selectedCart.user ? selectedCart.user.email : '—'}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Produktet:</h4>
                                    {selectedCart.items.map((item, index) => (
                                        <div key={index} className="text-sm text-gray-600 mt-2">
                                            <p>{item.name}</p>
                                            <p>Sasia: {item.quantity}</p>
                                            <p>Çmimi: {item.price}€</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Totali:</h4>
                                    <p className="text-sm text-gray-600">{selectedCart.total}€</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Data e Krijimit:</h4>
                                    <p className="text-sm text-gray-600">
                                        {new Date(selectedCart.createdAt).toLocaleDateString()}
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

export default CartManagement;
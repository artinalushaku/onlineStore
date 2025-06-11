import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';

const WishlistManagement = () => {
    const [wishlists, setWishlists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWishlist, setSelectedWishlist] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchWishlists();
    }, []);

    const fetchWishlists = async () => {
        try {
            const response = await axios.get('/api/admin/wishlists', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setWishlists(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së wishlistave:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (wishlistId) => {
        if (window.confirm('A jeni të sigurt që dëshironi ta fshini këtë wishlist?')) {
            try {
                await axios.delete(`/api/admin/wishlists/${wishlistId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                fetchWishlists();
            } catch (error) {
                console.error('Gabim gjatë fshirjes së wishlistës:', error);
            }
        }
    };

    const handleViewDetails = (wishlist) => {
        setSelectedWishlist(wishlist);
    };

    const handleCloseDetails = () => {
        setSelectedWishlist(null);
    };

    const filteredWishlists = wishlists.filter(wishlist => 
        wishlist.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wishlist.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Lista e Dëshirave të Klientëve</h1>
            
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Kërko sipas emrit ose emailit të klientit..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Klienti
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Numri i Produkteve
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data e Shtimit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Veprime
                            </th>
                    </tr>
                </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredWishlists.length > 0 ? (
                            filteredWishlists.map(wishlist => (
                                <tr key={wishlist._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {wishlist.user?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {wishlist.user?.email || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {wishlist.products?.length || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(wishlist.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetails(wishlist)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Shiko Detajet
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    Nuk u gjetën wishlista
                                </td>
                    </tr>
                        )}
                </tbody>
            </table>
            </div>

            {selectedWishlist && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Lista e Dëshirave - {selectedWishlist.user?.name}
                                </h3>
                                <button
                                    onClick={handleCloseDetails}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="mt-2 px-7 py-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedWishlist.products?.map(product => (
                                        <div key={product._id} className="border rounded-lg p-4 shadow-sm">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-48 object-cover rounded-lg mb-3"
                                            />
                                            <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
                                            <p className="text-gray-600 mb-2">{product.price} €</p>
                                            <p className="text-sm text-gray-500">
                                                Shtuar më: {new Date(product.addedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WishlistManagement; 
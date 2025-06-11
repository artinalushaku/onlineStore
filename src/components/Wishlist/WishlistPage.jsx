import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await axios.get('/api/wishlist', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setWishlist(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së listës së preferencave:', error);
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`/api/wishlist/${productId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setWishlist(prev =>
                prev.filter(item => item.product._id !== productId)
            );
        } catch (error) {
            console.error('Gabim gjatë heqjes së produktit:', error);
        }
    };

    const addToCart = async (productId) => {
        try {
            await axios.post(
                '/api/cart',
                { productId, quantity: 1 },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            removeFromWishlist(productId);
        } catch (error) {
            console.error('Gabim gjatë shtimit në shportë:', error);
        }
    };

    // Funksion ndihmës për të marrë imazhin e parë nga struktura të ndryshme
    const getFirstImage = (images) => {
        if (!images) return '';
        if (Array.isArray(images)) return images[0];
        if (typeof images === 'string') {
            if (images.startsWith('[')) {
                try {
                    const arr = JSON.parse(images);
                    return Array.isArray(arr) ? arr[0] : '';
                } catch {
                    return '';
                }
            }
            return images;
        }
        return '';
    };

    const getImageSrc = (imgPath) => {
        if (!imgPath) return '';
        if (imgPath.startsWith('/uploads/')) {
            return `http://localhost:5000${imgPath}`;
        }
        if (imgPath.startsWith('http')) {
            return imgPath;
        }
        return `http://localhost:5000/uploads/${imgPath}`;
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
            <h1 className="text-3xl font-bold mb-8">Lista e Preferencave</h1>

            {wishlist.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600 mb-4">
                        Lista juaj e preferencave është bosh
                    </p>
                    <Link to="/products" className="btn btn-primary">
                        Shiko Produktet
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map(item => (
                        <div
                            key={item._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <Link to={`/products/${item.product._id}`}>
                                <img
                                    src={getImageSrc(getFirstImage(item.product.images))}
                                    alt={item.product.name}
                                    className="w-full h-48 object-cover"
                                />
                            </Link>
                            <div className="p-4">
                                <Link
                                    to={`/products/${item.product._id}`}
                                    className="block"
                                >
                                    <h2 className="text-lg font-semibold mb-2">
                                        {item.product.name}
                                    </h2>
                                </Link>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        {item.product.discount ? (
                                            <div>
                                                <span className="text-gray-500 line-through">
                                                    {item.product.price}€
                                                </span>
                                                <span className="ml-2 text-red-600 font-semibold">
                                                    {item.product.price -
                                                        (item.product.price *
                                                            item.product.discount) /
                                                            100}€
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="font-semibold">
                                                {item.product.price}€
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-yellow-400">★</span>
                                        <span className="ml-1 text-gray-600">
                                            {item.product.rating}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        onClick={() =>
                                            removeFromWishlist(item.product._id)
                                        }
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Fshi
                                    </button>
                                    <button
                                        onClick={() =>
                                            addToCart(item.product._id)
                                        }
                                        className="btn btn-primary"
                                    >
                                        Shto në Shportë
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage; 
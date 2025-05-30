import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlistItems();
    }, []);

    const fetchWishlistItems = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('/api/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlistItems(response.data.items || []);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së listës së dëshirave:', error);
            toast.error('Gabim gjatë marrjes së listës së dëshirave');
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/wishlist/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchWishlistItems();
            toast.success('Produkti u fshi nga lista e dëshirave');
        } catch (error) {
            console.error('Gabim gjatë fshirjes së produktit:', error);
            toast.error('Gabim gjatë fshirjes së produktit');
        }
    };

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/cart/add', 
                { productId, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Produkti u shtua në shportë');
        } catch (error) {
            console.error('Gabim gjatë shtimit në shportë:', error);
            toast.error('Gabim gjatë shtimit në shportë');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Lista e Dëshirave</h1>
            
            {wishlistItems.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Lista juaj e dëshirave është bosh</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
                    >
                        Shiko Produktet
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                        <div key={item.productId} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                                <p className="text-gray-600 mb-4">{item.price}€</p>
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => addToCart(item.productId)}
                                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                                    >
                                        Shto në Shportë
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(item.productId)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Fshi
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

export default Wishlist; 
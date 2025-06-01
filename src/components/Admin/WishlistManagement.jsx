import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WishlistManagement = () => {
    const [wishlists, setWishlists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWishlist, setSelectedWishlist] = useState(null);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Menaxhimi i Listës së Dëshirave</h1>
            <button className="mb-4 px-4 py-2 bg-primary text-white rounded">Shto</button>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Përdoruesi</th>
                        <th className="py-2 px-4 border-b">Produkte</th>
                        <th className="py-2 px-4 border-b">Veprime</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="4" className="text-center py-4">Nuk ka të dhëna.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default WishlistManagement; 
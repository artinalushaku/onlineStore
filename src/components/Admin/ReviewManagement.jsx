import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get('/api/admin/reviews', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setReviews(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së komenteve:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (reviewId, isApproved) => {
        try {
            await axios.put(`/api/admin/reviews/${reviewId}/status`, {
                isApproved: !isApproved
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchReviews();
        } catch (error) {
            console.error('Gabim gjatë ndryshimit të statusit:', error);
        }
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm('A jeni të sigurt që dëshironi ta fshini këtë koment?')) {
            try {
                await axios.delete(`/api/admin/reviews/${reviewId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                fetchReviews();
            } catch (error) {
                console.error('Gabim gjatë fshirjes së komentit:', error);
            }
        }
    };

    const handleViewDetails = (review) => {
        setSelectedReview(review);
    };

    const handleCloseDetails = () => {
        setSelectedReview(null);
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
            <h1 className="text-3xl font-bold mb-8">Menaxhimi i Komenteve</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Përdoruesi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Produkti
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vlerësimi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statusi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Veprime
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reviews.map(review => (
                            <tr key={review._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {review.user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {review.product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {review.rating}/5
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleStatusChange(review._id, review.isApproved)}
                                        className={`px-3 py-1 rounded ${
                                            review.isApproved
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {review.isApproved ? 'Aprovuar' : 'Jo Aprovuar'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleViewDetails(review)}
                                        className="text-primary-600 hover:text-primary-900 mr-4"
                                    >
                                        Shiko
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review._id)}
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

            {selectedReview && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Detajet e Komentit
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <div className="mb-4">
                                    <h4 className="font-medium">Përdoruesi:</h4>
                                    <p className="text-sm text-gray-600">{selectedReview.user.name}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Produkti:</h4>
                                    <p className="text-sm text-gray-600">{selectedReview.product.name}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Vlerësimi:</h4>
                                    <p className="text-sm text-gray-600">{selectedReview.rating}/5</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Koment:</h4>
                                    <p className="text-sm text-gray-600">{selectedReview.comment}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Data:</h4>
                                    <p className="text-sm text-gray-600">
                                        {new Date(selectedReview.createdAt).toLocaleDateString()}
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

export default ReviewManagement; 
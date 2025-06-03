import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductRecommendations = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            const response = await axios.get('/api/products/recommendations', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setRecommendations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së rekomandimeve:', error);
            setError('Nuk mund të merren rekomandimet. Ju lutemi provoni përsëri.');
            setLoading(false);
        }
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
            <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={fetchRecommendations}
                    className="mt-4 text-primary hover:underline"
                >
                    Provoni Përsëri
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Rekomandime për Ju</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendations.map(product => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                    >
                        <div className="relative">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            {product.discount && (
                                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                    -{product.discount}%
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">
                                {product.name}
                            </h3>

                            <div className="flex items-center mb-2">
                                <span className="text-yellow-500">
                                    {'★'.repeat(Math.floor(product.rating))}
                                    {'☆'.repeat(5 - Math.floor(product.rating))}
                                </span>
                                <span className="text-sm text-gray-600 ml-2">
                                    ({product.reviewCount})
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    {product.discount ? (
                                        <>
                                            <span className="text-lg font-bold text-primary">
                                                {product.discountPrice}€
                                            </span>
                                            <span className="text-sm text-gray-500 line-through ml-2">
                                                {product.price}€
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-lg font-bold">
                                            {product.price}€
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Shto në shportë
                                    }}
                                    className="text-primary hover:text-primary-dark"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {recommendations.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-600">
                        Nuk kemi rekomandime për ju akoma. Bli disa produkte për të marrë rekomandime të personalizuara.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductRecommendations; 
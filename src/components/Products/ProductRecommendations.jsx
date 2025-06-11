import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductRecommendations = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products?limit=100');
            setProducts(response.data.products || []);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së produkteve:', error);
            setError('Nuk mund të merren produktet. Ju lutemi provoni përsëri.');
            setLoading(false);
        }
    };

    // Helper to get image
    const getImage = (product) => {
        let imageSrc = product.image;
        if (!imageSrc) {
            if (Array.isArray(product.images)) {
                imageSrc = product.images[0];
            } else if (typeof product.images === 'string') {
                try {
                    const arr = JSON.parse(product.images);
                    imageSrc = Array.isArray(arr) ? arr[0] : product.images;
                } catch {
                    imageSrc = product.images;
                }
            }
        }
        return imageSrc;
    };

    // Sections
    const bestSellers = [...products].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 4);
    const newArrivals = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
    const onSale = products.filter(p => p.discount && p.discount > 0).slice(0, 4);

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
                    onClick={fetchProducts}
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

            {/* Best Sellers */}
            <Section title="Më të Shiturat" products={bestSellers} navigate={navigate} getImage={getImage} />
            {/* New Arrivals */}
            <Section title="Të Shtuar Së Fundmi" products={newArrivals} navigate={navigate} getImage={getImage} />
            {/* On Sale */}
            <Section title="Në Zbritje" products={onSale} navigate={navigate} getImage={getImage} />
        </div>
    );
};

const Section = ({ title, products, navigate, getImage }) => (
    <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        {products.length === 0 ? (
            <div className="text-gray-500 mb-4">Nuk ka produkte për këtë seksion.</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map(product => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                    >
                        <div className="relative">
                            <img
                                src={getImage(product)?.startsWith('http') ? getImage(product) : `http://localhost:5000/uploads/${getImage(product)}`}
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
                                                {product.discountPrice || (product.price - (product.price * product.discount / 100)).toFixed(2)}€
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
                                    onClick={e => { e.stopPropagation(); }}
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
        )}
    </div>
);

export default ProductRecommendations;
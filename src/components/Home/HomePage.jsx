import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import ProductCard from '../Products/ProductCard';
import CategoryList from '../Categories/CategoryList';

const HomePage = () => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(Array.isArray(response.data.products) ? response.data.products : []);
            setLoading(false);
        } catch (error) {
            setError('Nuk mund të merren të dhënat e produkteve');
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            const result = await addToCart(productId);
            if (!result.success) {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Gabim gjatë shtimit në shportë:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
                <button
                    onClick={fetchProducts}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                    Provoni Përsëri
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-32 mb-20 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 animate-fade-in-up">
                            Mirësevini në Dyqanin Tonë Online
                        </h1>
                        <p className="text-2xl opacity-90 mb-12 animate-fade-in-up delay-200 max-w-2xl mx-auto">
                            Zbuloni koleksionin tonë të produkteve të cilësisë së lartë me çmime të përballueshme
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
                            <Link
                                to="/products"
                                className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
                            >
                                Shiko Produktet
                            </Link>
                            <Link
                                to="/categories"
                                className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-600 transition duration-300 transform hover:scale-105"
                            >
                                Shfletoni Kategoritë
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="container mx-auto px-4 mb-20">
                <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
                    Shfletoni sipas Kategorive
                </h2>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <CategoryList />
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="container mx-auto px-4 mb-20">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4 sm:mb-0">Produktet e Fundit</h2>
                    <Link 
                        to="/products" 
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold group"
                    >
                        Shiko të Gjitha Produktet
                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.slice(0, 8).map(product => (
                        <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Special Offers Section */}
            <section className="relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-24 mb-20 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">Oferta Speciale</h2>
                        <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
                            Regjistrohu për të marrë njoftime për ofertat tona speciale dhe zbritjet ekskluzive
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {user ? (
                                <Link
                                    to="/profile"
                                    className="inline-block bg-white text-emerald-600 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
                                >
                                    Shiko Profilin
                                </Link>
                            ) : (
                                <Link
                                    to="/register"
                                    className="inline-block bg-white text-emerald-600 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
                                >
                                    Regjistrohu Tani
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage; 
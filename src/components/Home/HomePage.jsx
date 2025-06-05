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
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24 mb-16 rounded-lg shadow-xl">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
                        Mirësevini në Dyqanin Tonë Online
                    </h1>
                    <p className="text-xl opacity-90 mb-10 animate-fade-in-up delay-200">
                        Zbuloni koleksionin tonë të produkteve të cilësisë së lartë me çmime të përballueshme
                    </p>
                    <Link
                        to="/products"
                        className="inline-block bg-white text-blue-700 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 transition duration-300 animate-fade-in-up delay-400"
                    >
                        Shiko Produktet
                    </Link>
                </div>
            </section>

            {/* Categories Section (Add a heading or context if needed) */}
            <section className="mb-16">
                {/* Assuming CategoryList component has its own internal styling */}
                {/* <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shfletoni sipas Kategorive</h2> */}
                <CategoryList />
            </section>

            {/* Featured Products Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Produktet e Fundit</h2>
                    <Link to="/products" className="text-blue-600 hover:underline font-semibold">
                        Shiko të Gjitha Produktet
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Render only a limited number of products, e.g., first 8 */}
                    {products.slice(0, 8).map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* Special Offers Section */}
            <section className="bg-gradient-to-r from-teal-500 to-green-600 text-white py-20 rounded-lg shadow-xl">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Oferta Speciale</h2>
                    <p className="text-xl opacity-90 mb-10">
                        Regjistrohu për të marrë njoftime për ofertat tona speciale dhe zbritjet ekskluzive
                    </p>
                    {user ? (
                        <Link
                            to="/profile"
                            className="inline-block bg-white text-green-700 px-8 py-3 rounded-full font-bold text-lg shadow hover:bg-gray-100 transition duration-300"
                        >
                            Shiko Profilin
                        </Link>
                    ) : (
                        <Link
                            to="/register"
                            className="inline-block bg-white text-green-700 px-8 py-3 rounded-full font-bold text-lg shadow hover:bg-gray-100 transition duration-300"
                        >
                            Regjistrohu Tani
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage; 
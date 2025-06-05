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
            <section className="bg-primary text-white py-20 mb-12 rounded-lg">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Mirësevini në Dyqanin Tonë Online
                    </h1>
                    <p className="text-xl mb-8">
                        Zbuloni koleksionin tonë të produkteve të cilësisë së lartë me çmime të përballueshme
                    </p>
                    <Link
                        to="/products"
                        className="bg-white text-primary px-8 py-3 rounded-md font-semibold hover:bg-gray-100"
                    >
                        Shiko Produktet
                    </Link>
                </div>
            </section>

            {/* Të gjithë produktet */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Produktet</h2>
                    <Link to="/products" className="text-primary hover:underline">
                        Shiko të Gjitha
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <Link to={`/products/${product.id}`}>
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                            </Link>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">
                                    <Link to={`/products/${product.id}`} className="hover:text-primary">
                                        {product.name}
                                    </Link>
                                </h3>
                                <p className="text-gray-600 mb-2">{product.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-primary font-semibold">{product.price}€</span>
                                    <button
                                        onClick={() => handleAddToCart(product.id)}
                                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                                    >
                                        Shto në Shportë
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Special Offers */}
            <section className="bg-gray-50 py-12 rounded-lg">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Oferta Speciale</h2>
                    <p className="text-xl mb-8">
                        Regjistrohu për të marrë njoftime për ofertat tona speciale dhe zbritjet ekskluzive
                    </p>
                    {user ? (
                        <Link
                            to="/profile"
                            className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-dark"
                        >
                            Shiko Profilin
                        </Link>
                    ) : (
                        <Link
                            to="/register"
                            className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-dark"
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
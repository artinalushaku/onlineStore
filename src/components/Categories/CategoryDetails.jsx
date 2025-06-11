import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const CategoryDetails = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        fetchCategoryAndProducts();
    }, [id]);

    const fetchCategoryAndProducts = async () => {
        try {
            setLoading(true);
            const [categoryResponse, productsResponse] = await Promise.all([
                axios.get(`/api/categories/${id}`),
                axios.get(`/api/products?categoryId=${id}`)
            ]);
            setCategory(categoryResponse.data);
            setProducts(productsResponse.data.products || []);
        } catch (error) {
            console.error('Error fetching category details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user) {
            toast.error('Ju duhet të jeni të kyçur për të shtuar produkte në shportë');
            return;
        }

        const confirmAdd = window.confirm('A jeni i sigurt që dëshironi ta shtoni këtë produkt në shportë?');

        if (confirmAdd) {
            const result = await addToCart(productId);
            if (result.success) {
                toast.success('Produkti u shtua në shportë');
            } else {
                toast.error(result.error || 'Gabim gjatë shtimit në shportë');
            }
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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Kategoria nuk u gjet</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h2 className="text-4xl font-extrabold mb-4 text-center tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
                {category.name}
            </h2>
            {category.description && (
                <p className="mb-10 text-lg text-center text-gray-600 max-w-2xl mx-auto">{category.description}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {Array.isArray(products) && products.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">Nuk ka produkte në këtë kategori.</div>
                ) : (
                    Array.isArray(products) && products.map(product => (
                        <div key={product._id || product.id} className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
                            <Link to={`/products/${product._id || product.id}`} className="block group relative">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={getImageSrc(getFirstImage(product.images))}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                                    {product.discount > 0 && (
                                        <div className="absolute top-4 left-4 bg-red-600 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md">
                                            -{product.discount}%
                                        </div>
                                    )}
                                    {product.stock === 0 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                            <span className="text-white text-sm font-semibold">Jashtë Gjendjes</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                            <div className="p-6 flex flex-col gap-3 flex-1">
                                <Link to={`/products/${product._id || product.id}`}>
                                    <h3 className="text-xl font-bold mb-1 text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-2 mb-2">
                                    {product.discount > 0 ? (
                                        <>
                                            <span className="text-gray-400 line-through text-xs">
                                                {product.price}€
                                            </span>
                                            <span className="text-lg font-bold text-red-500">
                                                {(product.price - (product.price * product.discount / 100)).toFixed(2)}€
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-lg font-bold text-gray-800">
                                            {product.price}€
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'stroke-current fill-none'}`}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                                />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-gray-500 text-xs ml-1">
                                        ({product.rating || 0})
                                    </span>
                                    {product.stock > 0 && (
                                        <span className="text-green-500 text-xs font-medium ml-auto">
                                            Në Gjendje
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => handleAddToCart(e, product._id || product.id)}
                                    disabled={product.stock === 0}
                                    className="mt-auto w-full py-2 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl shadow hover:from-blue-500 hover:to-primary transition-all duration-300 text-base tracking-wide backdrop-blur-md disabled:opacity-50"
                                >
                                    Shto në Shportë
                                </button>
                            </div>
                            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary transition-all duration-300 pointer-events-none"></div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CategoryDetails; 
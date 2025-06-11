import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së kategorive:', error);
            setError('Nuk mund të merren kategoritë. Ju lutemi provoni përsëri.');
            setLoading(false);
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
        // Nëse është path absolut Windows, nxirr vetëm emrin e skedarit
        const fileName = imgPath.split('\\').pop().split('/').pop();
        if (imgPath.startsWith('/uploads/')) {
            return `http://localhost:5000${imgPath}`;
        }
        if (imgPath.startsWith('http')) {
            return imgPath;
        }
        // Nëse është vetëm emri i skedarit ose path absolut
        return `http://localhost:5000/uploads/${fileName}`;
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
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-extrabold mb-10 text-center tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
                Kategoritë
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="group relative block rounded-3xl overflow-hidden shadow-xl bg-white/30 backdrop-blur-lg border border-white/20 hover:scale-105 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                                src={getImageSrc(category.image)}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                            <div className="absolute top-4 left-4 bg-white/80 text-primary font-bold px-3 py-1 rounded-full text-xs shadow-md backdrop-blur-sm">
                                {category.name}
                            </div>
                            {/* Badge për numrin e produkteve nëse ka (opsionale) */}
                            {category.productCount && (
                                <div className="absolute top-4 right-4 bg-primary text-white font-bold px-3 py-1 rounded-full text-xs shadow-md">
                                    {category.productCount} produkte
                                </div>
                            )}
                        </div>
                        <div className="p-6 flex flex-col gap-3">
                            <h2 className="text-2xl font-bold mb-1 text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                {category.name}
                            </h2>
                            {category.description && (
                                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                    {category.description}
                                </p>
                            )}
                            <button
                                className="mt-auto w-full py-2 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl shadow hover:from-blue-500 hover:to-primary transition-all duration-300 text-base tracking-wide backdrop-blur-md"
                            >
                                Shiko produktet
                            </button>
                        </div>
                        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary transition-all duration-300 pointer-events-none"></div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryList; 
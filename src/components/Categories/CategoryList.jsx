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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {categories.map((category) => (
                <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="block group"
                >
                    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:transform group-hover:scale-105">
                        {category.image && (
                            <div className="relative aspect-[3/2]">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        )}
                        <div className="p-4 min-h-[160px]">
                            <h2 className="text-base font-semibold mb-2 text-gray-800 group-hover:text-primary line-clamp-1">
                                {category.name}
                            </h2>
                            {category.description && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                    {category.description}
                                </p>
                            )}
                            <div className="flex items-center text-sm text-primary font-medium">
                                <span>Shiko produktet</span>
                                <svg
                                    className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default CategoryList; 
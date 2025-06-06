import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';

const ProductList = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        categoryId: searchParams.get('categoryId') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'newest',
        query: searchParams.get('query') || '',
        rating: searchParams.get('rating') || '',
        inStock: searchParams.get('inStock') === 'true',
        onSale: searchParams.get('onSale') === 'true',
    });
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState(filters.query);
    const [minPriceInput, setMinPriceInput] = useState(filters.minPrice);
    const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: currentPage,
                ...filters
            });
            const response = await axios.get(`/api/products?${queryParams}`);
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së produkteve:', error);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Gabim gjatë marrjes së kategorive:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line
    }, [filters, currentPage]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'minPrice') {
            setMinPriceInput(value);
            return;
        }
        if (name === 'maxPrice') {
            setMaxPriceInput(value);
            return;
        }
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // New: handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setFilters(prev => ({
            ...prev,
            query: searchInput
        }));
        setCurrentPage(1);
    };

    // New: handle price filter submit
    const handlePriceFilterSubmit = (e) => {
        e.preventDefault();
        setFilters(prev => {
            const newFilters = { ...prev };
            if (minPriceInput) {
                newFilters.minPrice = minPriceInput;
            } else {
                delete newFilters.minPrice;
            }
            if (maxPriceInput) {
                newFilters.maxPrice = maxPriceInput;
            } else {
                delete newFilters.maxPrice;
            }
            return newFilters;
        });
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Filtro</h2>
                            
                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kërko
                                </label>
                                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                                    <input
                                        type="text"
                                        name="query"
                                        value={searchInput}
                                        onChange={e => setSearchInput(e.target.value)}
                                        placeholder="Shkruaj për të kërkuar..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                        Kërko
                                    </button>
                                </form>
                            </div>

                            {/* Category */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategoria
                                </label>
                                <select
                                    name="categoryId"
                                    value={filters.categoryId}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Të gjitha</option>
                                    {categories.map(category => (
                                        <option key={category.id || category._id} value={category.id || category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Çmimi
                                </label>
                                <form onSubmit={handlePriceFilterSubmit} className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        value={minPriceInput}
                                        onChange={handleFilterChange}
                                        placeholder="Min €"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        value={maxPriceInput}
                                        onChange={handleFilterChange}
                                        placeholder="Max €"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <button type="submit" className="col-span-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mt-2">
                                        Filtro
                                    </button>
                                </form>
                            </div>

                            {/* Sort */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rendit
                                </label>
                                <select
                                    name="sort"
                                    value={filters.sort}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="newest">Më të rejat</option>
                                    <option value="price_asc">Çmimi: Nga më i ulët</option>
                                    <option value="price_desc">Çmimi: Nga më i lartë</option>
                                    <option value="rating">Vlerësimi më i lartë</option>
                                </select>
                            </div>

                            {/* Rating */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Vlerësimi Minimal
                                </label>
                                <select
                                    name="rating"
                                    value={filters.rating}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Të Gjitha</option>
                                    <option value="4">4+ Yje</option>
                                    <option value="3">3+ Yje</option>
                                    <option value="2">2+ Yje</option>
                                    <option value="1">1+ Yje</option>
                                </select>
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={filters.inStock}
                                        onChange={handleFilterChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Në Stok</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="onSale"
                                        checked={filters.onSale}
                                        onChange={handleFilterChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Në Zbritje</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-medium text-gray-900 mb-2">Nuk u gjetën produkte</h3>
                                <p className="text-gray-500">Provoni të ndryshoni filtrat tuaja</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map(product => (
                                        <ProductCard key={product._id || product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-8 space-x-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-4 py-2 rounded-lg ${
                                                    currentPage === page
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList; 
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
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: currentPage,
                ...filters
            });
            const response = await axios.get(`http://127.0.0.1:5000/api/products?${queryParams}`);
            setProducts(Array.isArray(response.data.products) ? response.data.products : []);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së produkteve:', error);
            setError('Nuk mund të merren të dhënat e produkteve');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/categories');
            console.log('Categories API response:', response.data);
            setCategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Gabim gjatë marrjes së kategorive:', error);
            setCategories([]); // Set empty array on error
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

    // Add this helper function at the top of the component
    const renderCategoryOptions = () => {
        if (!Array.isArray(categories)) {
            console.warn('Categories is not an array:', categories);
            return <option value="">Të gjitha</option>;
        }
        
        return (
            <>
                <option value="">Të gjitha</option>
                {categories.map(category => (
                    <option key={category.id || category._id} value={category.id || category._id}>
                        {category.name}
                    </option>
                ))}
            </>
        );
    };

    // Advanced Search Dropdown UI
    const AdvancedSearchDropdown = () => (
        <div className="absolute z-20 w-80 mt-2 bg-white border rounded-md shadow-lg p-4">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kërko</label>
                <input
                    type="text"
                    name="query"
                    value={filters.query}
                    onChange={handleFilterChange}
                    className="input w-full"
                    placeholder="Shkruaj për të kërkuar..."
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
                <select
                    name="categoryId"
                    value={filters.categoryId}
                    onChange={handleFilterChange}
                    className="input w-full"
                >
                    {renderCategoryOptions()}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Çmimi Minimal</label>
                    <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="input w-full"
                        placeholder="Min €"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Çmimi Maksimal</label>
                    <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="input w-full"
                        placeholder="Max €"
                    />
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rendit</label>
                <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="input w-full"
                >
                    <option value="newest">Më të rejat</option>
                    <option value="price_asc">Çmimi: Nga më i ulët</option>
                    <option value="price_desc">Çmimi: Nga më i lartë</option>
                    <option value="rating">Vlerësimi më i lartë</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vlerësimi Minimal</label>
                <select
                    name="rating"
                    value={filters.rating}
                    onChange={handleFilterChange}
                    className="input w-full"
                >
                    <option value="">Të Gjitha</option>
                    <option value="4">4+ Yje</option>
                    <option value="3">3+ Yje</option>
                    <option value="2">2+ Yje</option>
                    <option value="1">1+ Yje</option>
                </select>
            </div>
            <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="inStock"
                        checked={filters.inStock}
                        onChange={handleFilterChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Në Stok</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="onSale"
                        checked={filters.onSale}
                        onChange={handleFilterChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Në Zbritje</span>
                </label>
            </div>
            <div className="flex justify-end">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setShowAdvancedSearch(false)}
                >
                    Mbyll
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {console.log('Current categories state:', categories)}
            <div className="flex flex-col md:flex-row gap-8 relative">
                {/* Advanced Search Button */}
                <div className="mb-4 md:mb-0 md:mr-4">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => setShowAdvancedSearch(v => !v)}
                    >
                        Kërkim i Avancuar
                    </button>
                    {showAdvancedSearch && <AdvancedSearchDropdown />}
                </div>
                {/* Sidebar Filters (existing) */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Filtro</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kategoria
                            </label>
                            <select
                                name="categoryId"
                                value={filters.categoryId}
                                onChange={handleFilterChange}
                                className="input"
                            >
                                {renderCategoryOptions()}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Çmimi
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                    placeholder="Min"
                                    className="input"
                                />
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                    placeholder="Max"
                                    className="input"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rendit
                            </label>
                            <select
                                name="sort"
                                value={filters.sort}
                                onChange={handleFilterChange}
                                className="input"
                            >
                                <option value="newest">Më të rejat</option>
                                <option value="price_asc">Çmimi: Nga më i ulët</option>
                                <option value="price_desc">Çmimi: Nga më i lartë</option>
                                <option value="rating">Vlerësimi më i lartë</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="flex-1">
                    {products.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-600">
                                Nuk u gjet asnjë produkt
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <nav className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Para
                                        </button>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => handlePageChange(index + 1)}
                                                className={`px-3 py-1 rounded-md ${
                                                    currentPage === index + 1
                                                        ? 'bg-primary-600 text-white'
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Pas
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList; 
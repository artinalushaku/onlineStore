import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

const AdvancedSearch = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [filters, setFilters] = useState({
        query: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        rating: '',
        sortBy: 'relevance',
        inStock: false,
        onSale: false
    });

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (
                    (key === 'minPrice' || key === 'maxPrice')
                        ? value !== '' && !isNaN(Number(value))
                        : value !== '' && value !== false
                ) {
                    params.append(key, value);
                }
            });

            const response = await axios.get(`/api/products?${params}`);
            setResults(response.data.products || []);
        } catch (error) {
            console.error('Gabim gjatë kërkimit:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <form onSubmit={handleSearch} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kërko
                        </label>
                        <input
                            type="text"
                            name="query"
                            value={filters.query}
                            onChange={handleFilterChange}
                            className="input w-full"
                            placeholder="Shkruaj për të kërkuar..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kategoria
                        </label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="input w-full"
                        >
                            <option value="">Të Gjitha Kategoritë</option>
                            <option value="electronics">Elektronikë</option>
                            <option value="clothing">Veshje</option>
                            <option value="books">Libra</option>
                            <option value="home">Shtëpi</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Çmimi Minimal
                            </label>
                            <input
                                type="number"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                className="input w-full"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Çmimi Maksimal
                            </label>
                            <input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                className="input w-full"
                                placeholder="1000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rendit Sipas
                        </label>
                        <select
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={handleFilterChange}
                            className="input w-full"
                        >
                            <option value="relevance">Relevanca</option>
                            <option value="price_asc">Çmimi: Nga më i ulët</option>
                            <option value="price_desc">Çmimi: Nga më i lartë</option>
                            <option value="rating">Vlerësimi</option>
                            <option value="newest">Më të Rejat</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vlerësimi Minimal
                        </label>
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

                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="inStock"
                                checked={filters.inStock}
                                onChange={handleFilterChange}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                Në Stok
                            </span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="onSale"
                                checked={filters.onSale}
                                onChange={handleFilterChange}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                Në Zbritje
                            </span>
                        </label>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-8 rounded-lg text-lg font-semibold shadow hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        <FaSearch />
                        {loading ? 'Po Kërkohet...' : 'Kërko'}
                    </button>
                </div>
            </form>

            {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map(product => {
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
                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={imageSrc}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
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
                                            onClick={() => navigate(`/products/${product.id}`)}
                                            className="text-primary hover:underline"
                                        >
                                            Shiko Detajet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && results.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-600">
                        Nuk u gjet asnjë rezultat për këtë kërkim.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdvancedSearch;
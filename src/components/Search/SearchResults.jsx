import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (query) {
            searchProducts(query);
        }
    }, [query]);

    const searchProducts = async (searchQuery) => {
        try {
            const response = await axios.get(`/api/products/search?q=${searchQuery}`);
            setResults(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë kërkimit:', error);
            setError('Nuk mund të kryhet kërkimi');
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
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
                <Link to="/" className="text-primary hover:underline">
                    Kthehu në Faqen Kryesore
                </Link>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Nuk u gjet asnjë rezultat për "{query}"
                </h1>
                <Link to="/products" className="text-primary hover:underline">
                    Shiko të gjitha produktet
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">
                Rezultatet e kërkimit për "{query}"
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                            <p className="text-gray-600 mb-2">{product.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-primary font-semibold">{product.price}€</span>
                                <Link
                                    to={`/products/${product.id}`}
                                    className="text-primary hover:underline"
                                >
                                    Shiko Detajet
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults; 
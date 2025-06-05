import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        if (token) {
            fetchCartCount();
            fetchWishlistCount();
        }
    }, []);

    const fetchCartCount = async () => {
        try {
            const response = await axios.get('/api/cart/count', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCartCount(response.data.count);
        } catch (error) {
            console.error('Gabim gjatë marrjes së numrit të artikujve në shportë:', error);
        }
    };

    const fetchWishlistCount = async () => {
        try {
            const response = await axios.get('/api/wishlist/count', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setWishlistCount(response.data.count);
        } catch (error) {
            console.error('Gabim gjatë marrjes së numrit të artikujve në listën e dëshirave:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setCartCount(0);
        setWishlistCount(0);
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <img
                            className="h-8 w-auto"
                            src="/images/logo.png"
                            alt="Logo"
                        />
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Kërko produkte..."
                                className="w-full input pl-10"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </form>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/products"
                            className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Produktet
                        </Link>
                        <Link
                            to="/categories"
                            className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Kategoritë
                        </Link>
                        <Link
                            to="/advanced-search"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Kërkim i Avancuar
                        </Link>
                        <Link
                            to="/recommendations"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Rekomandime
                        </Link>
                        {isLoggedIn && (
                            <>
                                <Link
                                    to="/notifications"
                                    className="text-gray-600 hover:text-gray-900 relative"
                                >
                                    Njoftimet
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                        0
                                    </span>
                                </Link>
                                <Link
                                    to="/cart"
                                    className="text-gray-600 hover:text-gray-900 relative"
                                >
                                    Shporta
                                    {cartCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    to="/wishlist"
                                    className="text-gray-600 hover:text-gray-900 relative"
                                >
                                    Lista e Dëshirave
                                    {wishlistCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}
                        {user && user.role === 'admin' && (
                            <li className="relative group">
                                <button className="px-4 py-2 font-semibold text-primary-700 hover:text-primary-900 focus:outline-none">
                                    Admin Panel
                                </button>
                                <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href="/admin" className="block px-4 py-2 hover:bg-gray-100">Dashboard</a>
                                    <a href="/admin/products" className="block px-4 py-2 hover:bg-gray-100">Produktet (Admin)</a>
                                    <a href="/admin/categories" className="block px-4 py-2 hover:bg-gray-100">Kategoritë (Admin)</a>
                                </div>
                            </li>
                        )}
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-gray-700 hover:text-primary-600 relative"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </Link>
                                <Link
                                    to="/orders"
                                    className="text-gray-700 hover:text-primary-600 relative"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </Link>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex items-center text-gray-700 hover:text-primary-600"
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </button>
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Profili Im
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Porositë e Mia
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Dilni
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Identifikohu
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-primary-600"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <form onSubmit={handleSearch} className="mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Kërko produkte..."
                                        className="w-full input pl-10"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </form>
                            <Link
                                to="/products"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                            >
                                Produktet
                            </Link>
                            <Link
                                to="/categories"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                            >
                                Kategoritë
                            </Link>
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        to="/wishlist"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                    >
                                        Lista e Dëshirave
                                    </Link>
                                    <Link
                                        to="/cart"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                    >
                                        Shporta
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                    >
                                        Profili Im
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                    >
                                        Porositë e Mia
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                    >
                                        Dilni
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                >
                                    Identifikohu
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 
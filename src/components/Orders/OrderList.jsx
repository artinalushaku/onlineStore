import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const fetchOrders = async () => {
        try {
            const params = new URLSearchParams({
                page: currentPage,
                status: statusFilter !== 'all' ? statusFilter : '',
                date: dateFilter !== 'all' ? dateFilter : ''
            });

            const response = await axios.get(`/api/orders?${params}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setOrders(response.data.orders);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së porosive:', error);
            setError('Nuk mund të merren porositë. Ju lutemi provoni përsëri.');
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Në Pritje';
            case 'processing':
                return 'Në Procesim';
            case 'completed':
                return 'Përfunduar';
            case 'cancelled':
                return 'Anuluar';
            default:
                return status;
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleDateFilterChange = (e) => {
        setDateFilter(e.target.value);
        setCurrentPage(1);
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
                <button
                    onClick={fetchOrders}
                    className="text-primary hover:underline"
                >
                    Provoni Përsëri
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Porositë e Mia</h1>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filtro sipas Statusit
                    </label>
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="input w-full"
                    >
                        <option value="all">Të Gjitha</option>
                        <option value="pending">Në Pritje</option>
                        <option value="processing">Në Procesim</option>
                        <option value="completed">Përfunduar</option>
                        <option value="cancelled">Anuluar</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filtro sipas Datës
                    </label>
                    <select
                        value={dateFilter}
                        onChange={handleDateFilterChange}
                        className="input w-full"
                    >
                        <option value="all">Të Gjitha</option>
                        <option value="today">Sot</option>
                        <option value="week">Këtë Javë</option>
                        <option value="month">Këtë Muaj</option>
                        <option value="year">Këtë Vit</option>
                    </select>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Nuk keni asnjë porosi.</p>
                    <Link to="/products" className="text-primary hover:underline mt-4 inline-block">
                        Shiko Produktet
                    </Link>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">ID e Porosisë</th>
                                    <th className="py-2 px-4 border-b">Data</th>
                                    <th className="py-2 px-4 border-b">Totali</th>
                                    <th className="py-2 px-4 border-b">Statusi</th>
                                    <th className="py-2 px-4 border-b">Veprime</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td className="py-2 px-4 border-b">#{order.id}</td>
                                        <td className="py-2 px-4 border-b">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 border-b">{order.total.toFixed(2)}€</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="text-primary hover:underline"
                                            >
                                                Shiko Detajet
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded border disabled:opacity-50"
                                >
                                    Para
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded border ${
                                            currentPage === page ? 'bg-primary text-white' : ''
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded border disabled:opacity-50"
                                >
                                    Pas
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default OrderList; 
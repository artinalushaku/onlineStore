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

    const fetchOrders = async () => {
        try {
            const params = new URLSearchParams({
                page: currentPage,
                status: statusFilter !== 'all' ? statusFilter : '',
                date: dateFilter !== 'all' ? dateFilter : ''
            });

            const response = await axios.get(`/api/orders/me?${params}`, {
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

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line
    }, [currentPage, statusFilter, dateFilter]);

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
        <div className="max-w-5xl mx-auto mt-10 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight">Porositë e Mia</h1>
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
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-xl overflow-hidden shadow-xl">
                        <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                            <tr>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">#</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">Data</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">Totali</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">Statusi</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">Veprime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-blue-50 transition border-b border-gray-100">
                                    <td className="py-3 px-6 font-mono text-lg text-blue-700">#{order.id}</td>
                                    <td className="py-3 px-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-6 font-bold text-green-600">{Number(order.totalAmount ?? order.total).toFixed(2)}€</td>
                                    <td className="py-3 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                                            ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 animate-pulse' :
                                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                              'bg-gray-100 text-gray-800'}`}>
                                            {order.status === 'pending' && <span className="mr-1">⏳</span>}
                                            {order.status === 'completed' && <span className="mr-1">✅</span>}
                                            {order.status === 'cancelled' && <span className="mr-1">❌</span>}
                                            {getStatusText(order.status)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6">
                                        <Link
                                            to={`/orders/${order.id}`}
                                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
                                            title="Shiko Detajet"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25m0 0A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m7.5 0v10.5A2.25 2.25 0 0113.5 21h-3a2.25 2.25 0 01-2.25-2.25V9m7.5 0H6.75" />
                                            </svg>
                                            Shiko
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border bg-white shadow disabled:opacity-50"
                        >
                            &larr;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-lg border shadow font-semibold transition-all duration-150
                                    ${currentPage === page ? 'bg-blue-600 text-white scale-110' : 'bg-white text-blue-700 hover:bg-blue-100'}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg border bg-white shadow disabled:opacity-50"
                        >
                            &rarr;
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default OrderList; 
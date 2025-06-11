import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await axios.get('/api/admin/payments', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPayments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së pagesave:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (paymentId, status) => {
        try {
            await axios.put(`/api/admin/payments/${paymentId}/status`, {
                status
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchPayments();
        } catch (error) {
            console.error('Gabim gjatë ndryshimit të statusit:', error);
        }
    };

    const handleViewDetails = (payment) => {
        setSelectedPayment(payment);
    };

    const handleCloseDetails = () => {
        setSelectedPayment(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Menaxhimi i Pagesave</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID e Pagesës
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Përdoruesi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shuma
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Metoda
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statusi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Veprime
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map(payment => (
                            <tr key={payment._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {payment._id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {payment.user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {payment.amount}€
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {payment.method}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={payment.status}
                                        onChange={(e) => handleStatusChange(payment._id, e.target.value)}
                                        className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                    >
                                        <option value="pending">Në Pritje</option>
                                        <option value="completed">Përfunduar</option>
                                        <option value="failed">Dështuar</option>
                                        <option value="refunded">Rikthyer</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(payment.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleViewDetails(payment)}
                                        className="text-primary-600 hover:text-primary-900"
                                    >
                                        Shiko Detajet
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedPayment && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Detajet e Pagesës
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <div className="mb-4">
                                    <h4 className="font-medium">ID e Pagesës:</h4>
                                    <p className="text-sm text-gray-600">{selectedPayment._id}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Përdoruesi:</h4>
                                    <p className="text-sm text-gray-600">{selectedPayment.user.name}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Shuma:</h4>
                                    <p className="text-sm text-gray-600">{selectedPayment.amount}€</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Metoda e Pagesës:</h4>
                                    <p className="text-sm text-gray-600">{selectedPayment.method}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Statusi:</h4>
                                    <p className="text-sm text-gray-600">{selectedPayment.status}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Data e Pagesës:</h4>
                                    <p className="text-sm text-gray-600">
                                        {new Date(selectedPayment.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {selectedPayment.transactionId && (
                                    <div className="mb-4">
                                        <h4 className="font-medium">ID e Transaksionit:</h4>
                                        <p className="text-sm text-gray-600">{selectedPayment.transactionId}</p>
                                    </div>
                                )}
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleCloseDetails}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Mbyll
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentManagement;
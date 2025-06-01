import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Statistics = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalProducts: 0,
        ordersByMonth: [],
        productsByCategory: [],
        revenueByMonth: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await axios.get('/api/admin/statistics', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së statistikave:', error);
            setLoading(false);
        }
    };

    const ordersChartData = {
        labels: stats.ordersByMonth.map(item => item.month),
        datasets: [
            {
                label: 'Porositë',
                data: stats.ordersByMonth.map(item => item.count),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
            }
        ]
    };

    const revenueChartData = {
        labels: stats.revenueByMonth.map(item => item.month),
        datasets: [
            {
                label: 'Të Ardhurat (€)',
                data: stats.revenueByMonth.map(item => item.amount),
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1
            }
        ]
    };

    const productsChartData = {
        labels: stats.productsByCategory.map(item => item.category),
        datasets: [
            {
                data: stats.productsByCategory.map(item => item.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            }
        ]
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
            <h1 className="text-3xl font-bold mb-8">Statistikat</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Totali i Porosive</h3>
                    <p className="text-3xl font-bold text-primary-600">{stats.totalOrders}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Të Ardhurat Totale</h3>
                    <p className="text-3xl font-bold text-primary-600">{stats.totalRevenue}€</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Totali i Përdoruesve</h3>
                    <p className="text-3xl font-bold text-primary-600">{stats.totalUsers}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Totali i Produkteve</h3>
                    <p className="text-3xl font-bold text-primary-600">{stats.totalProducts}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Porositë sipas Muajve</h3>
                    <Bar
                        data={ordersChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top'
                                }
                            }
                        }}
                    />
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Të Ardhurat sipas Muajve</h3>
                    <Bar
                        data={revenueChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top'
                                }
                            }
                        }}
                    />
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Produktet sipas Kategorive</h3>
                    <Pie
                        data={productsChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top'
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Statistics; 
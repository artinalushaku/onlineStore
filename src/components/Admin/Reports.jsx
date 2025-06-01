import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const Reports = () => {
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState('sales');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [format, setFormat] = useState('pdf');
    const [reportData, setReportData] = useState(null);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generateReport = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/reports/generate', {
                type: reportType,
                dateRange,
                format
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                responseType: 'blob'
            });

            const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`;
            saveAs(response.data, filename);
        } catch (error) {
            console.error('Gabim gjatë gjenerimit të raportit:', error);
        } finally {
            setLoading(false);
        }
    };

    const getReportData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/reports/${reportType}`, {
                params: dateRange,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setReportData(response.data);
        } catch (error) {
            console.error('Gabim gjatë marrjes së të dhënave:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Raportet</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lloji i Raportit
                        </label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="input w-full"
                        >
                            <option value="sales">Shitjet</option>
                            <option value="products">Produktet</option>
                            <option value="customers">Klientët</option>
                            <option value="inventory">Inventari</option>
                            <option value="revenue">Të Ardhurat</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Formati
                        </label>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="input w-full"
                        >
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data Fillestare
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateChange}
                            className="input w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data Përfundimtare
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateChange}
                            className="input w-full"
                        />
                    </div>
                </div>

                <div className="mt-6 flex space-x-4">
                    <button
                        onClick={getReportData}
                        disabled={loading}
                        className="bg-primary text-white py-2 px-6 rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Po Ngarkohet...' : 'Shiko Të Dhënat'}
                    </button>

                    <button
                        onClick={generateReport}
                        disabled={loading}
                        className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Po Gjenerohet...' : 'Gjenero Raportin'}
                    </button>
                </div>
            </div>

            {reportData && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {reportType === 'sales' && 'Raporti i Shitjeve'}
                        {reportType === 'products' && 'Raporti i Produkteve'}
                        {reportType === 'customers' && 'Raporti i Klientëve'}
                        {reportType === 'inventory' && 'Raporti i Inventarit'}
                        {reportType === 'revenue' && 'Raporti i Të Ardhurave'}
                    </h2>

                    {reportType === 'sales' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Numri i Porosisë
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Klienti
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Totali
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statusi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.map((sale) => (
                                        <tr key={sale.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(sale.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                #{sale.orderNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {sale.customerName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {sale.total}€
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {sale.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {reportType === 'products' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reportData.map((product) => (
                                <div
                                    key={product.id}
                                    className="border rounded-lg p-4"
                                >
                                    <h3 className="font-semibold mb-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Kategoria: {product.category}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Në Stok: {product.stock}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Shitjet: {product.sales}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Të Ardhurat: {product.revenue}€
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {reportType === 'customers' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Emri
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Porositë
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Totali i Shpenzuar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data e Regjistrimit
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.map((customer) => (
                                        <tr key={customer.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {customer.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {customer.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {customer.orders}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {customer.totalSpent}€
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(customer.registrationDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {reportType === 'inventory' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Produkti
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kategoria
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Në Stok
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Çmimi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statusi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.category}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.stock}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.price}€
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    item.stock > 10 ? 'bg-green-100 text-green-800' :
                                                    item.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.stock > 10 ? 'Në Stok' :
                                                     item.stock > 0 ? 'Pak Në Stok' :
                                                     'Jashtë Stokut'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {reportType === 'revenue' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Të Ardhurat sipas Kategorive
                                </h3>
                                <div className="space-y-4">
                                    {reportData.categories.map((category) => (
                                        <div key={category.name}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium">
                                                    {category.name}
                                                </span>
                                                <span className="text-sm">
                                                    {category.revenue}€
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{ width: `${(category.revenue / reportData.totalRevenue) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Të Ardhurat sipas Muajve
                                </h3>
                                <div className="space-y-4">
                                    {reportData.monthly.map((month) => (
                                        <div key={month.month}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium">
                                                    {month.month}
                                                </span>
                                                <span className="text-sm">
                                                    {month.revenue}€
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{ width: `${(month.revenue / reportData.totalRevenue) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reports; 
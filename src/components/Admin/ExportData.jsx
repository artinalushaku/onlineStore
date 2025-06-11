import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ExportData = () => {
    const [loading, setLoading] = useState(false);
    const [dataType, setDataType] = useState('products');
    const [format, setFormat] = useState('pdf');

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/admin/${dataType}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            exportToPDF(response.data);
        } catch (error) {
            console.error('Gabim gjatë eksportimit të të dhënave:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = (data) => {
        const doc = new jsPDF();
        const tableColumn = Object.keys(data[0]);
        const tableRows = data.map(item => Object.values(item));

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold',
            },
        });

        doc.save(`${dataType}_export.pdf`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Eksporto të Dhëna</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zgjidh Llojin e të Dhënave
                        </label>
                        <select
                            value={dataType}
                            onChange={(e) => setDataType(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                            <option value="products">Produktet</option>
                            <option value="orders">Porositë</option>
                            <option value="users">Përdoruesit</option>
                            <option value="categories">Kategoritë</option>
                            <option value="payments">Pagesat</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleExport}
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        {loading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        Eksporto të Dhënat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportData;  
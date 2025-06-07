import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from '../../config/axios';

const ShippingManagement = () => {
    const [shippingMethods, setShippingMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMethod, setEditingMethod] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        estimatedDelivery: '',
        description: '',
        countries: [],
        isActive: true,
        isDefault: false
    });
    const [selectedCountries, setSelectedCountries] = useState([]);

    useEffect(() => {
        fetchShippingMethods();
    }, []);

    const fetchShippingMethods = async () => {
        try {
            const response = await axios.get('/api/shipping');
            setShippingMethods(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së metodave të transportit:', error);
            toast.error('Gabim gjatë marrjes së metodave të transportit');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditClick = (method) => {
        setEditingMethod(method);
        setFormData({
            name: method.name,
            price: method.price,
            estimatedDelivery: method.estimatedDelivery,
            description: method.description || '',
            countries: method.countries || [],
            isActive: method.isActive,
            isDefault: method.isDefault
        });
        setSelectedCountries(method.countries || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const methodData = {
                ...formData,
                countries: selectedCountries
            };

            if (editingMethod) {
                await axios.put(`/api/shipping/${editingMethod.id}`, methodData);
                toast.success('Metoda e transportit u përditësua me sukses');
            } else {
                await axios.post('/api/shipping', methodData);
                toast.success('Metoda e re e transportit u shtua me sukses');
            }
            fetchShippingMethods();
            resetForm();
        } catch (error) {
            console.error('Gabim gjatë ruajtjes së metodës së transportit:', error);
            toast.error(error.response?.data?.message || 'Gabim gjatë ruajtjes së metodës së transportit');
        }
    };

    const handleDelete = async (shippingId) => {
        if (window.confirm('A jeni të sigurt që dëshironi ta fshini këtë metodë transporti?')) {
            try {
                await axios.delete(`/api/shipping/${shippingId}`);
                toast.success('Metoda e transportit u fshi me sukses');
                fetchShippingMethods();
            } catch (error) {
                console.error('Gabim gjatë fshirjes së metodës së transportit:', error);
                toast.error(error.response?.data?.message || 'Gabim gjatë fshirjes së metodës së transportit');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            estimatedDelivery: '',
            description: '',
            countries: [],
            isActive: true,
            isDefault: false
        });
        setSelectedCountries([]);
        setEditingMethod(null);
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
            <h1 className="text-3xl font-bold mb-8">Menaxhimi i Transportit</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingMethod ? 'Edito Metodën e Transportit' : 'Shto Metodë të Re Transporti'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Emri i Metodës
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Çmimi (€)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Koha e Vlerësuar e Dërgesës
                            </label>
                            <input
                                type="text"
                                name="estimatedDelivery"
                                value={formData.estimatedDelivery}
                                onChange={handleInputChange}
                                required
                                placeholder="p.sh. 2-3 ditë"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Përshkrimi
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                                rows="3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vendet e Disponueshme
                            </label>
                            <select
                                name="countries"
                                value={selectedCountries[0] || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedCountries(value ? [value] : []);
                                    setFormData(prev => ({
                                        ...prev,
                                        countries: value ? [value] : []
                                    }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                                <option value="">Zgjidhni vendin</option>
                                <option value="Kosova">Kosova</option>
                                <option value="Shqiperia">Shqiperia</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Aktive</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Metodë e Parazgjedhur</span>
                            </label>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                {editingMethod ? 'Ruaj Ndryshimet' : 'Shto Metodën'}
                            </button>
                            {editingMethod && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                >
                                    Anulo
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Lista e Metodave të Transportit</h2>
                    <div className="space-y-4">
                        {shippingMethods.map(method => (
                            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-medium">{method.name}</h3>
                                        {method.isDefault && (
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                Parazgjedhur
                                            </span>
                                        )}
                                        {!method.isActive && (
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                                Jo Aktive
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm text-gray-600">
                                            Çmimi: {method.price}€
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Koha e Vlerësuar: {method.estimatedDelivery}
                                        </p>
                                        <div className="text-sm text-gray-600">
                                            <span>Vendet: </span>
                                            {method.countries && Array.isArray(method.countries) && method.countries.length > 0 ? (
                                                method.countries.length > 3 ? (
                                                    <span>{method.countries.slice(0, 3).join(', ')} +{method.countries.length - 3} të tjera</span>
                                                ) : (
                                                    <span>{method.countries.join(', ')}</span>
                                                )
                                            ) : (
                                                <span>Të gjitha vendet</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => handleEditClick(method)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edito
                                    </button>
                                    <button
                                        onClick={() => handleDelete(method.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Fshi
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingManagement;
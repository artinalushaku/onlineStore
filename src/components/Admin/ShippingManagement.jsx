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
    const [showCountrySelector, setShowCountrySelector] = useState(false);
    const [newCountry, setNewCountry] = useState('');
    const [countryList, setCountryList] = useState([]);

    useEffect(() => {
        fetchCountries();
        fetchShippingMethods();
    }, []);

    const fetchCountries = async () => {
        try {
            const res = await axios.get('/api/countries');
            setCountryList(res.data.map(c => c.name));
        } catch (error) {
            toast.error('Gabim gjatë marrjes së vendeve');
        }
    };

    const handleAddCountry = async () => {
        if (!newCountry.trim() || countryList.includes(newCountry.trim())) return;
        try {
            await axios.post('/api/countries', { name: newCountry.trim() });
            setNewCountry('');
            fetchCountries();
        } catch (error) {
            toast.error('Gabim gjatë shtimit të vendit');
        }
    };

    const handleDeleteCountry = async (countryName) => {
        try {
            // Find country by name to get its id
            const res = await axios.get('/api/countries');
            const country = res.data.find(c => c.name === countryName);
            if (country) {
                await axios.delete(`/api/countries/${country.id}`);
                fetchCountries();
            }
        } catch (error) {
            toast.error('Gabim gjatë fshirjes së vendit');
        }
    };

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

    const handleCountrySelect = (country) => {
        if (selectedCountries.includes(country)) {
            setSelectedCountries(prev => prev.filter(c => c !== country));
        } else {
            setSelectedCountries(prev => [...prev, country]);
        }
    };

    const toggleCountrySelector = () => {
        setShowCountrySelector(!showCountrySelector);
    };

    const applySelectedCountries = () => {
        setFormData(prev => ({
            ...prev,
            countries: selectedCountries
        }));
        setShowCountrySelector(false);
    };

    const selectAllCountries = () => {
        setSelectedCountries(countryList);
    };

    const clearCountrySelection = () => {
        setSelectedCountries([]);
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
        setShowCountrySelector(false);
        setNewCountry('');
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
                            <div>
                                <div 
                                    onClick={toggleCountrySelector}
                                    className="flex justify-between items-center w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                                >
                                    <span>
                                        {selectedCountries.length === 0 ? 'Të gjitha vendet' : 
                                         selectedCountries.length === 1 ? selectedCountries[0] : 
                                         `${selectedCountries.length} vende të zgjedhura`}
                                    </span>
                                    <span>{showCountrySelector ? '▲' : '▼'}</span>
                                </div>
                                {showCountrySelector && (
                                    <div className="mt-2 border border-gray-300 rounded-md p-3">
                                        <div className="flex justify-between mb-2">
                                            <button 
                                                type="button" 
                                                onClick={selectAllCountries}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Zgjidh të gjitha
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={clearCountrySelection}
                                                className="text-sm text-red-500 hover:underline"
                                            >
                                                Pastro
                                            </button>
                                        </div>
                                        <div className="max-h-48 overflow-y-auto">
                                            {countryList.map(country => (
                                                <div key={country} className="flex items-center my-1">
                                                    <input
                                                        type="checkbox"
                                                        id={`country-${country}`}
                                                        checked={selectedCountries.includes(country)}
                                                        onChange={() => handleCountrySelect(country)}
                                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                    />
                                                    <label htmlFor={`country-${country}`} className="ml-2 text-sm text-gray-700 flex-1">
                                                        {country}
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteCountry(country)}
                                                        className="ml-2 text-xs text-red-500 hover:text-red-700"
                                                        title="Delete country"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <input
                                                type="text"
                                                value={newCountry}
                                                onChange={e => setNewCountry(e.target.value)}
                                                placeholder="Add new country"
                                                className="border px-2 py-1 rounded mr-2"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddCountry}
                                                className="bg-blue-600 text-white px-3 py-1 rounded"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={applySelectedCountries}
                                            className="mt-2 bg-primary-600 text-white text-sm py-1 px-3 rounded-md hover:bg-primary-700"
                                        >
                                            Apliko
                                        </button>
                                    </div>
                                )}
                                <p className="text-sm text-gray-500 mt-1">
                                    Lëreni bosh për të lejuar të gjitha vendet
                                </p>
                            </div>
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
                                            {method.countries && method.countries.length > 0 ? (
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
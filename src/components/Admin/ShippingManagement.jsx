import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from '../../config/axios';

const ShippingManagement = () => {
    const [shippingMethods, setShippingMethods] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMethod, setEditingMethod] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        estimatedDelivery: '',
        description: '',
        isActive: true,
        isDefault: false,
        countries: []
    });
    const [newCountry, setNewCountry] = useState('');

    useEffect(() => {
        fetchShippingMethods();
        fetchCountries();
    }, []);

    const fetchShippingMethods = async () => {
        try {
            const response = await axios.get('/api/shipping');
            setShippingMethods(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching shipping methods:', error);
            toast.error('Error fetching shipping methods');
            setLoading(false);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await axios.get('/api/countries');
            setCountries(response.data);
        } catch (error) {
            console.error('Error fetching countries:', error);
            toast.error('Error fetching countries');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCountryChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            countries: checked 
                ? [...prev.countries, value]
                : prev.countries.filter(country => country !== value)
        }));
    };

    const handleEditClick = (method) => {
        setEditingMethod(method);
        setFormData({
            name: method.name,
            price: method.price,
            estimatedDelivery: method.estimatedDelivery,
            description: method.description || '',
            isActive: method.isActive,
            isDefault: method.isDefault,
            countries: method.countries || []
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMethod) {
                await axios.put(`/api/shipping/${editingMethod.id}`, formData);
                toast.success('Shipping method updated successfully');
            } else {
                await axios.post('/api/shipping', formData);
                toast.success('New shipping method added successfully');
            }
            fetchShippingMethods();
            resetForm();
        } catch (error) {
            console.error('Error saving shipping method:', error);
            toast.error(error.response?.data?.message || 'Error saving shipping method');
        }
    };

    const handleDelete = async (shippingId) => {
        if (window.confirm('Are you sure you want to delete this shipping method?')) {
            try {
                await axios.delete(`/api/shipping/${shippingId}`);
                toast.success('Shipping method deleted successfully');
                fetchShippingMethods();
            } catch (error) {
                console.error('Error deleting shipping method:', error);
                toast.error(error.response?.data?.message || 'Error deleting shipping method');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            estimatedDelivery: '',
            description: '',
            isActive: true,
            isDefault: false,
            countries: []
        });
        setEditingMethod(null);
    };

    const handleAddCountry = async (e) => {
        e.preventDefault();
        if (!newCountry.trim()) return;
        try {
            await axios.post('/api/countries', { name: newCountry.trim() });
            toast.success('Country added successfully');
            setNewCountry('');
            fetchCountries();
        } catch (err) {
            toast.error('Could not add country');
        }
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
            <h1 className="text-3xl font-bold mb-8">Shipping Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingMethod ? 'Edit Shipping Method' : 'Add New Shipping Method'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Method Name
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
                                Price (€)
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
                                Estimated Delivery Time
                            </label>
                            <input
                                type="text"
                                name="estimatedDelivery"
                                value={formData.estimatedDelivery}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., 2-3 days"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Countries
                            </label>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                                {countries.map(country => (
                                    <label key={country.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={country.name}
                                            checked={formData.countries.includes(country.name)}
                                            onChange={handleCountryChange}
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">{country.name}</span>
                                    </label>
                                ))}
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
                                <span className="ml-2 text-sm text-gray-700">Active</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Default Method</span>
                            </label>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                {editingMethod ? 'Save Changes' : 'Add Method'}
                            </button>
                            {editingMethod && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Shipping Methods List</h2>
                    <div className="space-y-4">
                        {shippingMethods.map(method => (
                            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-medium">{method.name}</h3>
                                        {method.isDefault && (
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                Default
                                            </span>
                                        )}
                                        {!method.isActive && (
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm text-gray-600">
                                            Price: {method.price}€
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Estimated Delivery: {method.estimatedDelivery}
                                        </p>
                                        <div className="text-sm text-gray-600">
                                            <span>Available in: </span>
                                            {method.countries?.length > 0 
                                                ? method.countries.join(', ')
                                                : 'All countries'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditClick(method)}
                                        className="p-2 text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(method.id)}
                                        className="p-2 text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Add New Country</h2>
                <div className="mb-4">
                    <form onSubmit={handleAddCountry} className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={newCountry}
                            onChange={e => setNewCountry(e.target.value)}
                            placeholder="Add new country"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Add Country
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShippingManagement;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressList = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Kosovo',
        isDefault: false
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get('/api/users/addresses', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setAddresses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së adresave:', error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                await axios.put(
                    `/api/users/addresses/${editingAddress._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                setMessage({
                    type: 'success',
                    text: 'Adresa u përditësua me sukses'
                });
            } else {
                await axios.post('/api/users/addresses', formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setMessage({
                    type: 'success',
                    text: 'Adresa u shtua me sukses'
                });
            }
            setShowForm(false);
            setEditingAddress(null);
            setFormData({
                firstName: '',
                lastName: '',
                address: '',
                city: '',
                postalCode: '',
                country: 'Kosovo',
                isDefault: false
            });
            fetchAddresses();
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Gabim gjatë ruajtjes së adresës'
            });
        }
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setFormData({
            firstName: address.firstName,
            lastName: address.lastName,
            address: address.address,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country,
            isDefault: address.isDefault
        });
        setShowForm(true);
    };

    const handleDelete = async (addressId) => {
        if (window.confirm('A jeni të sigurt që dëshironi ta fshini këtë adresë?')) {
            try {
                await axios.delete(`/api/users/addresses/${addressId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setMessage({
                    type: 'success',
                    text: 'Adresa u fshi me sukses'
                });
                fetchAddresses();
            } catch (error) {
                setMessage({
                    type: 'error',
                    text: 'Gabim gjatë fshirjes së adresës'
                });
            }
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await axios.put(
                `/api/users/addresses/${addressId}/default`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setMessage({
                type: 'success',
                text: 'Adresa u bë kryesore me sukses'
            });
            fetchAddresses();
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Gabim gjatë ndryshimit të adresës kryesore'
            });
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
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Adresat e Mia</h1>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditingAddress(null);
                            setFormData({
                                firstName: '',
                                lastName: '',
                                address: '',
                                city: '',
                                postalCode: '',
                                country: 'Kosovo',
                                isDefault: false
                            });
                        }}
                        className="btn btn-primary"
                    >
                        Shto Adresë të Re
                    </button>
                </div>

                {message.text && (
                    <div
                        className={`p-4 rounded-lg mb-6 ${
                            message.type === 'success'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-6">
                            {editingAddress ? 'Ndrysho Adresën' : 'Shto Adresë të Re'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Emri
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mbiemri
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Adresa
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    className="input"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Qyteti
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kodi Postar
                                    </label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        required
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isDefault"
                                        checked={formData.isDefault}
                                        onChange={handleInputChange}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Bëje adresën kryesore
                                    </span>
                                </label>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingAddress(null);
                                    }}
                                    className="btn btn-secondary"
                                >
                                    Anulo
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingAddress ? 'Ruaj Ndryshimet' : 'Shto Adresën'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map(address => (
                        <div
                            key={address._id}
                            className="bg-white rounded-lg shadow-md p-6"
                        >
                            {address.isDefault && (
                                <div className="mb-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                                        Adresa Kryesore
                                    </span>
                                </div>
                            )}
                            <div className="mb-4">
                                <p className="text-gray-900">
                                    {address.firstName} {address.lastName}
                                </p>
                                <p className="text-gray-600">{address.address}</p>
                                <p className="text-gray-600">
                                    {address.city}, {address.postalCode}
                                </p>
                                <p className="text-gray-600">{address.country}</p>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => handleEdit(address)}
                                    className="text-primary-600 hover:text-primary-800"
                                >
                                    Ndrysho
                                </button>
                                <button
                                    onClick={() => handleDelete(address._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Fshi
                                </button>
                                {!address.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(address._id)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        Bëje Kryesore
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddressList; 
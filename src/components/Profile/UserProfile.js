import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile = () => {
    const { user: authUser, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFormData(prev => ({
                ...prev,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                phone: response.data.phone || '',
                address: response.data.address || ''
            }));
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së profilit:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                '/api/auth/profile',
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    address: formData.address
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setMessage({
                type: 'success',
                text: 'Profili u përditësua me sukses'
            });
            fetchUserProfile();
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Gabim gjatë përditësimit të profilit'
            });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({
                type: 'error',
                text: 'Fjalëkalimet e reja nuk përputhen'
            });
            return;
        }

        try {
            await axios.put(
                '/api/users/change-password',
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setMessage({
                type: 'success',
                text: 'Fjalëkalimi u ndryshua me sukses'
            });
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Gabim gjatë ndryshimit të fjalëkalimit'
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
                <h1 className="text-3xl font-bold mb-8">Profili Im</h1>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">
                                Informacionet Personale
                            </h2>
                            <form onSubmit={handleProfileUpdate}>
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
                                            disabled={!editMode}
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
                                            disabled={!editMode}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="input bg-gray-50"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefon
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="input"
                                        disabled={!editMode}
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Adresa
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="input"
                                        disabled={!editMode}
                                    />
                                </div>
                                {editMode ? (
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
                                        >
                                            Ruaj Ndryshimet
                                        </button>
                                        <button
                                            type="button"
                                            className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                                            onClick={() => { setEditMode(false); fetchUserProfile(); }}
                                        >
                                            Anulo
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                                        onClick={() => setEditMode(true)}
                                    >
                                        Ndrysho
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">
                                Ndrysho Fjalëkalimin
                            </h2>
                            <form onSubmit={handlePasswordChange}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fjalëkalimi Aktual
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        required
                                        className="input"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fjalëkalimi i Ri
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        required
                                        className="input"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Konfirmo Fjalëkalimin e Ri
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        className="input"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-full">
                                    Ndrysho Fjalëkalimin
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile; 
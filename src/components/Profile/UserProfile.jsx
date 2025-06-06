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
            const userData = response.data.user;
            setFormData(prev => ({
                ...prev,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || ''
            }));
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së profilit:', error);
            setError('Nuk mund të merren të dhënat e profilit. Ju lutemi provoni përsëri.');
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
            const response = await axios.put(
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
            
            // Update the form data with the response
            const userData = response.data.user;
            setFormData(prev => ({
                ...prev,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || ''
            }));
            
            setMessage({
                type: 'success',
                text: response.data.message || 'Profili u përditësua me sukses'
            });
            setEditMode(false);
        } catch (error) {
            console.error('Gabim gjatë përditësimit të profilit:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Gabim gjatë përditësimit të profilit'
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
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">Profili Im</h1>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-800 border-l-4 border-red-500">
                            {error}
                        </div>
                    )}

                    {message.text && (
                        <div
                            className={`p-4 ${
                                message.type === 'success'
                                    ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
                                    : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <div className="p-6">
                        <form onSubmit={handleProfileUpdate}>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
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
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                editMode 
                                                    ? 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' 
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}
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
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                editMode 
                                                    ? 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' 
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}
                                            disabled={!editMode}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefon
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode 
                                                ? 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' 
                                                : 'border-gray-200 bg-gray-50'
                                        }`}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Adresa
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            editMode 
                                                ? 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' 
                                                : 'border-gray-200 bg-gray-50'
                                        }`}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    {editMode ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => { setEditMode(false); fetchUserProfile(); }}
                                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Anulo
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Ruaj Ndryshimet
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setEditMode(true)}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Ndrysho
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile; 
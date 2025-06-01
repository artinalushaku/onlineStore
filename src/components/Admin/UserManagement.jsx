import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'customer',
        isActive: true
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së përdoruesve:', error);
            setLoading(false);
        }
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
    };

    const handleCloseDetails = () => {
        setSelectedUser(null);
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('A jeni të sigurt që dëshironi ta fshini këtë përdorues?')) {
            axios.delete(`/api/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(() => fetchUsers())
            .catch(err => alert('Gabim gjatë fshirjes së përdoruesit!'));
        }
    };

    // Open edit modal and prefill form
    const handleEditUser = (user) => {
        setEditUser(user);
        setEditForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            role: user.role || 'customer',
            isActive: user.isActive
        });
    };

    // Handle form changes
    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Save changes
    const handleSaveEdit = async () => {
        if (!editUser) return;
        setSaving(true);
        try {
            // Update user fields
            await axios.put(`/api/admin/users/${editUser.id}/role`, { role: editForm.role }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            await axios.put(`/api/admin/users/${editUser.id}/status`, { isActive: editForm.isActive }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Optionally, add endpoint for firstName, lastName, email if you want to allow editing those too
            // await axios.put(`/api/admin/users/${editUser.id}`, { firstName, lastName, email }, ...)
            setEditUser(null);
            setSaving(false);
            fetchUsers();
        } catch (error) {
            alert('Gabim gjatë ruajtjes së ndryshimeve!');
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditUser(null);
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
            <h1 className="text-3xl font-bold mb-8">Menaxhimi i Përdoruesve</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Emri
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mbiemri
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Roli
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statusi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Veprime
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.firstName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.role === 'admin' ? 'Administrator' : 'Përdorues'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.isActive ? 'Aktiv' : 'Jo Aktiv'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                    <button
                                        onClick={() => handleViewDetails(user)}
                                        className="text-primary-600 hover:text-primary-900"
                                    >
                                        Shiko Detajet
                                    </button>
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edito
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Fshi
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit User Modal */}
            {editUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Edito Përdoruesin
                            </h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Emri</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={editForm.firstName}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mbiemri</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={editForm.lastName}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Roli</label>
                                    <select
                                        name="role"
                                        value={editForm.role}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    >
                                        <option value="customer">Përdorues</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Statusi</label>
                                    <select
                                        name="isActive"
                                        value={editForm.isActive ? 'true' : 'false'}
                                        onChange={e => setEditForm(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                                        className="w-full px-3 py-2 border rounded-md"
                                    >
                                        <option value="true">Aktiv</option>
                                        <option value="false">Jo Aktiv</option>
                                    </select>
                                </div>
                            </form>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                    disabled={saving}
                                >
                                    Anulo
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    disabled={saving}
                                >
                                    {saving ? 'Duke ruajtur...' : 'Ruaj Ndryshimet'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal (unchanged) */}
            {selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Detajet e Përdoruesit
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <div className="mb-4">
                                    <h4 className="font-medium">Emri:</h4>
                                    <p className="text-sm text-gray-600">{selectedUser.firstName}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Mbiemri:</h4>
                                    <p className="text-sm text-gray-600">{selectedUser.lastName}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Email:</h4>
                                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Roli:</h4>
                                    <p className="text-sm text-gray-600">{selectedUser.role}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Statusi:</h4>
                                    <p className="text-sm text-gray-600">{selectedUser.isActive ? 'Aktiv' : 'Jo Aktiv'}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Data e Regjistrimit:</h4>
                                    <p className="text-sm text-gray-600">
                                        {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : ''}
                                    </p>
                                </div>
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

export default UserManagement; 
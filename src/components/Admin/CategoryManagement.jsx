import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent_id: '',
        isActive: true,
        image: null
    });
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories/flat', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Gabim gjatë marrjes së kategorive');
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

    const handleImageChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('isActive', formData.isActive);
            if (formData.parent_id) data.append('parent_id', formData.parent_id);
            if (formData.image) data.append('image', formData.image);

            if (editingCategory) {
                await axios.put(`/api/categories/${editingCategory.id}`, data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success('Kategoria u përditësua me sukses');
            } else {
                await axios.post('/api/categories', data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success('Kategoria u shtua me sukses');
            }
            fetchCategories();
            setFormData({ name: '', description: '', parent_id: '', isActive: true, image: null });
            setEditingCategory(null);
        } catch (error) {
            toast.error('Gabim gjatë shtimit/përditësimit të kategorisë');
        }
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            parent_id: category.parent_id || '',
            isActive: category.isActive,
            image: null
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni të sigurt që dëshironi ta fshini këtë kategori?')) {
            try {
                await axios.delete(`/api/categories/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Kategoria u fshi me sukses');
                fetchCategories();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Gabim gjatë fshirjes së kategorisë');
            }
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
            <h1 className="text-3xl font-bold mb-8">Menaxhimi i Kategorive</h1>
            <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Emri i kategorisë"
                    required
                    className="border px-2 py-1 rounded"
                />
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Përshkrimi (opsional)"
                    className="border px-2 py-1 rounded"
                />
                <select
                    name="parent_id"
                    value={formData.parent_id}
                    onChange={handleInputChange}
                    className="border px-2 py-1 rounded"
                >
                    <option value="">Pa kategori prind</option>
                    {categories.filter(cat => !editingCategory || cat.id !== editingCategory.id).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border px-2 py-1 rounded"
                />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                    />
                    Aktive
                </label>
                <div className="flex gap-2">
                    <button type="submit" className="bg-primary-600 text-white px-4 py-1 rounded">
                        {editingCategory ? 'Ruaj Ndryshimet' : 'Shto Kategori'}
                    </button>
                    {editingCategory && (
                        <button type="button" onClick={() => { setEditingCategory(null); setFormData({ name: '', description: '', parent_id: '', isActive: true, image: null }); }} className="bg-gray-300 px-4 py-1 rounded">
                            Anulo Editimin
                        </button>
                    )}
                </div>
            </form>
            <ul className="space-y-2">
                {categories.map(category => (
                    <li key={category.id} className="flex items-center justify-between border p-2 rounded">
                        <div>
                            <span className="font-semibold">{category.name}</span>
                            {category.description && <span className="ml-2 text-gray-500">- {category.description}</span>}
                            {category.parent_id && (
                                <span className="ml-2 text-blue-500">
                                    (Prind: {categories.find(c => c.id === category.parent_id)?.name || '—'})
                                </span>
                            )}
                            {!category.isActive && <span className="ml-2 text-red-500">(Jo aktive)</span>}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEditClick(category)} className="text-blue-600 hover:text-blue-800">Edito</button>
                            <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800">Fshi</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryManagement; 
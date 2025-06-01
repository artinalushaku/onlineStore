import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        images: []
    });
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/admin/products', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së produkteve:', error);
            toast.error('Gabim gjatë marrjes së produkteve');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/admin/categories', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Gabim gjatë marrjes së kategorive:', error);
            toast.error('Gabim gjatë marrjes së kategorive');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        console.log('Duke ngarkuar imazhet:', files);

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            console.log('Duke shtuar skedarin në FormData:', files[i].name);
            formData.append('images', files[i]);
        }

        try {
            console.log('Duke dërguar kërkesën për ngarkim...');
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log('Përgjigja nga serveri:', response.data);

            if (response.data.urls && response.data.urls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...response.data.urls]
                }));
                toast.success('Imazhet u ngarkuan me sukses');
            } else {
                toast.error('Nuk u ngarkua asnjë imazh');
            }
        } catch (error) {
            console.error('Gabim gjatë ngarkimit të imazheve:', error);
            console.error('Detajet e gabimit:', error.response?.data);
            toast.error(error.response?.data?.message || 'Gabim gjatë ngarkimit të imazheve');
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId,
            images: product.images || []
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const selectedCategory = categories.find(cat => cat.id === parseInt(formData.categoryId));
            const categoryName = selectedCategory ? selectedCategory.name : '';
            const randomSku = editingProduct ? editingProduct.sku : 'SKU-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            const data = {
                ...formData,
                sku: randomSku,
                category: categoryName
            };
            if (editingProduct) {
                await axios.put(`/api/admin/products/${editingProduct.id}`, data, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Produkti u përditësua me sukses');
            } else {
                await axios.post('/api/admin/products', data, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Produkti u shtua me sukses');
            }
            fetchProducts();
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                categoryId: '',
                images: []
            });
            setEditingProduct(null);
        } catch (error) {
            console.error('Gabim gjatë shtimit/përditësimit të produktit:', error);
            toast.error('Gabim gjatë shtimit/përditësimit të produktit');
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('A jeni të sigurt që dëshironi ta fshini këtë produkt?')) {
            try {
                await axios.delete(`/api/admin/products/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                toast.success('Produkti u fshi me sukses');
                fetchProducts();
            } catch (error) {
                console.error('Gabim gjatë fshirjes së produktit:', error);
                toast.error('Gabim gjatë fshirjes së produktit');
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
            <h1 className="text-3xl font-bold mb-8">Menaxhimi i Produkteve</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Shto Produkt të Ri</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Emri i Produktit
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
                                Përshkrimi
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                                rows="3"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Çmimi
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stoku
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kategoria
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                                <option value="">Zgjidh Kategori</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Imazhet
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                            <div className="mt-2 grid grid-cols-4 gap-2">
                                {formData.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded"
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                            {editingProduct ? 'Ruaj Ndryshimet' : 'Shto Produktin'}
                        </button>
                        {editingProduct && (
                            <button
                                type="button"
                                onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', images: [] }); }}
                                className="w-full mt-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                            >
                                Anulo Editimin
                            </button>
                        )}
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Lista e Produkteve</h2>
                    <div className="space-y-4">
                        {products.map(product => (
                            <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    {product.images[0] && (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-medium">{product.name}</h3>
                                        <p className="text-sm text-gray-500">{product.category?.name}</p>
                                        <p className="text-sm text-gray-500">Çmimi: {product.price}€</p>
                                        <p className="text-sm text-gray-500">Stoku: {product.stock}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Fshi
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(product)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edito
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

export default ProductManagement; 
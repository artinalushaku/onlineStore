import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryDetails = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`/api/categories/${id}`);
                setCategory(res.data);
            } catch (err) {
                setCategory(null);
            }
        };
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`/api/products?categoryId=${id}`);
                setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
            } catch (err) {
                setProducts([]);
            }
            setLoading(false);
        };
        fetchCategory();
        fetchProducts();
    }, [id]);

    if (loading) return <div className="text-center py-12">Duke u ngarkuar...</div>;
    if (!category) return <div className="text-center py-12 text-red-500">Kategoria nuk u gjet!</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
            <p className="mb-6 text-gray-600">{category.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.isArray(products) && products.length === 0 ? (
                    <div className="col-span-3 text-center text-gray-500">Nuk ka produkte në këtë kategori.</div>
                ) : (
                    Array.isArray(products) && products.map(product => (
                        <div key={product.id} className="border p-4 rounded shadow-sm bg-white">
                            <img src={product.image} alt={product.name} className="h-32 w-full object-cover mb-2 rounded" />
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-primary-600 font-bold">{product.price} €</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CategoryDetails; 
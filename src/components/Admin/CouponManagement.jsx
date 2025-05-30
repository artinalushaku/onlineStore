import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: '',
        validFrom: '',
        validUntil: '',
        minimumPurchase: '',
        maxDiscount: '',
        usageLimit: '',
        description: '',
        isActive: true
    });
    const [editingCoupon, setEditingCoupon] = useState(null);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await axios.get('/api/admin/coupons', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const allCoupons = Array.isArray(response.data.discounts) ? response.data.discounts : [];
            setCoupons(allCoupons.filter(c => c.isActive !== false));
            setLoading(false);
        } catch (error) {
            toast.error('Gabim gjatë marrjes së kuponave');
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

    const handleEditClick = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            validFrom: coupon.validFrom ? coupon.validFrom.slice(0, 10) : '',
            validUntil: coupon.validUntil ? coupon.validUntil.slice(0, 10) : '',
            minimumPurchase: coupon.minimumPurchase,
            maxDiscount: coupon.maxDiscount,
            usageLimit: coupon.usageLimit || '',
            description: coupon.description || '',
            isActive: coupon.isActive !== false
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                code: formData.code,
                type: formData.type,
                value: Number(formData.value),
                validFrom: formData.validFrom,
                validUntil: formData.validUntil,
                minimumPurchase: Number(formData.minimumPurchase),
                maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
                description: formData.description,
                isActive: formData.isActive
            };
            if (editingCoupon) {
                await axios.put(`/api/admin/coupons/${editingCoupon.id || editingCoupon._id}`, data, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Kuponi u përditësua me sukses!');
            } else {
                await axios.post('/api/admin/coupons', data, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Kuponi u shtua me sukses!');
            }
            fetchCoupons();
            setFormData({
                code: '',
                type: 'percentage',
                value: '',
                validFrom: '',
                validUntil: '',
                minimumPurchase: '',
                maxDiscount: '',
                usageLimit: '',
                description: '',
                isActive: true
            });
            setEditingCoupon(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gabim gjatë shtimit/përditësimit të kuponit');
        }
    };

    const handleDelete = async (couponId) => {
        if (window.confirm('A jeni të sigurt që dëshironi ta fshini këtë kupon?')) {
            try {
                await axios.delete(`/api/admin/coupons/${couponId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Kuponi u fshi me sukses!');
                fetchCoupons();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Gabim gjatë fshirjes së kuponit');
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
            <h1 className="text-3xl font-bold mb-8">Menaxhimi i Kuponave</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Shto Kupon të Ri</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kodi i Kuponit
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipi i Kuponit
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                                className="input"
                            >
                                <option value="percentage">Përqindje (%)</option>
                                <option value="fixed">Vlerë fikse</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vlera e Kuponit
                            </label>
                            <input
                                type="number"
                                name="value"
                                value={formData.value}
                                onChange={handleInputChange}
                                required
                                className="input"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valid Nga
                                </label>
                                <input
                                    type="date"
                                    name="validFrom"
                                    value={formData.validFrom}
                                    onChange={handleInputChange}
                                    required
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valid Deri
                                </label>
                                <input
                                    type="date"
                                    name="validUntil"
                                    value={formData.validUntil}
                                    onChange={handleInputChange}
                                    required
                                    className="input"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Blerja Minimale
                                </label>
                                <input
                                    type="number"
                                    name="minimumPurchase"
                                    value={formData.minimumPurchase}
                                    onChange={handleInputChange}
                                    required
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Zbritja Maksimale
                                </label>
                                <input
                                    type="number"
                                    name="maxDiscount"
                                    value={formData.maxDiscount}
                                    onChange={handleInputChange}
                                    required
                                    className="input"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Përdorime Maksimale (opsionale)
                            </label>
                            <input
                                type="number"
                                name="usageLimit"
                                value={formData.usageLimit}
                                onChange={handleInputChange}
                                className="input"
                                placeholder="Përdorime maksimale (opsionale)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Përshkrimi (opsional)
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="input"
                                placeholder="Përshkrimi (opsional)"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                            />
                            <label>Aktiv</label>
                        </div>

                        <button type="submit" className="btn btn-primary w-full">
                            {editingCoupon ? 'Ruaj Ndryshimet' : 'Shto Kuponin'}
                        </button>
                        {editingCoupon && (
                            <button
                                type="button"
                                className="btn btn-secondary w-full mt-2"
                                onClick={() => { setEditingCoupon(null); setFormData({ code: '', type: 'percentage', value: '', validFrom: '', validUntil: '', minimumPurchase: '', maxDiscount: '', usageLimit: '', description: '', isActive: true }); }}
                            >
                                Anulo Editimin
                            </button>
                        )}
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Lista e Kuponave</h2>
                    <div className="space-y-4">
                        {(Array.isArray(coupons) ? coupons : []).map(coupon => (
                            <div key={coupon._id || coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h3 className="font-medium">{coupon.code}</h3>
                                    <p className="text-sm text-gray-600">
                                        Tipi: {coupon.type}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Vlera: {coupon.value}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Zbritje: {coupon.discount}%
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Valid: {coupon.validFrom ? new Date(coupon.validFrom).toLocaleDateString() : ''} - {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : ''}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Blerja Minimale: {coupon.minimumPurchase}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Zbritja Maksimale: {coupon.maxDiscount}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditClick(coupon)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edito
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coupon._id || coupon.id)}
                                        className="text-red-600 hover:text-red-700"
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

export default CouponManagement; 
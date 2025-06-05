import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';

const AddressForm = ({ onSaved, onCancel, initialData = null }) => {
    const [countryList, setCountryList] = useState([]);
    const [formData, setFormData] = useState({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        address1: initialData?.address1 || '',
        address2: initialData?.address2 || '',
        city: initialData?.city || '',
        postalCode: initialData?.postalCode || '',
        country: initialData?.country || '',
        phone: initialData?.phone || '',
        isDefault: initialData?.isDefault || false,
        addressType: 'shipping'
    });
    
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showCountrySelector, setShowCountrySelector] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(initialData?.country || '');

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const res = await axios.get('/api/countries');
            setCountryList(res.data.map(c => c.name));
        } catch (error) {
            setCountryList([]);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setFormData(prev => ({
            ...prev,
            country
        }));
        setShowCountrySelector(false);
    };

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            setError('First name is required');
            return false;
        }
        if (!formData.lastName.trim()) {
            setError('Last name is required');
            return false;
        }
        if (!formData.address1.trim()) {
            setError('Address is required');
            return false;
        }
        if (!formData.city.trim()) {
            setError('City is required');
            return false;
        }
        if (!formData.postalCode.trim()) {
            setError('Postal code is required');
            return false;
        }
        if (!formData.country.trim()) {
            setError('Country is required');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setSaving(true);
        setError(null);

        try {
            let response;
            if (initialData) {
                response = await axios.put(`/api/addresses/${initialData.id}`, formData);
            } else {
                response = await axios.post('/api/addresses', formData);
            }
            
            setSaving(false);
            onSaved(response.data);
        } catch (error) {
            setSaving(false);
            setError(error.response?.data?.message || 'Error saving address');
        }
    };

    return (
        <div className="border rounded-md p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4">
                {initialData ? 'Edit Address' : 'Add New Address'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter first name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter last name"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                    </label>
                    <input
                        type="text"
                        name="address1"
                        value={formData.address1}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter street address"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, suite, etc. (optional)
                    </label>
                    <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter apartment or suite number"
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter city"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code *
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter postal code"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                    </label>
                    <div className="relative">
                        <div 
                            onClick={() => setShowCountrySelector(!showCountrySelector)}
                            className="flex justify-between items-center w-full px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <span>{selectedCountry || 'Select a country'}</span>
                            <span>{showCountrySelector ? '▲' : '▼'}</span>
                        </div>
                        
                        {showCountrySelector && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                {countryList.map(country => (
                                    <div
                                        key={country}
                                        onClick={() => handleCountrySelect(country)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {country}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter phone number"
                    />
                </div>
                
                <div className="flex items-center mt-2">
                    <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                        Set as default address
                    </label>
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className={`px-4 py-2 rounded-md text-white font-medium
                            ${saving ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'}`}
                    >
                        {saving ? 'Saving...' : 'Save Address'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressForm;
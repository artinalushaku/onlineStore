import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';

const SavedAddresses = ({ onSelectAddress, onAddNewClick }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get('/api/addresses');
            setAddresses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            setError('Could not load saved addresses');
            setLoading(false);
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await axios.put(`/api/addresses/${addressId}/default`);
            await fetchAddresses(); // Refresh the list
        } catch (error) {
            console.error('Error setting default address:', error);
            setError('Could not set default address');
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) {
            return;
        }

        try {
            await axios.delete(`/api/addresses/${addressId}`);
            await fetchAddresses(); // Refresh the list
        } catch (error) {
            console.error('Error deleting address:', error);
            setError('Could not delete address');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading addresses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center py-4">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {addresses.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">No saved addresses found</p>
                    <button
                        onClick={onAddNewClick}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Add New Address
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map(address => (
                        <div
                            key={address.id}
                            onClick={() => onSelectAddress(address)}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors
                                ${address.isDefault ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                    <div className="flex items-center mb-2">
                                        <h4 className="font-medium">
                                            {address.firstName} {address.lastName}
                                        </h4>
                                        {address.isDefault && (
                                            <span className="ml-2 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>{address.address1}</p>
                                        {address.address2 && <p>{address.address2}</p>}
                                        <p>{address.city}, {address.postalCode}</p>
                                        <p>{address.country}</p>
                                        <p>{address.phone}</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col space-y-2 ml-4">
                                    {!address.isDefault && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSetDefault(address.id);
                                            }}
                                            className="text-sm text-primary-600 hover:text-primary-700"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteAddress(address.id);
                                        }}
                                        className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <button
                        onClick={onAddNewClick}
                        className="w-full mt-4 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                    >
                        + Add New Address
                    </button>
                </div>
            )}
        </div>
    );
};

export default SavedAddresses;
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Mirë se erdhët, {user?.firstName} {user?.lastName}!
                    </h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {/* Statistikat */}
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-900">Porositë e mia</h3>
                            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-900">Produktet e preferuara</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
                        </div>

                        <div className="bg-purple-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-purple-900">Njoftimet</h3>
                            <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
                        </div>
                    </div>

                    {/* Informacioni i përdoruesit */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informacioni i llogarisë</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Emri</p>
                                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Email</p>
                                <p className="font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Telefoni</p>
                                <p className="font-medium">{user?.phone || 'Nuk është vendosur'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Adresa</p>
                                <p className="font-medium">{user?.address || 'Nuk është vendosur'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        postalCode: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Fjalëkalimet nuk përputhen');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                country: formData.country,
                postalCode: formData.postalCode
            });

            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Ndodhi një gabim gjatë regjistrimit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Krijo llogari të re
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <input name="firstName" type="text" required placeholder="Emri" value={formData.firstName} onChange={handleChange} className="input" />
                        <input name="lastName" type="text" required placeholder="Mbiemri" value={formData.lastName} onChange={handleChange} className="input" />
                        <input name="email" type="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="input" />
                        <input name="password" type="password" required placeholder="Fjalëkalimi" value={formData.password} onChange={handleChange} className="input" />
                        <input name="confirmPassword" type="password" required placeholder="Konfirmo Fjalëkalimin" value={formData.confirmPassword} onChange={handleChange} className="input" />
                        <input name="phone" type="text" placeholder="Telefoni" value={formData.phone} onChange={handleChange} className="input" />
                        <input name="address" type="text" placeholder="Adresa" value={formData.address} onChange={handleChange} className="input" />
                        <input name="city" type="text" placeholder="Qyteti" value={formData.city} onChange={handleChange} className="input" />
                        <input name="country" type="text" placeholder="Shteti" value={formData.country} onChange={handleChange} className="input" />
                        <input name="postalCode" type="text" placeholder="Kodi postar" value={formData.postalCode} onChange={handleChange} className="input" />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            {loading ? "Duke u regjistruar..." : "Regjistrohu"}
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                    Ke nje llogari?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                        Login here!
                    </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-3xl shadow-2xl z-10">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                        Krijo Llogari të Re
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Plotëso të dhënat për të krijuar llogarinë tënde
                    </p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm space-y-4">
                         <div>
                            <label htmlFor="firstName" className="sr-only">Emri</label>
                            <input name="firstName" id="firstName" type="text" required placeholder="Emri" value={formData.firstName} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                         </div>
                         <div>
                            <label htmlFor="lastName" className="sr-only">Mbiemri</label>
                            <input name="lastName" id="lastName" type="text" required placeholder="Mbiemri" value={formData.lastName} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                         </div>
                         <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input name="email" id="email" type="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                         </div>
                         <div>
                            <label htmlFor="password" className="sr-only">Fjalëkalimi</label>
                            <input name="password" id="password" type="password" required placeholder="Fjalëkalimi" value={formData.password} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                         </div>
                         <div>
                            <label htmlFor="confirmPassword" className="sr-only">Konfirmo Fjalëkalimin</label>
                            <input name="confirmPassword" id="confirmPassword" type="password" required placeholder="Konfirmo Fjalëkalimin" value={formData.confirmPassword} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                         </div>
                         <div>
                            <label htmlFor="phone" className="sr-only">Telefoni</label>
                            <input name="phone" id="phone" type="text" placeholder="Telefoni" value={formData.phone} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                         </div>
                         <div>
                            <label htmlFor="address" className="sr-only">Adresa</label>
                            <input name="address" id="address" type="text" placeholder="Adresa" value={formData.address} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                         </div>
                         <div>
                            <label htmlFor="city" className="sr-only">Qyteti</label>
                            <input name="city" id="city" type="text" placeholder="Qyteti" value={formData.city} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                         </div>
                         <div>
                            <label htmlFor="country" className="sr-only">Shteti</label>
                            <input name="country" id="country" type="text" placeholder="Shteti" value={formData.country} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                         </div>
                         <div>
                            <label htmlFor="postalCode" className="sr-only">Kodi postar</label>
                            <input name="postalCode" id="postalCode" type="text" placeholder="Kodi postar" value={formData.postalCode} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                         </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            {loading ? "Duke u regjistruar..." : "Regjistrohu"}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                    Ke një llogari?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                        Kyçu këtu!
                    </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
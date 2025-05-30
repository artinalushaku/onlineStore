import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Akses i kufizuar
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ju nuk keni të drejta për të aksesuar këtë faqe.
                    </p>
                </div>
                <div className="mt-8 space-y-4">
                    <Link
                        to="/"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Kthehu në faqen kryesore
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized; 
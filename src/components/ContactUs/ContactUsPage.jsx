import React from 'react';
import { FaFacebookF, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

const ContactUs = () => {
    return (
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-32 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">

                    <p className="text-xl mb-4">Na kontaktoni në rrjetet tona:</p>
                    <div className="flex justify-center gap-6 text-2xl mb-8">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-200"
                        >
                            <FaFacebookF />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-200"
                        >
                            <FaInstagram />
                        </a>
                    </div>

                    <p className="text-xl mb-2">Na kontaktoni në email dhe numër:</p>
                    <div className="text-lg space-y-2">
                        <p className="flex items-center justify-center gap-2">
                            <FaEnvelope /> <span>info@dyqanionline.com</span>
                        </p>
                        <p className="flex items-center justify-center gap-2">
                            <FaPhone /> <span>+383 44 123 456</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;

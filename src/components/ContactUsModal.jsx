import React, { useState } from 'react';
import axios from '../config/axios';

const ContactUsModal = ({ open, onClose }) => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setLoading(true);
        setStatus('');
        try {
            await axios.post('/api/contact', {
                content: message
            });
            setStatus('success');
            setMessage('');
        } catch (err) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity animate-fade-in" onClick={onClose}></div>
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-fade-in-up">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-2 text-center text-blue-700">Contact Us</h2>
                <p className="text-gray-500 text-center mb-6">We'd love to hear from you! Send us a message below.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none min-h-[100px]"
                        rows={4}
                        placeholder="Type your message..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                        disabled={loading}
                    />
                    {status === 'success' && (
                        <div className="text-green-700 bg-green-100 border border-green-300 rounded p-2 text-center text-sm">Message sent successfully!</div>
                    )}
                    {status === 'error' && (
                        <div className="text-red-700 bg-red-100 border border-red-300 rounded p-2 text-center text-sm">There was an error sending your message.</div>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        disabled={loading || !message.trim()}
                    >
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
            {/* Animations */}
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.2s; }
                .animate-fade-in-up { animation: fade-in-up 0.3s; }
            `}</style>
        </div>
    );
};

export default ContactUsModal; 
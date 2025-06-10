import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';

const MessageManagement = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchContactMessages();
    }, []);

    const fetchContactMessages = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get('/api/contact/messages', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessages(response.data.data.filter(msg => !msg.deleted));
        } catch (error) {
            console.error('Error fetching contact messages:', error);
            setError('Gabim gjatë marrjes së mesazheve të kontaktit.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (messageId) => {
        try {
            await axios.put(`/api/chat/messages/${messageId}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg._id === messageId ? { ...msg, read: true } : msg
                )
            );
        } catch (error) {
            console.error('Error marking message as read:', error);
            setError('Gabim gjatë shënimit të mesazhit si të lexuar.');
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await axios.put(`/api/contact/${messageId}/delete`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
        } catch (error) {
            console.error('Error deleting message:', error);
            setError('Gabim gjatë fshirjes së mesazhit.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Mesazhet e Kontaktit</h1>

            {messages.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">
                    Nuk ka mesazhe kontakti.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mesazhi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statusi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Veprime
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {messages.map(message => (
                                <tr key={message._id} className={message.read ? '' : 'bg-blue-50 font-semibold'}>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {message.content}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(message.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {message.read ? <span className="text-green-600">Lexuar</span> : <span className="text-red-600">Pa lexuar</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 items-center">
                                        {!message.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(message._id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Shëno si të Lexuar
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteMessage(message._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Fshij
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MessageManagement; 
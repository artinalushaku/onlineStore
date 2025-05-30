import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';

const MessageManagement = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list', 'review', 'chat'

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await axios.get('/api/chat/conversations', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setConversations(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Gabim gjatë marrjes së bisedave:', error);
            setLoading(false);
        }
    };

    const handleViewConversation = (conversation) => {
        setSelectedConversation(conversation);
        setViewMode('review');
    };

    const handleAcceptConversation = () => {
        setViewMode('chat');
    };

    const handleCloseDetails = () => {
        setSelectedConversation(null);
        setReplyText('');
        setViewMode('list');
    };

    const handleReply = async () => {
        try {
            await axios.post('/api/chat/send', {
                receiverId: selectedConversation._id,
                content: replyText
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setReplyText('');
            fetchConversations();
        } catch (error) {
            console.error('Gabim gjatë dërgimit të përgjigjes:', error);
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
            <h1 className="text-3xl font-bold mb-8">Menaxhimi i Bisedave</h1>

            {viewMode === 'list' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Përdoruesi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mesazhi i Fundit
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Veprime
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {conversations.map(conversation => (
                                <tr key={conversation._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {conversation.user.firstName} {conversation.user.lastName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {conversation.lastMessage.content}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewConversation(conversation)}
                                            className="text-primary-600 hover:text-primary-900"
                                        >
                                            Shiko
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {viewMode === 'review' && selectedConversation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Shiko Bisedën
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <div className="mb-4">
                                    <h4 className="font-medium">Përdoruesi:</h4>
                                    <p className="text-sm text-gray-600">
                                        {selectedConversation.user.firstName} {selectedConversation.user.lastName}
                                    </p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Mesazhi i Fundit:</h4>
                                    <p className="text-sm text-gray-600">{selectedConversation.lastMessage.content}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-medium">Data:</h4>
                                    <p className="text-sm text-gray-600">
                                        {new Date(selectedConversation.lastMessage.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleAcceptConversation}
                                    className="px-4 py-2 bg-primary-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                                >
                                    Prano dhe Përgjigju
                                </button>
                                <button
                                    onClick={handleCloseDetails}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Mbyll
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'chat' && selectedConversation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Biseda me {selectedConversation.user.firstName} {selectedConversation.user.lastName}
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <div className="mb-4">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                        rows="3"
                                        placeholder="Shkruani përgjigjen tuaj..."
                                    />
                                </div>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleReply}
                                    className="px-4 py-2 bg-primary-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                                >
                                    Dërgo Përgjigjen
                                </button>
                                <button
                                    onClick={handleCloseDetails}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Mbyll
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageManagement; 
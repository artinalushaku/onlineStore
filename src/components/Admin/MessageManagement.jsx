import React, { useState, useEffect, useRef } from 'react';
import axios from '../../config/axios';
import { io } from 'socket.io-client';

const MessageManagement = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list', 'review', 'chat'
    const [conversationMessages, setConversationMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token')
            }
        });

        setSocket(newSocket);

        // Socket event listeners
        newSocket.on('message', (message) => {
            if (selectedConversation && 
                (message.sender === selectedConversation._id || 
                 message.receiver === selectedConversation._id)) {
                setConversationMessages(prev => [...prev, message]);
            }
            fetchConversations(); // Refresh conversations list
        });

        return () => {
            newSocket.close();
        };
    }, [selectedConversation]);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom when messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversationMessages]);

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

    const fetchConversationMessages = async (conversationId) => {
        // conversationId is always userId
        try {
            const response = await axios.get(`/api/chat/messages/${conversationId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setConversationMessages(response.data.data);
        } catch (error) {
            console.error('Gabim gjatë marrjes së mesazheve:', error);
            setConversationMessages([]);
        }
    };

    const handleViewConversation = async (conversation) => {
        setSelectedConversation(conversation);
        setViewMode('review');
        await fetchConversationMessages(conversation._id);
    };

    const handleAcceptConversation = () => {
        setViewMode('chat');
    };

    const handleCloseDetails = () => {
        setSelectedConversation(null);
        setReplyText('');
        setViewMode('list');
        setConversationMessages([]);
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        // Always use userId for receiverId
        const userId = selectedConversation.user?._id || selectedConversation._id;

        try {
            const response = await axios.post('/api/chat/send', {
                receiverId: userId,
                content: replyText
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setReplyText('');
                await fetchConversationMessages(userId);
                fetchConversations();
            }
        } catch (error) {
            console.error('Gabim gjatë dërgimit të përgjigjes:', error);
        }
    };

    const handleDeleteConversation = async (conversationId) => {
        if (!window.confirm('A jeni i sigurt që doni të fshini këtë bisedë?')) return;
        try {
            await axios.delete(`/api/chat/conversation/${conversationId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchConversations();
            if (selectedConversation && selectedConversation._id === conversationId) {
                handleCloseDetails();
            }
        } catch (error) {
            console.error('Gabim gjatë fshirjes së bisedës:', error);
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
                                <tr key={conversation._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {conversation.user ? 
                                            `${conversation.user.firstName} ${conversation.user.lastName}` :
                                            'Përdorues i ri'
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {conversation.lastMessage.content}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                        <button
                                            onClick={() => handleViewConversation(conversation)}
                                            className="text-primary-600 hover:text-primary-900"
                                        >
                                            Shiko
                                        </button>
                                        <button
                                            onClick={() => handleDeleteConversation(conversation._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Fshi
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {(viewMode === 'review' || viewMode === 'chat') && selectedConversation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Biseda me {selectedConversation.user ? `${selectedConversation.user.firstName} ${selectedConversation.user.lastName}` : 'Përdorues i ri'}
                            </h3>
                            <div className="mb-4 max-h-96 h-96 overflow-y-auto bg-gray-50 p-2 rounded">
                                {conversationMessages.length > 0 ? (
                                    conversationMessages.map((msg, idx) => (
                                        <div
                                            key={msg._id || idx}
                                            className={`flex ${msg.sender === String(selectedConversation._id) ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`px-3 py-2 rounded-lg mb-1 text-sm shadow
                                                ${msg.sender === String(selectedConversation._id)
                                                    ? 'bg-gray-200 text-gray-800'
                                                    : 'bg-blue-500 text-white'}`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-400">Nuk ka mesazhe.</div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            {viewMode === 'review' && (
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
                            )}
                            {viewMode === 'chat' && (
                                <form onSubmit={handleReply} className="flex flex-col gap-2 px-4 py-3">
                                    <textarea
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                        rows="3"
                                        placeholder="Shkruani përgjigjen tuaj..."
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-primary-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                                        >
                                            Dërgo Përgjigjen
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCloseDetails}
                                            className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        >
                                            Mbyll
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageManagement; 
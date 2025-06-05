import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import ChatWindow from './ChatWindow';
import { useAuth } from '../../contexts/AuthContext';

const CHAT_CONVERSATION_KEY = 'chat_conversation_id';

const Chat = () => {
    const { user } = useAuth();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showChatWindow, setShowChatWindow] = useState(false);
    const [firstMessage, setFirstMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [showFirstMessageForm, setShowFirstMessageForm] = useState(false);
    const [conversationId, setConversationId] = useState(null);

    useEffect(() => {
        if (!user) return;
        if (user.role === 'admin') {
            setLoading(false);
        } else {
            fetchAdmin();
        }
    }, [user]);

    useEffect(() => {
        const checkExistingConversation = async () => {
            const savedId = localStorage.getItem(CHAT_CONVERSATION_KEY);
            if (savedId) {
                try {
                    const response = await axios.get(`/api/chat/messages/${savedId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (response.data.success && response.data.data.length > 0) {
                        setConversationId(savedId);
                        setShowChatWindow(true);
                    } else {
                        localStorage.removeItem(CHAT_CONVERSATION_KEY);
                    }
                } catch (error) {
                    localStorage.removeItem(CHAT_CONVERSATION_KEY);
                }
            }
        };

        if (user) {
            checkExistingConversation();
        }
    }, [user]);

    const fetchAdmin = async () => {
        try {
            const response = await axios.get('/api/auth/any-admin', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setAdmin(response.data);
        } catch (error) {
            setAdmin(null);
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = () => {
        setShowFirstMessageForm(true);
        setFirstMessage('');
        setError('');
    };

    const handleSendFirstMessage = async (e) => {
        e.preventDefault();
        if (!firstMessage.trim()) return;
        setSending(true);
        setError('');
        const idToUse = admin ? admin.id : 'admin';
        try {
            const response = await axios.post('/api/chat/send', {
                receiverId: idToUse,
                content: firstMessage
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data && response.data.data) {
                localStorage.setItem(CHAT_CONVERSATION_KEY, idToUse);
                setConversationId(idToUse);
                setShowChatWindow(true);
                setShowFirstMessageForm(false);
            } else {
                setError('Gabim gjatë krijimit të bisedës.');
            }
        } catch (err) {
            setError('Gabim gjatë dërgimit të mesazhit.');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full p-8 text-gray-400">Duke ngarkuar chat...</div>;
    }

    if (user && user.role === 'admin') {
        return (
            <div className="flex items-center justify-center h-full p-8 text-gray-400">
                Zgjidh një përdorues nga dashboardi i mesazheve për të parë bisedat.
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-[500px] max-h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden">
            {!showChatWindow ? (
                <div className="flex flex-col items-center justify-center h-full gap-6">
                    {!showFirstMessageForm ? (
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
                            onClick={handleStartChat}
                        >
                            New Chat
                        </button>
                    ) : (
                        <form onSubmit={handleSendFirstMessage} className="w-full max-w-md flex flex-col gap-4">
                            <textarea
                                className="w-full border rounded p-3 focus:outline-none focus:ring focus:ring-blue-200"
                                rows={3}
                                placeholder="Shkruani mesazhin tuaj..."
                                value={firstMessage}
                                onChange={e => setFirstMessage(e.target.value)}
                                autoFocus
                            />
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow disabled:opacity-50"
                                disabled={sending}
                            >
                                {sending ? 'Duke dërguar...' : 'Dërgo Mesazhin'}
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                <ChatWindow
                    receiverId={conversationId}
                    receiverName={admin ? `${admin.firstName} ${admin.lastName}` : 'Stafi'}
                />
            )}
        </div>
    );
};

export default Chat; 
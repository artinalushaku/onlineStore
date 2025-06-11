import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import ChatWindow from './ChatWindow';
import { useAuth } from '../../contexts/AuthContext';
import { FaComments } from 'react-icons/fa';

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
    const [floatingOpen, setFloatingOpen] = useState(false);

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
        if (!admin || !admin.id) {
            setError('Nuk ka admin të disponueshëm për të marrë mesazhin.');
            return;
        }
        setSending(true);
        setError('');
        try {
            const response = await axios.post('/api/chat/send', {
                receiverId: admin.id,
                content: firstMessage
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data && response.data.data) {
                localStorage.setItem(CHAT_CONVERSATION_KEY, admin.id);
                setConversationId(admin.id);
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
        <div className="flex items-center justify-center min-h-[420px] py-6">
            <div className="flex flex-col w-full max-w-sm h-[420px] max-h-[80vh] bg-gradient-to-br from-blue-100/60 to-purple-100/60 rounded-3xl shadow-2xl border border-blue-100 backdrop-blur-xl p-2">
                {!showChatWindow ? (
                    <div className="flex flex-col items-center justify-center h-full gap-8">
                        {!showFirstMessageForm ? (
                            <button
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onClick={handleStartChat}
                            >
                                <span className="flex items-center gap-3">
                                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' /></svg>
                                    Nis një bisedë të re
                                </span>
                            </button>
                        ) : (
                            <form onSubmit={handleSendFirstMessage} className="w-full max-w-md flex flex-col gap-4 bg-white/80 rounded-2xl shadow-lg p-6 border border-blue-100">
                                <textarea
                                    className="w-full border-2 border-blue-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base bg-white shadow-sm transition-all duration-200 resize-none"
                                    rows={4}
                                    placeholder="Shkruani mesazhin tuaj..."
                                    value={firstMessage}
                                    onChange={e => setFirstMessage(e.target.value)}
                                    autoFocus
                                />
                                {error && <div className="text-red-500 text-sm font-semibold">{error}</div>}
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
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
        </div>
    );
};

export default Chat; 
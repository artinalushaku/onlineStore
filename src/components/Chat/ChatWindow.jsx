import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from '../../config/axios';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaRobot } from 'react-icons/fa';

const ChatWindow = ({ receiverId, receiverName, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        // Inicializimi i socket
        const newSocket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token')
            }
        });

        setSocket(newSocket);

        // Marrja e mesazheve të mëparshme
        fetchMessages();

        return () => newSocket.close();
    }, [receiverId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (message) => {
            setMessages(prev => [...prev, message]);
        });

        socket.on('userTyping', ({ userId }) => {
            if (userId === receiverId) {
                setIsTyping(true);
            }
        });

        socket.on('userStopTyping', ({ userId }) => {
            if (userId === receiverId) {
                setIsTyping(false);
            }
        });

        return () => {
            socket.off('newMessage');
            socket.off('userTyping');
            socket.off('userStopTyping');
        };
    }, [socket, receiverId]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/api/chat/messages/${receiverId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                setMessages(response.data.data);
            }
        } catch (error) {
            console.error('Gabim gjatë marrjes së mesazheve:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post('/api/chat/send', {
                receiverId,
                content: newMessage
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                socket.emit('sendMessage', {
                    receiverId,
                    content: newMessage
                });

                setNewMessage('');
            }
        } catch (error) {
            console.error('Gabim gjatë dërgimit të mesazhit:', error);
        }
    };

    const handleTyping = () => {
        socket.emit('typing', { receiverId });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stopTyping', { receiverId });
        }, 1000);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-full w-full bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl shadow-2xl border border-blue-100">
            {/* Header */}
            <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-700 to-purple-600 text-white flex items-center gap-3 rounded-t-2xl shadow-md relative min-h-[56px]">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
                    <FaRobot size={22} />
                </div>
                <div className="flex-1">
                    <span className="font-bold text-lg tracking-wide block">{receiverName}</span>
                    <span className="text-xs text-blue-100">Online</span>
                </div>
                {onClose && (
                    <button
                        className="absolute top-2 right-2 text-white text-xl font-bold bg-white/10 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        onClick={onClose}
                        aria-label="Mbyll chatin"
                    >
                        ×
                    </button>
                )}
            </div>
            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
                {messages.map((message, index) => {
                    const isOwnMessage = message.sender === String(user.id);
                    return (
                        <div key={message._id || index}>
                            <div className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                {!isOwnMessage && (
                                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center shadow">
                                        <FaRobot className="text-blue-600" size={16} />
                                    </div>
                                )}
                                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm shadow-lg transition-all duration-200
                                    ${isOwnMessage
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-br-md animate-bounce-in-right'
                                        : 'bg-white text-gray-800 border border-blue-100 rounded-bl-md animate-bounce-in-left'}`}>
                                    {message.content}
                                </div>
                                {isOwnMessage && (
                                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center shadow">
                                        <FaUserCircle className="text-purple-600" size={16} />
                                    </div>
                                )}
                            </div>
                            <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                <span className={`text-xs text-gray-400 mt-1 ${isOwnMessage ? 'ml-2' : 'mr-2'}`}>
                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {isTyping && (
                    <div className="text-xs text-blue-500 italic mb-2 animate-pulse">Duke shkruar...</div>
                )}
                <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t bg-white/80 flex gap-2 items-center rounded-b-2xl shadow-inner">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleTyping}
                    placeholder="Shkruani mesazhin tuaj..."
                    className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white shadow-sm transition-all duration-200"
                />
                <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2 rounded-full font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Dërgo
                </button>
            </form>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; background: #e0e7ff; border-radius: 8px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #a5b4fc; border-radius: 8px; }
                @keyframes bounce-in-right { 0% { opacity: 0; transform: translateX(40px); } 100% { opacity: 1; transform: translateX(0); } }
                @keyframes bounce-in-left { 0% { opacity: 0; transform: translateX(-40px); } 100% { opacity: 1; transform: translateX(0); } }
                .animate-bounce-in-right { animation: bounce-in-right 0.4s; }
                .animate-bounce-in-left { animation: bounce-in-left 0.4s; }
            `}</style>
        </div>
    );
};

export default ChatWindow; 
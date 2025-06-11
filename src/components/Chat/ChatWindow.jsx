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
        // Initialize socket connection
        const newSocket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token')
            }
        });

        setSocket(newSocket);

        // Socket event listeners
        newSocket.on('message', (message) => {
            if ((message.sender === receiverId || message.receiver === receiverId) ||
                (receiverId === 'admin' && message.receiver === 'admin')) {
                setMessages(prev => [...prev, message]);
            }
        });

        newSocket.on('userTyping', ({ userId }) => {
            if (userId === receiverId) {
                setIsTyping(true);
            }
        });

        newSocket.on('userStopTyping', ({ userId }) => {
            if (userId === receiverId) {
                setIsTyping(false);
            }
        });

        // Fetch existing messages
        fetchMessages();

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            newSocket.close();
        };
    }, [receiverId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            // Always fetch messages with receiverId (which is userId)
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
            let toReceiverId = receiverId;
            if (user && user.role !== 'admin') {
                toReceiverId = 'admin';
            }
            const response = await axios.post('/api/chat/send', {
                receiverId: toReceiverId,
                content: newMessage
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setNewMessage('');
                // Mesazhi do të vijë përmes socket event
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

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                    <FaRobot className="text-blue-600" size={20} />
                    <span className="font-semibold">{receiverName}</span>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

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
                        </div>
                    );
                })}
                {isTyping && (
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <span>{receiverName} po shkruan...</span>
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                        }}
                        onKeyPress={handleTyping}
                        placeholder="Shkruani mesazhin tuaj..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Dërgo
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow; 
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from '../../config/axios';

const ChatWindow = ({ receiverId, receiverName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

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
        <div className="flex flex-col h-full w-full">
            <div className="px-6 py-4 border-b bg-blue-600 text-white flex items-center gap-2">
                <span className="font-semibold text-lg">{receiverName}</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-50">
                {messages.map((message, index) => (
                    <div
                        key={message._id || index}
                        className={`flex flex-col ${message.sender === receiverId ? 'items-start' : 'items-end'}`}
                    >
                        <div className={`max-w-xs px-4 py-2 rounded-lg mb-1 text-sm shadow
                            ${message.sender === receiverId ? 'bg-white text-gray-800 border border-gray-200' : 'bg-blue-500 text-white'}`}
                        >
                            {message.content}
                        </div>
                        <span className="text-xs text-gray-400 mb-2">
                            {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                {isTyping && (
                    <div className="text-xs text-gray-500 italic mb-2">Duke shkruar...</div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleTyping}
                    placeholder="Shkruani mesazhin tuaj..."
                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200 text-sm"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow"
                >
                    Dërgo
                </button>
            </form>
        </div>
    );
};

export default ChatWindow; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/auth/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Gabim gjatë marrjes së përdoruesve:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        (`${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b bg-white">
                <h3 className="text-lg font-semibold mb-2">Përdoruesit</h3>
                <input
                    type="text"
                    placeholder="Kërko përdorues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200 text-sm"
                />
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50">
                {filteredUsers.map(user => (
                    <div
                        key={user.id}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-100 transition"
                        onClick={() => onSelectUser(user)}
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                            {user.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-800">{user.firstName} {user.lastName}</h4>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList; 
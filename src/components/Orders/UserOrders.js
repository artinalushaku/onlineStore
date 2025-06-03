import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';

const UserOrders = () => {
    return (
        <Routes>
            <Route path="/" element={<OrderList />} />
            <Route path="/:orderId" element={<OrderDetails />} />
        </Routes>
    );
};

export default UserOrders; 
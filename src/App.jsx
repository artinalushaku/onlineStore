// src/App.jsx - Updated with doctor management routes

import { AuthProvider, useAuth } from './contexts/AuthContext';


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import CategoryList from './components/Categories/CategoryList';
import CategoryDetails from './components/Categories/CategoryDetails';
import Dashboard from './components/Dashboard';
import WishlistManagement from './components/Admin/WishlistManagement';
import AdminDashboard from './components/Admin/AdminDashboard';
import OrderManagement from './components/Admin/OrderManagement';
import UserManagement from './components/Admin/UserManagement';
import CategoryManagement from './components/Admin/CategoryManagement';
import CouponManagement from './components/Admin/CouponManagement.jsx';
import MessageManagement from './components/Admin/MessageManagement';


import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Unauthorized from './components/Auth/Unauthorized';

function App() {
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Auth Component */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/*User Components*/}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/category/:id" element={<CategoryDetails />} />
                <Route path="/wishlist" element={<WishlistManagement />} />

<Route path="/" element={<AdminDashboard />} />
      <Route path="/products" element={<ProductManagement />} />
      <Route path="/orders" element={<OrderManagement />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/categories" element={<CategoryManagement />} />
      <Route path="/coupons" element={<CouponManagement />} />
            <Route path="/messages" element={<MessageManagement />} />
                
// Admin routes
const AdminRoutes = () => (
  <ProtectedRoute allowedRoles={['admin']}>
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/orders" element={<OrderManagement />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/categories" element={<CategoryManagement />} />
      <Route path="/coupons" element={<CouponManagement />} />
      <Route path="/messages" element={<MessageManagement />} />

      <Route path="/cart" element={<CartManagement />} />
    </Routes>
  </ProtectedRoute>
);
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
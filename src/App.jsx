// src/App.jsx - Updated with doctor management routes
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Context providers
import { CartProvider } from './contexts/CartContext';

// Common components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Auth components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import Unauthorized from './components/Auth/Unauthorized';

// Admin components
import AdminDashboard from './components/Admin/AdminDashboard';
import ProductManagement from './components/Admin/ProductManagement';
import OrderManagement from './components/Admin/OrderManagement';
import UserManagement from './components/Admin/UserManagement';
import CategoryManagement from './components/Admin/CategoryManagement';
import CouponManagement from './components/Admin/CouponManagement';
import ShippingManagement from './components/Admin/ShippingManagement';
import ReviewManagement from './components/Admin/ReviewManagement';
import MessageManagement from './components/Admin/MessageManagement';
import ExportData from './components/Admin/ExportData';
import Reports from './components/Admin/Reports';
import WishlistManagement from './components/Admin/WishlistManagement';
import CartManagement from './components/Admin/CartManagement';

// User components
import Home from './components/Home/HomePage';
import ProductList from './components/Products/ProductList';
import ProductDetails from './components/Products/ProductDetails';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import Invoice from './components/Checkout/Invoice';
import Wishlist from './components/Wishlist/Wishlist';
import UserProfile from './components/Profile/UserProfile';
import UserOrders from './components/Orders/UserOrders';
import CategoryList from './components/Categories/CategoryList';
import SearchResults from './components/Search/SearchResults';
import NotificationCenter from './components/Notifications/NotificationCenter';
import AdvancedSearch from './components/Search/AdvancedSearch';
import ProductRecommendations from './components/Products/ProductRecommendations';
import CategoryDetails from './components/Categories/CategoryDetails';
import CartPage from './components/Cart/CartPage';
import Chat from './components/Chat/Chat';

// Admin routes
const AdminRoutes = () => (
  <ProtectedRoute allowedRoles={['admin']}>
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/products" element={<ProductManagement />} />
      <Route path="/orders" element={<OrderManagement />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/categories" element={<CategoryManagement />} />
      <Route path="/coupons" element={<CouponManagement />} />
      <Route path="/shipping" element={<ShippingManagement />} />
      <Route path="/reviews" element={<ReviewManagement />} />
      <Route path="/messages" element={<MessageManagement />} />
      <Route path="/export" element={<ExportData />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/wishlist" element={<WishlistManagement />} />
      <Route path="/cart" element={<CartManagement />} />
    </Routes>
  </ProtectedRoute>
);

// User routes
const UserRoutes = () => (
  <ProtectedRoute allowedRoles={['customer', 'admin']}>
    <Routes>
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orders" element={<UserOrders />} />
      <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
  </ProtectedRoute>
);

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/category/:id" element={<CategoryDetails />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/invoice/:id" element={<Invoice />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/user/*" element={<UserRoutes />} />
                <Route path="/advanced-search" element={<AdvancedSearch />} />
                <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <UserProfile />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
            {/* Floating Chat Button */}
            <button
              className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setShowChat(true)}
              aria-label="Hap Chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0 4.97 4.813 9 10.75 9 .98 0 1.94-.09 2.86-.26.41-.07.82.06 1.11.36l2.13 2.13a.75.75 0 001.28-.53v-2.36c0-.38.21-.73.55-.91C21.07 17.7 21.75 14.97 21.75 12c0-4.97-4.813-9-10.75-9S2.25 7.03 2.25 12z" />
              </svg>
            </button>
            {/* Chat Modal */}
            {showChat && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={() => setShowChat(false)}
                    aria-label="Mbyll Chat"
                  >
                    &times;
                  </button>
                  <Chat />
                </div>
              </div>
            )}
          </div>
          <ToastContainer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
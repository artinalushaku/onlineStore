import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import CategoryList from './components/Categories/CategoryList';
import CategoryDetails from './components/Categories/CategoryDetails';
import Dashboard from './components/Dashboard';
import Wishlist from './components/Wishlist/Wishlist';

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
          <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/unauthorized" element={<Unauthorized />} />
          {/*User Components*/}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/category/:id" element={<CategoryDetails />} />
                <Route path="/wishlist" element={<WishlistManagement />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App; 
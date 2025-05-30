import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import CategoryList from './components/Categories/CategoryList';
import CategoryDetails from './components/Categories/CategoryDetails';
import Dashboard from './components/Dashboard';


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
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
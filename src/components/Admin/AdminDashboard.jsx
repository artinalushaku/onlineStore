import React, { useState } from 'react';
import { FaBoxOpen, FaClipboardList, FaUsers, FaTags, FaTruck, FaChartBar, FaThLarge, FaHeart, FaStar, FaShoppingCart } from 'react-icons/fa';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import CategoryManagement from './CategoryManagement';
import CouponManagement from './CouponManagement.jsx';
import ShippingManagement from './ShippingManagement';
import Reports from './Reports';
import MessageManagement from './MessageManagement';
import WishlistManagement from './WishlistManagement';
import ReviewManagement from './ReviewManagement';
import CartManagement from './CartManagement';
import Statistics from './Statistics';

const sections = [
  { key: 'statistics', label: 'Statistikat', icon: <FaChartBar size={20} /> },
  { key: 'products', label: 'Produktet', icon: <FaBoxOpen size={20} /> },
  { key: 'orders', label: 'Porositë', icon: <FaClipboardList size={20} /> },
  { key: 'users', label: 'Përdoruesit', icon: <FaUsers size={20} /> },
  { key: 'categories', label: 'Kategoritë', icon: <FaThLarge size={20} /> },
  { key: 'coupons', label: 'Kuponat', icon: <FaTags size={20} /> },
  { key: 'shipping', label: 'Transporti', icon: <FaTruck size={20} /> },
  { key: 'wishlists', label: 'Lista e Dëshirave', icon: <FaHeart size={20} /> },
  { key: 'carts', label: 'Shportat', icon: <FaShoppingCart size={20} /> },
  { key: 'reviews', label: 'Vlerësimet', icon: <FaStar size={20} /> },
  { key: 'reports', label: 'Raportet', icon: <FaChartBar size={20} /> },
  { key: 'messages', label: 'Mesazhet', icon: <FaClipboardList size={20} /> },
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('products');

  const renderSection = () => {
    switch (activeSection) {
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'coupons':
        return <CouponManagement />;
      case 'shipping':
        return <ShippingManagement />;
      case 'wishlists':
        return <WishlistManagement />;
      case 'carts':
        return <CartManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'reports':
        return <Reports />;
      case 'messages':
        return <MessageManagement />;
      case 'statistics':
        return <Statistics />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col py-8 px-4 shadow-lg">
        <div className="mb-10 text-center">
          <span className="text-2xl font-bold tracking-wide">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-2">
          {sections.map(section => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-lg font-medium
                ${activeSection === section.key ? 'bg-gray-700 text-white shadow' : 'hover:bg-gray-800 text-gray-100'}`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 bg-white rounded-l-3xl shadow-xl min-h-screen">
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard; 
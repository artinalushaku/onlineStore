import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-2xl font-bold text-gray-900">STORE</div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Products</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Store</h1>
            <p className="text-xl text-gray-600 mb-8">Discover quality products at great prices</p>
            <button className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product Card 1 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Name</h3>
                <p className="text-gray-600">$99.99</p>
              </div>
            </div>
            {/* Product Card 2 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Name</h3>
                <p className="text-gray-600">$99.99</p>
              </div>
            </div>
            {/* Product Card 3 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Name</h3>
                <p className="text-gray-600">$99.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-400">Your trusted online store for quality products.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">Email: info@store.com</p>
              <p className="text-gray-400">Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    // Static product data for now
    const featuredProducts = [
        {
            id: 1,
            name: "Produkti 1",
            description: "Përshkrimi i produktit 1",
            price: "99.99",
            image: "https://via.placeholder.com/300x200"
        },
        {
            id: 2,
            name: "Produkti 2",
            description: "Përshkrimi i produktit 2",
            price: "149.99",
            image: "https://via.placeholder.com/300x200"
        },
        {
            id: 3,
            name: "Produkti 3",
            description: "Përshkrimi i produktit 3",
            price: "199.99",
            image: "https://via.placeholder.com/300x200"
        },
        {
            id: 4,
            name: "Produkti 4",
            description: "Përshkrimi i produktit 4",
            price: "249.99",
            image: "https://via.placeholder.com/300x200"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Mirësevini në Dyqanin Tonë Online
                        </h1>
                        <p className="text-xl mb-8">
                            Zbuloni koleksionin tonë të produkteve të cilësisë së lartë me çmime të përballueshme
                        </p>
                        <Link
                            to="/products"
                            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-300"
                        >
                            Shiko Produktet
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Produktet Kryesore</h2>
                        <Link 
                            to="/products" 
                            className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
                        >
                            Shiko të Gjitha →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{product.name}</h3>
                                    <p className="text-gray-600 mb-3">{product.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-blue-600 font-bold text-lg">{product.price}€</span>
                                        <Link
                                            to={`/products/${product.id}`}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                                        >
                                            Shiko Detajet
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Special Offers */}
            <section className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Oferta Speciale</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Regjistrohu për të marrë njoftime për ofertat tona speciale dhe zbritjet ekskluzive
                        </p>
                        <Link
                            to="/register"
                            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
                        >
                            Regjistrohu Tani
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage; 
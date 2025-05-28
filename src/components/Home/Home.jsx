import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-primary text-white py-20">
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
                            className="bg-white text-primary px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Shiko Produktet
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl mb-4">🚚</div>
                            <h3 className="text-xl font-semibold mb-2">Dërgesë e Shpejtë</h3>
                            <p className="text-gray-600">
                                Dërgesë e shpejtë dhe e sigurt në të gjithë vendin
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">💳</div>
                            <h3 className="text-xl font-semibold mb-2">Pagesë e Sigurt</h3>
                            <p className="text-gray-600">
                                Metoda të sigurta të pagesës për blerje të sigurta
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">🔄</div>
                            <h3 className="text-xl font-semibold mb-2">Kthim i Lehtë</h3>
                            <p className="text-gray-600">
                                Proces i thjeshtë për kthimin e produkteve
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Kategoritë Tona
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Këtu mund të shtoni kategoritë */}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home; 
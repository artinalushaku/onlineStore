import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const {
        _id,
        id,
        name,
        price,
        images,
        discount,
        rating,
        stock,
        image
    } = product;

    const productId = _id || id;
    if (!productId) return null;

    let imageSrc = image;
    if (!imageSrc) {
        if (Array.isArray(images)) {
            imageSrc = images[0];
        } else if (typeof images === 'string') {
            try {
                const arr = JSON.parse(images);
                imageSrc = Array.isArray(arr) ? arr[0] : images;
            } catch {
                imageSrc = images;
            }
        }
    }

    const discountedPrice = discount ? price - (price * discount / 100) : price;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user) {
            toast.error('Ju duhet të jeni të kyçur për të shtuar produkte në shportë');
            return;
        }

        if (stock === 0) {
            toast.error('Ky produkt është jashtë gjendjes');
            return;
        }

        const confirmAdd = window.confirm('A jeni i sigurt që dëshironi ta shtoni këtë produkt në shportë?');

        if (confirmAdd) {
            const result = await addToCart(productId);
            if (result.success) {
                toast.success('Produkti u shtua në shportë');
            } else {
                toast.error(result.error || 'Gabim gjatë shtimit në shportë');
            }
        }
    };

    // Funksion ndihmës për path-in e imazhit
    const getImageSrc = (imgPath) => {
        if (!imgPath) return '';
        if (imgPath.startsWith('/uploads/')) {
            return `http://localhost:5000${imgPath}`;
        }
        if (imgPath.startsWith('http')) {
            return imgPath;
        }
        return `http://localhost:5000/uploads/${imgPath}`;
    };

    return (
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
            <Link to={`/products/${productId}`} className="block group relative">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                        src={getImageSrc(imageSrc)} 
                        alt={name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {discount > 0 && (
                        <div className="absolute top-4 left-4 bg-red-600 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md">
                            -{discount}%
                        </div>
                    )}
                    {stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">Jashtë Gjendjes</span>
                        </div>
                    )}
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                    <h3 className="text-xl font-bold mb-1 text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                        {name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                        {discount > 0 ? (
                            <>
                                <span className="text-gray-400 line-through text-xs">
                                    {price}€
                                </span>
                                <span className="text-lg font-bold text-red-500">
                                    {discountedPrice}€
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-gray-800">
                                {price}€
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'stroke-current fill-none'}`}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    />
                                </svg>
                            ))}
                        </div>
                        <span className="text-gray-500 text-xs ml-1">
                            ({rating})
                        </span>
                        {stock > 0 && (
                            <span className="text-green-500 text-xs font-medium ml-auto">
                                Në Gjendje
                            </span>
                        )}
                    </div>
                </div>
            </Link>
            {stock > 0 && (
                <button
                    onClick={handleAddToCart}
                    className="mt-auto w-full py-2 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl shadow hover:from-blue-500 hover:to-primary transition-all duration-300 text-base tracking-wide backdrop-blur-md"
                >
                    Shto në Shportë
                </button>
            )}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary transition-all duration-300 pointer-events-none"></div>
        </div>
    );
};

export default ProductCard; 
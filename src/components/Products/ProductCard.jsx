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

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <Link to={`/products/${productId}`} className="block">
                <div className="relative aspect-[4/3]">
                    <img 
                        src={imageSrc} 
                        alt={name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                        <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                                -{discount}%
                            </span>
                        </div>
                    )}
                    {stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">Jashtë Gjendjes</span>
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-indigo-600 transition-colors duration-200">
                        {name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                        {discount > 0 ? (
                            <>
                                <span className="text-gray-400 line-through text-xs">
                                    {price}€
                                </span>
                                <span className="text-base font-bold text-red-500">
                                    {discountedPrice}€
                                </span>
                            </>
                        ) : (
                            <span className="text-base font-bold text-gray-800">
                                {price}€
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'stroke-current fill-none'}`}
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
                        </div>
                        {stock > 0 && (
                            <span className="text-green-500 text-xs font-medium">
                                Në Gjendje
                            </span>
                        )}
                    </div>
                </div>
            </Link>
            {stock > 0 && (
                <button
                    onClick={handleAddToCart}
                    className="w-full py-1.5 bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200"
                >
                    Shto në Shportë
                </button>
            )}
        </div>
    );
};

export default ProductCard; 
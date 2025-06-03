import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const {
        _id,
        id,
        name,
        price,
        images,
        discount,
        rating,
        stock
    } = product;

    const productId = _id || id;
    if (!productId) return null;

    const discountedPrice = discount ? price - (price * discount / 100) : price;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <Link to={`/products/${productId}`} className="block">
                <div className="relative">
                    <img 
                        src={images[0]} 
                        alt={name} 
                        className="w-full h-64 object-cover"
                    />
                    {discount > 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                            -{discount}%
                        </span>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                        {discount > 0 ? (
                            <>
                                <span className="text-gray-500 line-through text-sm">
                                    {price}€
                                </span>
                                <span className="text-xl font-bold text-red-500">
                                    {discountedPrice}€
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-gray-800">
                                {price}€
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-yellow-400">
                            {'★'.repeat(Math.floor(rating))}
                            {'☆'.repeat(5 - Math.floor(rating))}
                            <span className="text-gray-600 text-sm ml-1">
                                ({rating})
                            </span>
                        </div>
                        <div className="text-sm">
                            {stock > 0 ? (
                                <span className="text-green-500 font-medium">
                                    Në Gjendje
                                </span>
                            ) : (
                                <span className="text-red-500 font-medium">
                                    Jashtë Gjendjes
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard; 
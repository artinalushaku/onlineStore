import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../config/axios';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaShare, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: '',
        images: []
    });
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        fetchProduct();
        if (user) {
            checkWishlistStatus();
        }
        fetchReviews();
    }, [id, user]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/products/${id}`);
            setProduct(response.data);
            setError(null);
        } catch (err) {
            setError('Nuk mund të merret produkti. Ju lutemi provoni përsëri.');
            console.error('Gabim gjatë marrjes së produktit:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkWishlistStatus = async () => {
        try {
            const response = await api.get('/api/wishlist');
            const isInWishlist = response.data.items.some(item => item.productId === parseInt(id));
            setIsInWishlist(isInWishlist);
        } catch (err) {
            console.error('Gabim gjatë kontrollit të listës së dëshirave:', err);
        }
    };

    const addToCart = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/products/${id}` } });
            return;
        }

        try {
            setAddingToCart(true);
            await api.post('/api/cart/add', {
                productId: parseInt(id),
                quantity: quantity
            });
            
            // Përditëso numrin e artikujve në shportë në navbar
            const cartResponse = await api.get('/api/cart/count');
            // Emit event për përditësimin e numrit të artikujve në navbar
            window.dispatchEvent(new CustomEvent('cartUpdated', { 
                detail: { count: cartResponse.data.count }
            }));
            
            alert('Produkti u shtua në shportë me sukses!');
        } catch (err) {
            console.error('Gabim gjatë shtimit në shportë:', err);
            alert(err.response?.data?.message || 'Ndodhi një gabim gjatë shtimit në shportë');
        } finally {
            setAddingToCart(false);
        }
    };

    const toggleWishlist = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/products/${id}` } });
            return;
        }

        try {
            setWishlistLoading(true);
            if (isInWishlist) {
                await api.delete(`/api/wishlist/remove/${id}`);
                setIsInWishlist(false);
            } else {
                await api.post(`/api/wishlist/add/${id}`);
                setIsInWishlist(true);
            }
            
            // Përditëso numrin e artikujve në listën e dëshirave në navbar
            const wishlistResponse = await api.get('/api/wishlist/count');
            // Emit event për përditësimin e numrit të artikujve në navbar
            window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
                detail: { count: wishlistResponse.data.count }
            }));
        } catch (err) {
            console.error('Gabim gjatë përditësimit të listës së dëshirave:', err);
            alert(err.response?.data?.message || 'Ndodhi një gabim gjatë përditësimit të listës së dëshirave');
        } finally {
            setWishlistLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/api/reviews/product/${id}`);
            setReviews(response.data.reviews);
        } catch (err) {
            console.error('Gabim gjatë marrjes së komenteve:', err);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setReviewForm(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeImage = (index) => {
        setReviewForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login', { state: { from: `/products/${id}` } });
            return;
        }

        try {
            setReviewLoading(true);
            setReviewError(null);

            const formData = new FormData();
            formData.append('productId', id);
            formData.append('rating', reviewForm.rating);
            formData.append('comment', reviewForm.comment);
            reviewForm.images.forEach(image => {
                formData.append('images', image);
            });

            await api.post('/api/reviews', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setReviewForm({
                rating: 5,
                comment: '',
                images: []
            });
            fetchReviews();
            fetchProduct(); // Refresh product to update rating
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Ndodhi një gabim gjatë dërgimit të komentit');
        } finally {
            setReviewLoading(false);
        }
    };

    const handleImageClick = (index) => {
        setSelectedImage(index);
        setShowImageModal(true);
    };

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
                >
                    <p className="text-red-600 text-lg mb-4">{error}</p>
                    <button
                        onClick={fetchProduct}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Provoni Përsëri
                    </button>
                </motion.div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg shadow-lg p-8"
                >
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Produkti nuk u gjet
                    </h1>
                    <button
                        onClick={() => navigate('/products')}
                        className="text-primary hover:text-primary-dark transition-colors"
                    >
                        Kthehu te Produktet
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-12"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Image Gallery */}
                <div className="space-y-6">
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl">
                        <img
                            src={getImageSrc(product.images[selectedImage])}
                            alt={product.name}
                            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 hover:scale-105"
                            onClick={() => handleImageClick(selectedImage)}
                        />
                        {product.discount > 0 && (
                            <div className="absolute top-4 left-4 bg-red-600 text-white font-bold px-4 py-2 rounded-full text-base shadow-md">
                                -{product.discount}%
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 hover:opacity-90 transition-opacity duration-300"></div>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        {product.images.map((image, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img
                                    src={getImageSrc(image)}
                                    alt={`${product.name} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-10 bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl p-10">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 drop-shadow-lg">
                            {product.name}
                        </h1>
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex items-center text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                                ))}
                            </div>
                            <span className="text-gray-600">({product.reviewCount} reviews)</span>
                            {product.stock > 0 ? (
                                <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Në Gjendje</span>
                            ) : (
                                <span className="ml-auto bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Jashtë Gjendjes</span>
                            )}
                        </div>
                        <p className="text-3xl font-bold text-primary mb-6">
                            {product.discount > 0 ? (
                                <>
                                    <span className="line-through text-gray-400 mr-2">{product.price}€</span>
                                    <span>{(product.price - (product.price * product.discount / 100)).toFixed(2)}€</span>
                                </>
                            ) : (
                                <>{product.price}€</>
                            )}
                        </p>
                    </div>

                    <div className="prose max-w-none text-gray-700 text-lg">
                        <p>{product.description}</p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center border rounded-lg overflow-hidden bg-white/50">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                -
                            </button>
                            <span className="px-6 py-2 text-lg font-medium">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                +
                            </button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={addToCart}
                            disabled={addingToCart || product.stock === 0}
                            className="flex-1 bg-gradient-to-r from-primary to-blue-500 text-white px-8 py-3 rounded-xl hover:from-blue-500 hover:to-primary disabled:opacity-50 transition-colors flex items-center justify-center space-x-2 text-lg font-semibold shadow"
                        >
                            <FaShoppingCart />
                            <span>{addingToCart ? 'Duke shtuar...' : 'Shto në Shportë'}</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleWishlist}
                            className={`p-3 rounded-full border-2 ${isInWishlist ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-400 border-gray-200 bg-gray-50'} hover:bg-gray-100 transition-colors`}
                        >
                            {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Review Section */}
            <div className="mt-20 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Komentet</h2>
                <div className="border-b border-gray-200 mb-8"></div>
                {/* Review Form */}
                {user && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/70 rounded-2xl shadow p-6 mb-8 max-w-xl mx-auto backdrop-blur-lg"
                    >
                        <h3 className="text-lg font-semibold mb-3">Shkruaj një Koment</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vlerësimi
                                </label>
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.button
                                            key={star}
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                            className="text-xl focus:outline-none transition-colors"
                                        >
                                            {star <= reviewForm.rating ? '★' : '☆'}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Komenti
                                </label>
                                <textarea
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    rows="2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Imazhet (Opsionale)
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="w-full text-xs"
                                />
                                {reviewForm.images.length > 0 && (
                                    <div className="mt-2 flex gap-2 flex-wrap">
                                        {reviewForm.images.map((image, index) => (
                                            <div key={index} className="relative w-16 h-16">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {reviewError && (
                                <div className="text-red-500 text-xs">{reviewError}</div>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={reviewLoading}
                                className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50 text-sm font-medium"
                            >
                                {reviewLoading ? 'Duke dërguar...' : 'Dërgo Komentin'}
                            </motion.button>
                        </form>
                    </motion.div>
                )}
                {/* Reviews List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((review) => {
                        const initials = review.userName
                            ? review.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
                            : 'U';
                        return (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/80 rounded-xl shadow p-4 flex flex-col gap-2 backdrop-blur-lg"
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base">
                                        {initials}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">{review.userName}</div>
                                        <div className="flex items-center text-yellow-400 text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="ml-auto text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-700 text-sm mb-1">{review.comment}</p>
                                {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mt-1">
                                        {review.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Review image ${index + 1}`}
                                                className="w-14 h-14 object-cover rounded"
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {showImageModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                        onClick={() => setShowImageModal(false)}
                    >
                        <div className="relative max-w-7xl max-h-[90vh] mx-4">
                            <img
                                src={getImageSrc(product.images[selectedImage])}
                                alt={product.name}
                                className="max-h-[90vh] object-contain"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition-colors"
                            >
                                <FaChevronLeft className="text-2xl" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition-colors"
                            >
                                <FaChevronRight className="text-2xl" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProductDetails; 
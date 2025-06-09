import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);

    // Calculate total whenever cart items change
    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    // Fetch cart on mount and when token changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setCart({ items: [], total: 0 });
                setLoading(false);
                return;
            }

            const response = await axios.get('/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Ensure we have valid items array
            const items = Array.isArray(response.data.items) ? response.data.items : [];
            const total = calculateTotal(items);
            
            setCart({ items, total });
        } catch (error) {
            console.error('Gabim gjatë marrjes së shportës:', error);
            setCart({ items: [], total: 0 });
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return { success: false, error: 'Ju duhet të jeni të kyçur' };
            }

            const response = await axios.post(
                '/api/cart/add',
                { productId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Ensure we have valid items array
            const items = Array.isArray(response.data.items) ? response.data.items : [];
            const total = calculateTotal(items);
            
            setCart({ items, total });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Gabim gjatë shtimit në shportë' };
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return { success: false, error: 'Ju duhet të jeni të kyçur' };
            }

            const response = await axios.delete(`/api/cart/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Ensure we have valid items array
            const items = Array.isArray(response.data.items) ? response.data.items : [];
            const total = calculateTotal(items);
            
            setCart({ items, total });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Gabim gjatë heqjes nga shporta' };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return { success: false, error: 'Ju duhet të jeni të kyçur' };
            }

            const response = await axios.put(
                `/api/cart/update/${productId}`,
                { quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Ensure we have valid items array
            const items = Array.isArray(response.data.items) ? response.data.items : [];
            const total = calculateTotal(items);
            
            setCart({ items, total });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Gabim gjatë përditësimit të sasisë' };
        }
    };

    const clearCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return { success: false, error: 'Ju duhet të jeni të kyçur' };
            }

            await axios.delete('/api/cart/clear', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setCart({ items: [], total: 0 });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Gabim gjatë pastrimit të shportës' };
        }
    };

    const getCartItemsCount = () => {
        return cart.items.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartItemsCount,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart duhet të përdoret brenda CartProvider');
    }
    return context;
};
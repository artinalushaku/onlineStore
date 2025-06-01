import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get('/api/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCart(response.data.items);
            }
        } catch (error) {
            console.error('Gabim gjatë marrjes së shportës:', error);
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
            setCart(response.data.items);
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
            setCart(response.data.items);
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
            setCart(response.data.items);
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
            setCart([]);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Gabim gjatë pastrimit të shportës' };
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
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
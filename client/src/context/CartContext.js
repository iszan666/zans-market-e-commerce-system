'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                // Standardize and Deduplicate
                const standardizedCart = parsedCart.map(item => ({
                    ...item,
                    product: item.product || item._id // Ensure 'product' is always the ID
                }));
                const uniqueCart = Array.from(new Map(standardizedCart.map(item => [item.product, item])).values());
                setCartItems(uniqueCart);
            } catch (err) {
                console.error("Cart parsing error:", err);
                setCartItems([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty = 1) => {
        const productId = product.product || product._id;
        if (!productId) return;

        const existItem = cartItems.find((x) => x.product === productId);

        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x.product === productId
                        ? { ...x, qty: Number(x.qty) + Number(qty) }
                        : x
                )
            );
            toast.success(`${product.name} quantity updated!`);
        } else {
            setCartItems([...cartItems, { ...product, product: productId, qty: Number(qty) }]);
            toast.success(`${product.name} added to cart!`);
        }
    };

    const removeFromCart = (id) => {
        const item = cartItems.find(x => x.product === id);
        setCartItems(cartItems.filter((x) => x.product !== id));
        if (item) {
            toast.error(`${item.name} removed from cart`);
        }
    };

    const increaseQty = (id) => {
        setCartItems(
            cartItems.map((item) =>
                item.product === id ? { ...item, qty: item.qty + 1 } : item
            )
        );
    };

    const decreaseQty = (id) => {
        setCartItems(
            cartItems.map((item) =>
                item.product === id && item.qty > 1
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Calculate subtotal automatically
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            increaseQty,
            decreaseQty,
            clearCart,
            subtotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

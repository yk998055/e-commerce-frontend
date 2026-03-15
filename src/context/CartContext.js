'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CART_STORAGE_KEY = 'chhaapaya_cart';

const CartContext = createContext(null);

function loadCartFromStorage() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCartToStorage(items) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (_) {}
}

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setItems(loadCartFromStorage());
    }, []);

    useEffect(() => {
        saveCartToStorage(items);
    }, [items]);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

    const addToCart = useCallback((product, options = {}) => {
        const { size = '', quantity = 1 } = options;
        const price = Number(product.discountPrice) > 0 && Number(product.discountPrice) < Number(product.price)
            ? Number(product.discountPrice)
            : Number(product.price) || 0;
        const image = Array.isArray(product.images) && product.images[0] ? product.images[0] : '';
        const entry = {
            productId: product._id,
            name: product.name || 'Product',
            image,
            price,
            size,
            quantity,
        };
        setItems((prev) => {
            const existing = prev.findIndex(
                (i) => i.productId === entry.productId && i.size === entry.size
            );
            if (existing >= 0) {
                const next = [...prev];
                next[existing] = { ...next[existing], quantity: next[existing].quantity + quantity };
                return next;
            }
            return [...prev, entry];
        });
    }, []);

    const removeFromCart = useCallback((productId, size = '') => {
        setItems((prev) =>
            prev.filter((i) => !(i.productId === productId && i.size === size))
        );
    }, []);

    const updateQuantity = useCallback((productId, size, delta) => {
        setItems((prev) =>
            prev.map((i) => {
                if (i.productId !== productId || i.size !== size) return i;
                const q = Math.max(0, i.quantity + delta);
                if (q === 0) return null;
                return { ...i, quantity: q };
            }).filter(Boolean)
        );
    }, []);

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    const value = {
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        total,
        count,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}

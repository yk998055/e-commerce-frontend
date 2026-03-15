'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeFromCart, updateQuantity, total, count } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleCheckout = () => {
        if (count === 0) return;
        if (!isAuthenticated) {
            closeCart();
            router.push('/login?redirect=/checkout');
            return;
        }
        closeCart();
        router.push('/checkout');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={closeCart}
                aria-hidden="true"
            />
            {/* Panel */}
            <div
                className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[65] flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-label="Cart"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e2643]/10">
                    <h2 className="text-[13px] font-semibold text-[#1e2643] uppercase tracking-[0.2em]">
                        Cart
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 text-[#1e2643] hover:opacity-70 transition-opacity"
                        aria-label="Close cart"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Free shipping */}
                <div className="px-6 py-3 bg-[#FEE6A9]/30 border-b border-[#1e2643]/5">
                    <p className="text-[11px] font-medium text-[#1e2643] uppercase tracking-wider">
                        You are eligible for free shipping!
                    </p>
                </div>

                {/* Cart items - scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-6 hidden-scrollbar">
                    {items.length === 0 ? (
                        <p className="text-[13px] text-[#1e2643]/50 serif italic py-8">
                            Your bag is empty.
                        </p>
                    ) : (
                        <ul className="space-y-6">
                            {items.map((item) => (
                                <li key={`${item.productId}-${item.size}`} className="flex gap-4 pb-6 border-b border-[#1e2643]/5 last:border-0">
                                    <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-gray-50">
                                        <img
                                            src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-medium text-[#1e2643] uppercase tracking-wider line-clamp-2">
                                            {item.name}
                                        </p>
                                        {item.size && (
                                            <p className="text-[10px] text-[#1e2643]/60 uppercase mt-0.5">Size: {item.size}</p>
                                        )}
                                        <p className="text-[11px] font-semibold text-[#1e2643] mt-1">
                                            ₹{item.price.toLocaleString()}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.productId, item.size, -1)}
                                                className="w-7 h-7 flex items-center justify-center border border-[#1e2643]/20 text-[#1e2643] hover:border-[#1e2643]/50 text-sm"
                                            >
                                                −
                                            </button>
                                            <span className="text-[11px] font-medium text-[#1e2643] w-6 text-center">{item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.productId, item.size, 1)}
                                                className="w-7 h-7 flex items-center justify-center border border-[#1e2643]/20 text-[#1e2643] hover:border-[#1e2643]/50 text-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.productId, item.size)}
                                            className="text-[10px] text-[#1e2643]/60 hover:text-[#1e2643] uppercase tracking-wider mt-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-6 py-5 border-t border-[#1e2643]/10 space-y-4">
                    <button
                        type="button"
                        className="text-[11px] text-[#1e2643]/60 hover:text-[#1e2643] uppercase tracking-wider"
                    >
                        Add Order Note
                    </button>
                    <p className="text-[10px] text-[#1e2643]/50 uppercase tracking-wider">
                        Shipping & taxes calculated at checkout
                    </p>
                    <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={count === 0}
                        className="w-full py-4 bg-[#1e2643] text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-between px-6 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>Checkout</span>
                        <span>₹{total.toLocaleString()}</span>
                    </button>
                </div>
            </div>
        </>
    );
}

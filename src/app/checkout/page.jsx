'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function CheckoutPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.replace('/login?redirect=/checkout');
        }
    }, [isAuthenticated, authLoading, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center pt-36">
                <div className="w-8 h-8 border-2 border-[#1e2643]/20 border-t-[#1e2643] rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-white pt-36 lg:pt-40 pb-24">
            <div className="max-w-2xl mx-auto px-6 text-center">
                <h1 className="text-3xl font-light text-[#1e2643] serif uppercase tracking-widest mb-6">
                    Checkout
                </h1>
                <p className="text-[#1e2643]/60 text-sm mb-10">
                    Checkout flow will be available here. You are logged in.
                </p>
                <Link
                    href="/products"
                    className="inline-block px-10 py-4 border border-[#1e2643] text-[#1e2643] text-[10px] font-bold uppercase tracking-widest hover:bg-[#1e2643] hover:text-white transition-all"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

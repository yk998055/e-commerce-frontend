'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AddressesPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/login?redirect=/profile/addresses');
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
            <div className="max-w-2xl mx-auto px-6">
                <Link
                    href="/profile"
                    className="text-[11px] font-semibold text-[#1e2643] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity mb-12 inline-block"
                >
                    ← Back to account
                </Link>
                <h1 className="text-3xl font-light text-[#1e2643] serif uppercase tracking-wide mb-8">
                    Manage addresses
                </h1>
                <p className="text-[#1e2643]/60 text-sm mb-10">
                    Add, edit or remove your shipping and billing addresses. This page can be expanded with address forms and listing.
                </p>
                <Link
                    href="/profile"
                    className="inline-block px-8 py-4 border border-[#1e2643]/20 text-[#1e2643] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1e2643]/5 transition-colors"
                >
                    Back to account
                </Link>
            </div>
        </div>
    );
}

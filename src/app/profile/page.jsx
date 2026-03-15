'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/login?redirect=/profile');
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

    const displayName = user?.firstName || user?.name || 'there';

    return (
        <div className="min-h-screen bg-white pt-36 lg:pt-40 pb-24 flex flex-col">
            <div className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col">
                {/* Top left: Logout */}
                <div className="mb-8 lg:mb-12">
                    <button
                        onClick={() => {
                            logout();
                            router.push('/');
                        }}
                        className="text-[11px] font-semibold text-[#1e2643] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
                    >
                        Logout
                    </button>
                </div>

                {/* Title + welcome - centered, more breathing room */}
                <div className="text-center mb-16 lg:mb-24">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1e2643] serif uppercase tracking-wide mb-4">
                        My account
                    </h1>
                    <p className="text-[#1e2643]/80 text-lg md:text-xl">
                        Welcome back, {displayName}!
                    </p>
                </div>

                {/* Two columns: Orders | Addresses - full width, card-style sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 flex-1">
                    {/* Left: My orders */}
                    <section className="min-h-[280px] lg:min-h-[320px] border border-[#1e2643]/10 bg-[#1e2643]/[0.02] p-8 lg:p-12 flex flex-col">
                        <h2 className="text-[11px] font-bold text-[#1e2643] uppercase tracking-[0.25em] mb-6">
                            My orders
                        </h2>
                        <p className="text-[#1e2643]/60 text-[15px] leading-relaxed flex-1">
                            You haven&apos;t placed any orders yet
                        </p>
                    </section>

                    {/* Right: Addresses */}
                    <section className="min-h-[280px] lg:min-h-[320px] border border-[#1e2643]/10 bg-[#1e2643]/[0.02] p-8 lg:p-12 flex flex-col">
                        <h2 className="text-[11px] font-bold text-[#1e2643] uppercase tracking-[0.25em] mb-6">
                            No addresses
                        </h2>
                        <p className="text-[#1e2643]/60 text-[15px] leading-relaxed mb-8">
                            No addresses are currently saved
                        </p>
                        <Link
                            href="/profile/addresses"
                            className="inline-block w-full md:w-auto px-10 py-4 bg-[#1e2643] text-white text-[10px] font-bold uppercase tracking-[0.2em] text-center hover:opacity-90 transition-opacity mt-auto"
                        >
                            MANAGE ADDRESSES
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
}

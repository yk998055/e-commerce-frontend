'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminRoute from '@/components/AdminRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import api from '@/lib/axios';
import { DASHBOARD_TITLE } from '@/lib/constants';

function DashboardContent() {
    const [stats, setStats] = useState({ totalProducts: 0, totalCategories: 0, activeProducts: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products/admin/all?limit=1000'),
                api.get('/categories/admin'),
            ]);
            const products = prodRes.data.data?.products || [];
            const categories = catRes.data.data || [];
            setStats({
                totalProducts: products.length,
                totalCategories: categories.length,
                activeProducts: products.filter((p) => p.isActive).length,
            });
        } catch (err) {
            // fail silently
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner size="lg" text="Loading dashboard..." />;

    const cards = [
        {
            label: 'Total Products',
            value: stats.totalProducts,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            gradient: 'from-violet-500 to-purple-600',
            shadow: 'shadow-violet-500/20',
        },
        {
            label: 'Total Categories',
            value: stats.totalCategories,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            gradient: 'from-fuchsia-500 to-pink-600',
            shadow: 'shadow-fuchsia-500/20',
        },
        {
            label: 'Active Products',
            value: stats.activeProducts,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            gradient: 'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-500/20',
        },
    ];

    return (
        <div className="min-h-screen bg-white py-20 font-['Inter']">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                <div className="mb-16 border-b border-[#1e2643]/5 pb-10">
                    <h1 className="text-5xl font-normal text-[#1e2643] serif tracking-tight">
                        {DASHBOARD_TITLE}
                    </h1>
                    <p className="text-[#1e2643]/40 mt-4 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-[#1e2643] rounded-full animate-pulse" />
                        Curating Excellence
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-fadeIn">
                    {cards.map((card) => (
                        <div key={card.label} className="group bg-white border border-[#1e2643]/5 p-10 hover:border-[#1e2643]/10 transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
                            {/* Subtle Accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FEE6A9]/[0.02] rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

                            <div className="relative z-10">
                                <div className="text-[#1e2643]/20 mb-8 transition-colors group-hover:text-[#1e2643]">
                                    {card.icon}
                                </div>
                                <p className="text-5xl font-light text-[#1e2643] serif mb-2">
                                    {card.value}
                                </p>
                                <p className="text-[10px] font-black text-[#1e2643]/30 uppercase tracking-[0.3em]">
                                    {card.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Section */}
                <div className="space-y-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xs font-black text-[#1e2643]/40 uppercase tracking-[0.4em]">
                            Gallery Management
                        </h2>
                        <div className="flex-1 h-px bg-[#FEE6A9]/5" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <Link
                            href="/admin/products"
                            className="group flex items-center gap-8 p-10 bg-white border border-[#1e2643]/5 transition-all duration-500 hover:border-[#1e2643]/20 hover:shadow-xl"
                        >
                            <div className="w-16 h-16 bg-[#FEE6A9] flex items-center justify-center text-[#1e2643] transition-transform group-hover:scale-105 duration-500">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[#1e2643] font-normal text-2xl serif mb-1">Products</p>
                                <p className="text-[10px] font-bold text-[#1e2643]/30 uppercase tracking-widest">Master Collection</p>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 text-[#1e2643]">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </Link>

                        <Link
                            href="/admin/categories"
                            className="group flex items-center gap-8 p-10 bg-white border border-[#1e2643]/5 transition-all duration-500 hover:border-[#1e2643]/20 hover:shadow-xl"
                        >
                            <div className="w-16 h-16 bg-[#FEE6A9] flex items-center justify-center text-[#1e2643] transition-transform group-hover:scale-105 duration-500">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[#1e2643] font-normal text-2xl serif mb-1">Categories</p>
                                <p className="text-[10px] font-bold text-[#1e2643]/30 uppercase tracking-widest">Curation Structure</p>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 text-[#1e2643]">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <AdminRoute>
            <DashboardContent />
        </AdminRoute>
    );
}

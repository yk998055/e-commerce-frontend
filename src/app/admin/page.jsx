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
        <div className="min-h-screen bg-[#FEE6A1] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-4xl font-black text-[#1e2643] tracking-tight">{DASHBOARD_TITLE}</h1>
                    <p className="text-[#1e2643]/60 mt-2 font-semibold italic">Welcome back! Here&apos;s your store overview.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-fadeIn">
                    {cards.map((card) => (
                        <div key={card.label} className="bg-white/40 backdrop-blur-md border border-[#1e2643]/10 rounded-3xl p-8 hover:border-[#1e2643]/20 transition-all shadow-xl shadow-[#1e2643]/5">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg`}>
                                    {card.icon}
                                </div>
                            </div>
                            <p className="text-4xl font-black text-[#1e2643]">{card.value}</p>
                            <p className="text-[#1e2643]/60 text-xs font-black uppercase tracking-widest mt-2">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <h2 className="text-xl font-black text-[#1e2643] mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-[#1e2643] rounded-full" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Link
                        href="/admin/products"
                        className="group flex items-center gap-6 p-6 rounded-3xl bg-white/40 backdrop-blur-md border border-[#1e2643]/10 hover:border-[#1e2643]/30 transition-all shadow-lg hover:shadow-xl shadow-[#1e2643]/5"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-[#1e2643] flex items-center justify-center text-[#FEE6A1] group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[#1e2643] font-black text-lg group-hover:translate-x-1 transition-transform">Manage Products</p>
                            <p className="text-[#1e2643]/50 text-sm font-semibold">Add, edit, or remove products</p>
                        </div>
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="group flex items-center gap-6 p-6 rounded-3xl bg-white/40 backdrop-blur-md border border-[#1e2643]/10 hover:border-[#1e2643]/30 transition-all shadow-lg hover:shadow-xl shadow-[#1e2643]/5"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-[#1e2643] flex items-center justify-center text-[#FEE6A1] group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[#1e2643] font-black text-lg group-hover:translate-x-1 transition-transform">Manage Categories</p>
                            <p className="text-[#1e2643]/50 text-sm font-semibold">Organize your product categories</p>
                        </div>
                    </Link>
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LOGIN_TITLE, LOGIN_SUBTITLE } from '@/lib/constants';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push('/admin');
        }
    }, [authLoading, isAuthenticated, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(email, password);
            if (data.data.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;
    if (isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-[#FEE6A1] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[#1e2643]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[#1e2643]/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative w-full max-w-md animate-fadeIn">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 rounded-3xl bg-[#1e2643] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#1e2643]/20">
                        <svg className="w-10 h-10 text-[#FEE6A1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-[#1e2643] tracking-tight">{LOGIN_TITLE}</h1>
                    <p className="text-[#1e2643]/60 mt-3 font-semibold">{LOGIN_SUBTITLE}</p>
                </div>

                {/* Form Card */}
                <div className="bg-white/40 backdrop-blur-2xl border border-[#1e2643]/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-[#1e2643]/5">
                    {error && (
                        <div className="mb-8 px-5 py-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3 animate-shake">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-xs font-black text-[#1e2643]/40 uppercase tracking-widest mb-3 ml-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@example.com"
                                className="w-full px-5 py-4 rounded-2xl bg-[#1e2643]/5 border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643]/30 focus:outline-none focus:ring-4 focus:ring-[#1e2643]/10 focus:border-[#1e2643]/20 transition-all font-semibold"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-black text-[#1e2643]/40 uppercase tracking-widest mb-3 ml-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-5 py-4 rounded-2xl bg-[#1e2643]/5 border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643]/30 focus:outline-none focus:ring-4 focus:ring-[#1e2643]/10 focus:border-[#1e2643]/20 transition-all font-semibold"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4.5 rounded-2xl bg-[#1e2643] hover:bg-[#1e2643]/90 text-[#FEE6A1] font-black tracking-wide transition-all shadow-xl shadow-[#1e2643]/10 hover:shadow-[#1e2643]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Sign In
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 7l5 5-5 5" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

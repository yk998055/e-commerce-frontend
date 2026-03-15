'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LOGIN_TITLE, LOGIN_SUBTITLE } from '@/lib/constants';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '';

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            if (redirectTo && redirectTo.startsWith('/')) {
                router.push(redirectTo);
            } else {
                router.push('/admin');
            }
        }
    }, [authLoading, isAuthenticated, router, redirectTo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(email, password);
            if (data.data.user.role === 'admin' && !redirectTo) {
                router.push('/admin');
            } else if (redirectTo && redirectTo.startsWith('/')) {
                router.push(redirectTo);
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
        <div className="w-full max-w-sm space-y-12 text-center animate-fadeIn">
            {/* Header Container */}
            <div className="space-y-6">
                <h1 className="text-4xl font-normal text-[#1e2643] serif tracking-tight">
                    Login
                </h1>
                <p className="text-[#1e2643] text-[14px] font-normal leading-relaxed">
                    Please enter your e-mail and password:
                </p>
            </div>

            {error && (
                <div className="p-4 rounded-none bg-rose-50 border border-rose-100 text-[#1e2643] text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 animate-shake">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 text-left">
                <div className="space-y-4">
                    {/* Email Input */}
                    <div className="relative group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-5 py-4 bg-white border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643] focus:outline-none focus:border-[#1e2643]/30 transition-all font-normal text-[14px]"
                            placeholder="Email"
                        />
                    </div>

                    {/* Password Input with Forgot link inside */}
                    <div className="relative group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-5 py-4 bg-white border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643] focus:outline-none focus:border-[#1e2643]/30 transition-all font-normal text-[14px]"
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-[12px] text-[#1e2643] hover:underline transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>
                </div>

                <div className="space-y-10 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-[#FEE6A9] text-[#1e2643] text-[12px] font-black uppercase tracking-[0.3em] transition-all duration-500 hover:brightness-110 disabled:opacity-70 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Verifying...
                            </>
                        ) : (
                            'LOGIN'
                        )}
                    </button>

                    <div className="text-center">
                        <p className="text-[13px] text-[#1e2643]">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => router.push('/register')}
                                className="text-[#1e2643] font-bold hover:underline underline-offset-4"
                            >
                                Create one
                            </button>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-12 font-['Inter']">
            <Suspense fallback={null}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
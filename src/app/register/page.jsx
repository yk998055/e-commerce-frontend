'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push('/');
        }
    }, [authLoading, isAuthenticated, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(formData);
            router.push('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;
    if (isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-12 font-['Inter']">
            <div className="w-full max-w-sm space-y-12 text-center animate-fadeIn">
                {/* Header Container */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-normal text-[#1e2643] serif tracking-tight">
                        Register
                    </h1>
                    <p className="text-[#1e2643] text-[14px] font-normal leading-relaxed">
                        Please fill in the information below:
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
                        {/* First Name Input */}
                        <div className="relative group">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-white border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643] focus:outline-none focus:border-[#1e2643]/30 transition-all font-normal text-[14px]"
                                placeholder="First name"
                            />
                        </div>

                        {/* Last Name Input */}
                        <div className="relative group">
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-white border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643] focus:outline-none focus:border-[#1e2643]/30 transition-all font-normal text-[14px]"
                                placeholder="Last name"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="relative group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-white border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643] focus:outline-none focus:border-[#1e2643]/30 transition-all font-normal text-[14px]"
                                placeholder="Email"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-white border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643] focus:outline-none focus:border-[#1e2643]/30 transition-all font-normal text-[14px]"
                                placeholder="Password"
                            />
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
                                    Creating account...
                                </>
                            ) : (
                                'CREATE MY ACCOUNT'
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-[13px] text-[#1e2643]">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => router.push('/login')}
                                    className="text-[#1e2643] font-bold hover:underline underline-offset-4"
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

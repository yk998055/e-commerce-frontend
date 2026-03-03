'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SITE_NAME } from '@/lib/constants';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Clothing', href: '/products?category=Clothing' },
        { name: 'Festive', href: '/products?category=Festive' },
        { name: 'New Collection', href: '/products?category=New+Collection' },
        { name: 'Gifting', href: '/products?category=Gifting' },
        { name: 'Sale', href: '/products?category=Sale' },
        { name: 'Home Furnishing', href: '/products?category=Home+Furnishing' },
        { name: 'Menswear', href: '/products?category=Menswear' },
    ];

    return (
        <header className="fixed top-0 z-50 w-full transition-all duration-300">
            {/* Main Navbar */}
            <nav className={`w-full bg-white transition-all duration-300 ${scrolled ? 'shadow-sm py-2 border-b border-gray-100' : 'py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Main Header Row */}
                    <div className="flex items-center justify-between relative">
                        {/* Desktop Navigation Links (Left) */}
                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.slice(0, 4).map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[12px] font-bold text-[#1e2643]/80 hover:text-[#B8860B] transition-all uppercase tracking-widest"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Centered Logo */}
                        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="flex items-center gap-2 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 aspect-square rounded-full overflow-hidden border border-[#1e2643]/10 shadow-sm transition-transform duration-500 group-hover:scale-110 bg-white">
                                    <img src="/logo.png" alt="CHHAAPAYA" className="w-full h-full object-cover" />
                                </div>
                                <h1 className="hidden sm:block text-xl md:text-2xl font-light text-[#1e2643] tracking-[0.3em] uppercase serif">
                                    CHHAAPAYA
                                </h1>
                            </div>
                        </Link>

                        {/* Right Section (Nav + Icons) */}
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-6">
                                {navLinks.slice(4).map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-[12px] font-bold text-[#1e2643]/80 hover:text-[#B8860B] transition-all uppercase tracking-widest"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Utility Icons */}
                            <div className="flex items-center gap-4">
                                <button className="text-[#1e2643]/80 hover:text-[#B8860B] transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                                <Link href="/profile" className="text-[#1e2643]/80 hover:text-[#B8860B] transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </Link>
                                <Link href="/cart" className="relative text-[#1e2643]/80 hover:text-[#B8860B] transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </Link>
                            </div>

                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden p-2 text-[#1e2643]"
                            >
                                {mobileOpen ? (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="px-6 py-8 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block text-sm font-semibold text-[#1e2643] hover:text-[#5D2D1B]"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleProtectedClick = (href) => {
        if (isAuthenticated) {
            router.push(href);
        } else {
            router.push('/login');
        }
    };

    const navLinks = [
        { name: 'Clothing', href: '/products?category=Clothing' },
        { name: 'Festive', href: '/products?category=Festive' },
        { name: 'New Collection', href: '/products?category=New' },
        { name: 'Gifting', href: '/products?category=Gifting' },
        { name: 'Sale', href: '/products?category=Sale' },
        { name: 'Women\'s wear', href: '/products?category=Womenswear' },
    ];

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 bg-white ${scrolled ? 'shadow-sm' : ''}`}>
            {/* Announcement Bar */}
            <div className={`w-full bg-[#FEE6A9] text-[#1e2643] flex justify-center items-center overflow-hidden transition-all duration-300 ${scrolled ? 'h-0 opacity-0' : 'h-8 opacity-100'}`}>
                <p className={`text-[9px] sm:text-[10px] font-medium tracking-[0.2em] uppercase transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
                    Free Shipping on All Orders
                </p>
            </div>

            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between relative h-10 md:h-12">

                    {/* Left: Hamburger & Desktop Links? BAGH has hamburger on desktop too? No, usually icons. 
                        Looking at screenshot: Hamburger is on left, Logo in center, Icons on right. 
                    */}
                    <div className="flex items-center">
                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 text-[#1e2643] hover:opacity-70 transition-opacity lg:hidden"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>

                    {/* Center: Logo */}
                    <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
                        <img src="/chhaapaya-logo-circle.svg" alt="CHHAAPAYA" className="h-8 md:h-10 w-auto object-contain" />
                        <span className="hidden sm:block text-2xl font-light tracking-[0.2em] text-[#1e2643] serif uppercase">
                            CHHAAPAYA
                        </span>
                    </Link>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-2 md:gap-4 ml-auto lg:ml-0">
                        <button className="p-2 text-[#1e2643] hover:opacity-70 transition-opacity hidden sm:block">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleProtectedClick('/profile')}
                            className="p-2 text-[#1e2643] hover:opacity-70 transition-opacity"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleProtectedClick('/cart')}
                            className="p-2 text-[#1e2643] hover:opacity-70 transition-opacity"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Desktop Navigation */}
                <div className="hidden lg:flex justify-center items-center gap-10 mt-1 pt-2">
                    {navLinks.map((link) => (
                        link.name === 'Clothing' ? (
                            <div key={link.name} className="group flex items-center pb-4 -mb-4">
                                <Link
                                    href={link.href}
                                    className="text-[11px] font-bold text-[#1e2643] hover:text-[#1e2643] transition-colors uppercase tracking-[0.2em] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-[#1e2643] after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:origin-left"
                                >
                                    {link.name}
                                </Link>

                                {/* Mega Menu */}
                                <div className="absolute left-0 top-full w-full bg-white border-t border-[#1e2643]/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60]">
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-between gap-8 h-[480px]">
                                        {/* Left side: Columns */}
                                        <div className="flex gap-16 lg:gap-24">
                                            {/* Women Column */}
                                            <div>
                                                <h4 className="text-[13px] font-medium text-[#1e2643]/70 mb-6 serif tracking-wider">Women</h4>
                                                <ul className="space-y-4">
                                                    {['Kurta', 'Pant', 'Dress', 'Kaftan', 'Top', '3 pcs set', '2 pcs set', 'Printed Fabric'].map(item => (
                                                        <li key={item}><Link href={`/products?category=${encodeURIComponent(item)}`} className="text-[13px] text-[#1e2643] hover:text-[#1e2643]/50 transition-colors tracking-wide">{item}</Link></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Right side: Images */}
                                        <div className="flex gap-8 h-full pr-10">
                                            <Link href="/products?category=Sarees" className="group/image cursor-pointer block h-full flex flex-col items-center">
                                                <div className="w-[280px] h-full overflow-hidden bg-[#FEE6A9]/20 relative">
                                                    <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop" alt="Saree Drapes" className="w-full h-full object-cover transition-transform duration-1000 group-hover/image:scale-105" />
                                                </div>
                                                <p className="mt-5 text-[14px] font-medium text-[#1e2643] serif tracking-wide">Saree Drapes</p>
                                            </Link>
                                            <Link href="/products?category=Festive" className="group/image cursor-pointer block h-full flex flex-col items-center">
                                                <div className="w-[280px] h-full overflow-hidden bg-[#FEE6A9]/20 relative">
                                                    <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop" alt="Feel Festive" className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover/image:scale-105" />
                                                </div>
                                                <p className="mt-5 text-[14px] font-medium text-[#1e2643] serif tracking-wide">Feel Festive</p>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[11px] font-bold text-[#1e2643] hover:text-[#1e2643]/70 transition-colors uppercase tracking-[0.2em]"
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                </div>
            </nav>

            {/* Side Menu Drawer */}
            <div className={`fixed inset-0 z-50 transition-visibility duration-300 ${mobileOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMobileOpen(false)}
                />

                {/* Drawer Content */}
                <div className={`absolute top-0 left-0 bottom-0 w-[300px] bg-white shadow-2xl transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-10">
                            <span className="text-xl font-light tracking-widest text-[#1e2643] serif uppercase">Menu</span>
                            <button onClick={() => setMobileOpen(false)} className="p-2 text-[#1e2643]">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-sm font-medium text-[#1e2643] hover:text-[#1e2643] transition-colors uppercase tracking-[0.2em]"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto pt-10 border-t border-gray-100">
                            <p className="text-[10px] text-[#1e2643]/40 uppercase tracking-widest mb-4">Account</p>
                            <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-[#1e2643] hover:text-[#1e2643] mb-4">Login</Link>
                            <Link href="/register" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-[#1e2643] hover:text-[#1e2643]">Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

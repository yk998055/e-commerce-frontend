import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#FEE6A9] text-[#1e2643] pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-8 lg:col-span-2 lg:pr-8">
                        <div className="flex flex-col gap-4">
                            <Link href="/" className="flex items-center gap-3 w-fit">
                                <img src="/chhaapaya-logo-circle.svg" alt="CHHAAPAYA" className="h-8 md:h-10 w-auto object-contain object-left" />
                                <span className="text-3xl font-light tracking-[0.2em] serif uppercase text-[#1e2643]">CHHAAPAYA</span>
                            </Link>
                            <p className="text-[#1e2643]/70 text-sm leading-relaxed serif italic max-w-xs transition-opacity hover:opacity-100">
                                Celebrate the heritage of Indian crafts through our carefully curated collections.
                            </p>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#1e2643]/50 mb-8">Shop</h4>
                        <ul className="space-y-5">
                            <li><Link href="/products" className="text-sm text-[#1e2643] hover:opacity-80 transition-colors duration-300 font-medium tracking-wide">All Products</Link></li>
                            <li><Link href="/products?category=Festive" className="text-sm text-[#1e2643] hover:opacity-80 transition-colors duration-300 font-medium tracking-wide">Festive Collections</Link></li>
                            <li><Link href="/products?category=New" className="text-sm text-[#1e2643] hover:opacity-80 transition-colors duration-300 font-medium tracking-wide">New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* About Bagh */}
                    <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#1e2643]/50 mb-8">About</h4>
                        <ul className="space-y-5">
                            <li><Link href="/about" className="text-sm text-[#1e2643] hover:opacity-80 transition-colors duration-300 font-medium tracking-wide">Our Story</Link></li>
                            <li><Link href="/contact" className="text-sm text-[#1e2643] hover:opacity-80 transition-colors duration-300 font-medium tracking-wide">Contact Us</Link></li>
                            <li><Link href="/terms" className="text-sm text-[#1e2643] hover:opacity-80 transition-colors duration-300 font-medium tracking-wide">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#1e2643]/50 mb-8">Legal</h4>
                        <ul className="space-y-5">
                            <li><Link href="/privacy" className="text-sm text-[#1e2643] hover:opacity-80 transition-colors duration-300 font-medium tracking-wide">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-sm text-[#1e2643] hover:opacity-80 transition-colors duration-300 font-medium tracking-wide">Terms of Service</Link></li>
                            <li><Link href="/shipping" className="text-sm text-[#1e2643] hover:opacity-80 transition-colors duration-300 font-medium tracking-wide">Shipping & Delivery</Link></li>
                            <li><Link href="/returns" className="text-sm text-[#1e2643] hover:opacity-80 transition-colors duration-300 font-medium tracking-wide">Return & Exchanges</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter/Social */}
                    <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#1e2643]/50 mb-8">Follow Us</h4>
                        <div className="flex gap-4">
                            {[
                                {
                                    name: 'Instagram',
                                    href: '#',
                                    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.012.07-4.85.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                },
                                {
                                    name: 'Facebook',
                                    href: '#',
                                    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.95.925-1.95 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                },
                                {
                                    name: 'LinkedIn',
                                    href: '#',
                                    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                }
                            ].map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    className="group relative flex items-center justify-center p-2 rounded-full border border-[#1e2643]/10 hover:border-[#1e2643] text-[#1e2643] hover:opacity-80 transition-all duration-300"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1e2643] text-white text-[9px] font-bold uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#1e2643]">
                                        {social.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-[#1e2643]/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#1e2643]/40">
                        &copy; {currentYear} CHHAAPAYA. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 opacity-30">
                        <span className="text-[9px] font-bold tracking-widest uppercase">Visa</span>
                        <span className="text-[9px] font-bold tracking-widest uppercase">Mastercard</span>
                        <span className="text-[9px] font-bold tracking-widest uppercase">Razorpay</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

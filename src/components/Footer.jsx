import Link from 'next/link';
import { SITE_NAME, FOOTER_TEXT } from '@/lib/constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#FEE6A9] text-[#1e2643] pt-20 pb-10 border-t border-[#1e2643]/10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="CHHAAPAYA" className="w-10 h-10 object-contain" />
                            <span className="text-2xl font-light tracking-tighter serif">CHHAAPAYA</span>
                        </div>
                        <p className="text-[#1e2643]/60 text-sm leading-relaxed serif italic max-w-[200px]">
                            Bringing the age-old crafts of our country to your doorstep.
                        </p>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1e2643]/40 mb-6">Shop</h4>
                        <ul className="space-y-4">
                            <li><Link href="/products" className="text-sm hover:text-[#B8860B] transition-colors duration-300 font-medium tracking-tight">All Collections</Link></li>
                            <li><Link href="/products?category=Festive" className="text-sm hover:text-[#B8860B] transition-colors duration-300 font-medium tracking-tight">Festive Edit</Link></li>
                            <li><Link href="/products?category=New" className="text-sm hover:text-[#B8860B] transition-colors duration-300 font-medium tracking-tight">New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Help Section */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1e2643]/40 mb-6">Help</h4>
                        <ul className="space-y-4">
                            <li><Link href="/contact" className="text-sm hover:text-[#B8860B] transition-colors duration-300 font-medium tracking-tight">Contact Us</Link></li>
                            <li><Link href="/shipping" className="text-sm hover:text-[#B8860B] transition-colors duration-300 font-medium tracking-tight">Shipping & Returns</Link></li>
                            <li><Link href="/faq" className="text-sm hover:text-[#B8860B] transition-colors duration-300 font-medium tracking-tight">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter/Social */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1e2643]/40 mb-6">Stay Connected</h4>
                        <div className="flex gap-4">
                            {['IG', 'FB', 'TW'].map((social) => (
                                <div key={social} className="w-10 h-10 rounded-full border border-[#1e2643]/10 flex items-center justify-center text-[10px] font-bold hover:bg-[#1e2643] hover:text-[#FEE6A9] transition-all duration-500 cursor-pointer">
                                    {social}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-[#1e2643]/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e2643]/40">
                        &copy; {currentYear} CHHAAPAYA. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 opacity-40 grayscale">
                        <span className="text-[10px] font-black tracking-widest uppercase">Amex</span>
                        <span className="text-[10px] font-black tracking-widest uppercase">Visa</span>
                        <span className="text-[10px] font-black tracking-widest uppercase">Mastercard</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

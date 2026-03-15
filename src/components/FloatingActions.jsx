'use client';

import { useState } from 'react';

export default function FloatingActions() {
    const [currency, setCurrency] = useState({ code: 'INR', flag: '🇮🇳' });
    const [isOpen, setIsOpen] = useState(false);

    const currencies = [
        { code: 'INR', flag: '🇮🇳', label: 'Indian Rupee' },
        { code: 'USD', flag: '🇺🇸', label: 'US Dollar' },
        { code: 'GBP', flag: '🇬🇧', label: 'British Pound' },
        { code: 'EUR', flag: '🇪🇺', label: 'Euro' },
    ];

    return (
        <>
            {/* Currency Selector */}
            <div className="fixed bottom-10 left-6 z-[60]">
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full shadow-sm hover:border-[#FEE6A9]/30 transition-all duration-300"
                    >
                        <span className="text-sm leading-none">{currency.flag}</span>
                        <span className="text-[10px] font-bold text-[#FEE6A9] uppercase tracking-[0.2em]">{currency.code}</span>
                        <svg className={`w-3 h-3 text-[#FEE6A9] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isOpen && (
                        <div className="absolute bottom-full left-0 mb-4 w-56 bg-white border border-gray-50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {currencies.map((c) => (
                                <button
                                    key={c.code}
                                    onClick={() => {
                                        setCurrency(c);
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none group"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl">{c.flag}</span>
                                        <div>
                                            <p className="text-[10px] font-bold text-[#FEE6A9] uppercase tracking-widest">{c.code}</p>
                                            <p className="text-[9px] text-[#1e2643]/50 uppercase tracking-tighter">{c.label}</p>
                                        </div>
                                    </div>
                                    {currency.code === c.code && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FEE6A9]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* WhatsApp Button - use NEXT_PUBLIC_WHATSAPP_NUMBER (e.g. 919876543210) to set your number */}
            <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-10 right-6 z-[60] group"
                title="Chat on WhatsApp"
                aria-label="Chat on WhatsApp"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-30" />
                    <div className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                    </div>
                </div>
            </a>
        </>
    );
}

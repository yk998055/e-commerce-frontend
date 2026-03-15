'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
    {
        id: 'heritage',
        image: 'https://images.unsplash.com/photo-1595991209266-5ff5a3a2f008?w=1600',
        title: 'CHHAAPAYA',
        subtitle: 'heritage | 2024',
        cta: 'EXPLORE NOW',
        link: '/products'
    },
    {
        id: 'festive',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2070&auto=format&fit=crop',
        subtitle: 'New Collection',
        title: 'FESTIVE EDIT',
        link: '/products?category=Festive'
    },
];

export default function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[100vh] mt-20 md:mt-24 w-full overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                >
                    {/* Background Image */}
                    <div
                        className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out ${isMounted && index === currentSlide ? 'scale-100 blur-0' : 'scale-[1.05] blur-sm'}`}
                        style={{
                            backgroundImage: `url(${slide.image})`
                        }}
                    />

                    {/* Overlay for better text readability if needed, but BAGH is very clean */}
                    <div className="absolute inset-0 bg-white/20" />

                    {/* Content */}
                    <div className="relative h-full flex items-center justify-center text-center px-4">
                        <div className="max-w-4xl space-y-8">
                            <span className={`block text-[#1e2643] text-xs md:text-sm font-bold tracking-[0.4em] uppercase transition-all duration-1000 transform ${isMounted && index === currentSlide ? 'translate-y-0 opacity-100 delay-[200ms]' : 'translate-y-8 opacity-0 delay-0'}`}>
                                {slide.subtitle}
                            </span>
                            <h2 className={`text-4xl md:text-7xl font-light text-[#1e2643] tracking-[0.1em] serif uppercase transition-all duration-1000 transform ${isMounted && index === currentSlide ? 'translate-y-0 opacity-100 delay-[400ms]' : 'translate-y-12 opacity-0 delay-0'}`}>
                                {slide.title}
                            </h2>
                            <div className={`pt-8 transition-all duration-1000 transform ${isMounted && index === currentSlide ? 'translate-y-0 opacity-100 delay-[600ms]' : 'translate-y-12 opacity-0 delay-0'}`}>
                                <Link
                                    href={slide.link || '/products'}
                                    className="inline-block bg-white text-[#1e2643] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#FEE6A9] hover:text-[#1e2643] transition-all duration-300 shadow-xl"
                                >
                                    {slide.cta || 'Shop Now'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Slide Indicators - Minimal Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-[#1e2643] scale-125' : 'bg-[#1e2643]/30'}`}
                    />
                ))}
            </div>

            {/* Navigation Arrows - Optional but keeping it minimal */}
            <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-8 top-1/2 -translate-y-1/2 p-2 text-[#1e2643]/50 hover:text-[#1e2643] transition-colors hidden md:block"
            >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-2 text-[#1e2643]/50 hover:text-[#1e2643] transition-colors hidden md:block"
            >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </section>
    );
}

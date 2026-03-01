'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1595991209266-5ff5a3a2f008?w=1600',
        title: 'CHHAAPAYA',
        subtitle: 'heritage | 2024',
        cta: 'EXPLORE NOW',
        link: '/products?category=artisan-apparel'
    },
    {
        image: 'https://images.unsplash.com/photo-1610030469915-9a08fa996eec?w=1600',
        title: 'NAQSH',
        subtitle: 'hand-crafted | 2024',
        cta: 'DISCOVER',
        link: '/products?category=hand-blocked-textiles'
    }
];

export default function HeroBanner({ products = [] }) {
    const [current, setCurrent] = useState(0);

    const displaySlides = products.length > 0
        ? products.slice(0, 5).map(p => ({
            image: p.images?.[0] || 'https://images.unsplash.com/photo-1595991209266-5ff5a3a2f008?w=1600',
            title: p.name,
            subtitle: p.category?.name || 'exclusive',
            cta: 'SHOP NOW',
            link: `/products/${p._id}`,
            price: p.discountPrice || p.price
        }))
        : slides;

    useEffect(() => {
        if (displaySlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % displaySlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [displaySlides.length]);

    return (
        <section className="relative w-full h-[95vh] overflow-hidden bg-white">
            {displaySlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Image Layer */}
                    <div className="absolute inset-0">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-[10000ms] ease-out"
                            style={index === current ? { transform: 'scale(1.05)' } : {}}
                        />
                        {/* Dark Overlay for better text readability if needed, though Bagh is clear */}
                        <div className="absolute inset-0 bg-black/5" />
                    </div>

                    {/* Left Bottom: SHOP NOW Button & Info */}
                    <div className="absolute bottom-24 left-10 md:left-32 z-20 space-y-4">
                        <div className="space-y-1">
                            <span className="text-white text-xs font-bold uppercase tracking-[0.4em] drop-shadow-md">
                                {slide.subtitle}
                            </span>
                            <h3 className="text-white text-3xl md:text-5xl font-light serif drop-shadow-lg max-w-xl leading-tight">
                                {slide.title}
                            </h3>
                        </div>
                        <Link
                            href={slide.link}
                            className="inline-block px-10 py-3 bg-white text-[#1e2643] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#1e2643] hover:text-white transition-all duration-700 shadow-lg"
                        >
                            SHOP NOW
                        </Link>
                    </div>

                    {/* Right Bottom: Huge SALE Text */}
                    <div className="absolute bottom-16 right-10 md:right-32 z-20 text-right pointer-events-none select-none">
                        <h2
                            className="text-[10rem] md:text-[22rem] font-extralight text-white leading-none tracking-tighter serif opacity-80"
                            style={{ textShadow: '0 20px 50px rgba(0,0,0,0.05)' }}
                        >
                            SALE
                        </h2>
                    </div>
                </div>
            ))}

            {/* Slide Indicators - Minimal Dots at Right Bottom */}
            {displaySlides.length > 1 && (
                <div className="absolute bottom-16 right-10 md:right-32 flex gap-3 z-30 items-center">
                    {displaySlides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`transition-all duration-500 rounded-full ${i === current
                                ? 'w-2 h-2 bg-white blur-[0.5px]'
                                : 'w-2 h-2 bg-transparent border border-white/40 hover:border-white'}`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

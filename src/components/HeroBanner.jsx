'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
    {
        image: '/luxury_ethnic_wear_lifestyle_1772365470472.png', // This will be the absolute path or relative depending on deployment
        title: 'NAQSH',
        subtitle: 'festive | 2024',
        cta: 'SHOP NOW',
        link: '/products?collection=festive'
    },
    {
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2000&auto=format&fit=crop',
        title: 'VIGNAV',
        subtitle: 'summer | 2024',
        cta: 'SHOP NOW',
        link: '/products?collection=summer'
    }
];

export default function HeroBanner() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full h-[95vh] overflow-hidden bg-white">
            {slides.map((slide, index) => (
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
                    </div>

                    {/* Left Bottom: SHOP NOW Button */}
                    <div className="absolute bottom-20 left-10 md:left-24 z-20">
                        <Link
                            href={slide.link}
                            className="inline-block px-12 py-4 bg-white text-[#1e2643] text-[12px] font-bold uppercase tracking-[0.4em] hover:bg-[#1e2643] hover:text-white transition-all duration-700 shadow-2xl"
                        >
                            {slide.cta}
                        </Link>
                    </div>

                    {/* Right Bottom: Huge SALE / Title Text */}
                    <div className="absolute bottom-10 right-10 md:right-24 z-20 text-right pointer-events-none">
                        <h2
                            className="text-[8rem] md:text-[18rem] font-light text-white leading-none tracking-tighter serif opacity-90"
                            style={{ textShadow: '4px 4px 30px rgba(0,0,0,0.1)' }}
                        >
                            SALE
                        </h2>
                    </div>
                </div>
            ))}

            {/* Slide Indicators - Hollow Circles as in image */}
            <div className="absolute bottom-24 right-10 md:right-24 flex gap-4 z-30 items-center">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`group relative p-2`}
                        aria-label={`Go to slide ${i + 1}`}
                    >
                        <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${i === current ? 'bg-white border-white scale-110' : 'bg-transparent border-white/60 hover:border-white'}`} />
                    </button>
                ))}
            </div>
        </section>
    );
}

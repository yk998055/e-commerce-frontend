'use client';

import { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductSlider({ products, title }) {
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const node = scrollRef.current;
        if (node) {
            node.addEventListener('scroll', checkScroll);
            // Initial check
            checkScroll();
            // Check on window resize
            window.addEventListener('resize', checkScroll);
            return () => {
                node.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, [products]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 group overflow-hidden">
            <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-black text-[#1e2643] mb-4 tracking-tight">{title}</h2>
                <div className="w-24 h-2 bg-[#1e2643] mx-auto rounded-full" />
            </div>

            <div className="relative">
                {/* Navigation Buttons */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-5 rounded-3xl bg-white/90 backdrop-blur-md border-2 border-[#1e2643]/10 text-[#1e2643] shadow-2xl hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden lg:flex items-center justify-center"
                        aria-label="Previous products"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-5 rounded-3xl bg-white/90 backdrop-blur-md border-2 border-[#1e2643]/10 text-[#1e2643] shadow-2xl hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden lg:flex items-center justify-center"
                        aria-label="Next products"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-12 pt-4 px-2"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {products.map((product) => (
                        <div key={product._id} className="min-w-[85vw] sm:min-w-[340px] md:min-w-[380px] snap-start transition-transform duration-500 hover:scale-[1.02]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Mobile Indicator (Optional subtle gradient fade) */}
                {!showLeftArrow && (
                    <div className="absolute left-0 top-0 bottom-12 w-16 bg-gradient-to-r from-[#FEE6A1] to-transparent pointer-events-none lg:hidden" />
                )}
                {!showRightArrow && (
                    <div className="absolute right-0 top-0 bottom-12 w-16 bg-gradient-to-l from-[#FEE6A1] to-transparent pointer-events-none lg:hidden" />
                )}
            </div>

            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>
    );
}

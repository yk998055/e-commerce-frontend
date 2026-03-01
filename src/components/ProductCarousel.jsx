'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { CURRENCY_SYMBOL } from '@/lib/constants';

const SkeletonCard = () => (
    <div className="bg-[#FEE6A9] border border-[#1e2643]/5 overflow-hidden animate-pulse">
        <div className="aspect-[3/4] bg-[#1e2643]/5" />
        <div className="p-6 space-y-4">
            <div className="h-4 bg-[#1e2643]/10 rounded w-1/4" />
            <div className="h-4 bg-[#1e2643]/10 rounded w-3/4" />
            <div className="h-6 bg-[#1e2643]/10 rounded w-1/2" />
            <div className="h-10 bg-[#1e2643]/10 rounded w-full" />
        </div>
    </div>
);

const CarouselCard = ({ product }) => {
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const discountPercentage = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
    const imgSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

    return (
        <div className="group bg-[#FEE6A9] border border-[#1e2643]/5 overflow-hidden transition-all duration-500 hover:shadow-2xl mx-2 h-full flex flex-col hover:scale-[1.02]">
            <div className="relative aspect-[3/4] overflow-hidden bg-white/50">
                <img
                    src={imgSrc}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                />

                {/* Badges */}
                {hasDiscount && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        {discountPercentage}% OFF
                    </div>
                )}
                {product.category?.name && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/80 backdrop-blur-md text-[#1e2643] text-[9px] font-bold uppercase tracking-widest border border-[#1e2643]/10 rounded-sm">
                        {product.category.name}
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col items-center text-center">
                <h3 className="text-[#1e2643] font-bold text-sm sm:text-base line-clamp-2 min-h-[2.5rem] mb-3 transition-colors duration-300 group-hover:text-[#1e2643]/80">
                    {product.name}
                </h3>

                <div className="flex items-center gap-3 mb-6">
                    {hasDiscount ? (
                        <>
                            <span className="text-[#1e2643] font-black text-lg">
                                {CURRENCY_SYMBOL}{product.discountPrice.toFixed(0)}
                            </span>
                            <span className="text-[#1e2643]/30 line-through text-sm">
                                {CURRENCY_SYMBOL}{product.price.toFixed(0)}
                            </span>
                        </>
                    ) : (
                        <span className="text-[#1e2643] font-black text-lg">
                            {CURRENCY_SYMBOL}{product.price.toFixed(0)}
                        </span>
                    )}
                </div>

                <Link
                    href={`/products/${product._id}`}
                    className="w-full py-2.5 bg-white border border-[#1e2643]/20 text-[#1e2643] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1e2643] hover:text-white transition-all duration-500"
                >
                    VIEW DETAILS
                </Link>
            </div>
        </div>
    );
};

export default function ProductCarousel({
    title = "Top Products",
    products = [],
    loading = false,
    error = null,
    autoSlideInterval = 3000
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const touchStartX = useRef(null);
    const containerRef = useRef(null);
    const timerRef = useRef(null);

    // Infinite loop requires cloned items for seamless transition
    // Clones on both ends
    const clonedItems = products.length > 0
        ? [...products.slice(-itemsPerView), ...products, ...products.slice(0, itemsPerView)]
        : [];

    const handleResize = useCallback(() => {
        const width = window.innerWidth;
        if (width < 640) setItemsPerView(1);
        else if (width < 1024) setItemsPerView(2);
        else if (width < 1280) setItemsPerView(3);
        else setItemsPerView(4);
    }, []);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    useEffect(() => {
        if (products.length > 0) {
            // Start at the first real item (skipping clones)
            setCurrentIndex(itemsPerView);
        }
    }, [products.length, itemsPerView]);

    const nextSlide = useCallback(() => {
        if (!isTransitioning) return;
        setCurrentIndex(prev => prev + 1);
    }, [isTransitioning]);

    const prevSlide = useCallback(() => {
        if (!isTransitioning) return;
        setCurrentIndex(prev => prev - 1);
    }, [isTransitioning]);

    // Timer setup
    useEffect(() => {
        if (!isPaused && products.length > itemsPerView) {
            timerRef.current = setInterval(nextSlide, autoSlideInterval);
        }
        return () => clearInterval(timerRef.current);
    }, [isPaused, nextSlide, autoSlideInterval, products.length, itemsPerView]);

    // Handle jump back/forward for infinite loop
    useEffect(() => {
        if (currentIndex === products.length + itemsPerView) {
            // Exited last real item into clones
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(itemsPerView);
            }, 300);
        } else if (currentIndex === 0) {
            // Exited first real item backwards into clones
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(products.length);
            }, 300);
        } else {
            setIsTransitioning(true);
        }
    }, [currentIndex, products.length, itemsPerView]);

    // Re-enable transition after teleport
    useEffect(() => {
        if (!isTransitioning) {
            const timer = setTimeout(() => setIsTransitioning(true), 10);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        setIsPaused(true);
    };

    const onTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        setIsPaused(false);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex items-center justify-between mb-10">
                    <div className="h-8 bg-[#4A3728]/10 rounded w-48 animate-pulse" />
                    <div className="h-6 bg-[#4A3728]/10 rounded w-20 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-16 text-center text-[#4A3728]/50 font-light italic">
                {error}
            </div>
        );
    }

    if (products.length === 0) return null;

    const actualDotsCount = products.length;

    return (
        <section className="relative max-w-7xl mx-auto px-6 py-16 group overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 border-b border-[#1e2643]/10 pb-6">
                <h2 className="text-2xl sm:text-3xl font-light text-[#1e2643] flex items-center gap-3 serif">
                    <span className="text-[#B8860B]">🔥</span> {title}
                </h2>
                <Link href="/products" className="text-xs font-bold text-[#1e2643]/60 hover:text-[#B8860B] transition-colors flex items-center gap-2 tracking-[0.2em] uppercase">
                    View All
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 7l5 5-5 5" />
                    </svg>
                </Link>
            </div>

            <div
                className="relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {/* Desktop Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-8 z-30 p-5 rounded-full bg-white/60 backdrop-blur-md border border-[#4A3728]/10 text-[#4A3728] hover:bg-[#4A3728] hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center shadow-xl"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-8 z-30 p-5 rounded-full bg-white/60 backdrop-blur-md border border-[#4A3728]/10 text-[#4A3728] hover:bg-[#4A3728] hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center shadow-xl"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Mobile Floating Arrows */}
                <div className="flex sm:hidden absolute top-1/2 -translate-y-1/2 w-full justify-between px-2 z-30 pointer-events-none">
                    <button
                        onClick={prevSlide}
                        className="p-3 rounded-full bg-white/80 border border-[#4A3728]/10 text-[#4A3728] pointer-events-auto"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="p-3 rounded-full bg-white/80 border border-[#4A3728]/10 text-[#4A3728] pointer-events-auto"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Carousel Track */}
                <div className="overflow-hidden">
                    <div
                        ref={containerRef}
                        className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                    >
                        {clonedItems.map((product, index) => (
                            <div
                                key={`${product._id}-${index}`}
                                className="px-1"
                                style={{ flex: `0 0 ${100 / itemsPerView}%` }}
                            >
                                <CarouselCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-3 mt-12">
                    {products.map((_, index) => {
                        const actualIndex = (currentIndex - itemsPerView + products.length) % products.length;
                        return (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index + itemsPerView)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${actualIndex === index ? 'w-10 bg-[#B8860B]' : 'w-4 bg-[#4A3728]/10 hover:bg-[#4A3728]/30'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

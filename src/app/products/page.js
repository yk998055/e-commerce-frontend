'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import CategoryTabs from '@/components/CategoryTabs';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

export default function ProductsPage() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    // Intersection Observer callback
    const lastProductElementRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    // Initial fetch for categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data || []);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products on page or category change
    useEffect(() => {
        const fetchProducts = async () => {
            if (page === 1) setLoading(true);
            else setLoadingMore(true);

            try {
                const url = activeCategory
                    ? `/products?category=${activeCategory}&page=${page}&limit=12`
                    : `/products?page=${page}&limit=12`;

                const res = await api.get(url);
                const newProducts = res.data.data?.products || [];
                const totalPages = res.data.data?.pagination?.pages || 1;

                setProducts(prev => page === 1 ? newProducts : [...prev, ...newProducts]);
                setHasMore(page < totalPages);
            } catch (err) {
                console.error('Error fetching products:', err);
                if (page === 1) setProducts([]);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };
        fetchProducts();
    }, [activeCategory, page]);

    const handleCategoryChange = (slug) => {
        setActiveCategory(slug);
        setPage(1);
        setProducts([]);
        setHasMore(true);
    };

    return (
        <div className="min-h-screen bg-white pt-24 lg:pt-36 pb-24 z-0">
            <div className="max-w-[1700px] mx-auto px-6 lg:px-12">

                {/* Layout Container */}
                <div className="flex flex-col md:flex-row gap-12 lg:gap-16">

                    {/* Left Sidebar Filters - Sticky and independently scrollable */}
                    <div className="w-full md:w-[240px] lg:w-[260px] flex-shrink-0 space-y-12 pr-6 md:border-r border-[#1e2643]/5 pb-10 sticky top-24 md:top-32 h-[max-content] md:h-[calc(100vh-120px)] overflow-y-auto hidden-scrollbar z-10 bg-white self-start">
                        {/* Product Type Filter */}
                        <div>
                            <h3 className="text-[13px] font-medium text-[#1e2643] mb-6 serif tracking-wider">Product type</h3>
                            <ul className="space-y-4">
                                <li>
                                    <button className="text-[12px] text-[#1e2643]/70 hover:text-[#1e2643] transition-colors flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-transparent"></div>
                                        Kurtas (117)
                                    </button>
                                </li>
                                <li>
                                    <button className="text-[12px] text-[#1e2643]/70 hover:text-[#1e2643] transition-colors flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-transparent"></div>
                                        Kurtis & Tops (1)
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Size Filter */}
                        <div>
                            <h3 className="text-[13px] font-medium text-[#1e2643] mb-6 serif tracking-wider">Size</h3>
                            <ul className="space-y-4">
                                {['XS (66)', 'S (105)', 'S/M (3)', 'M (124)', 'L (115)', 'L/XL (3)', 'XL (104)', 'XXL (46)', 'FR (10)', 'FS (3)', 'L44 (87)'].map((size, i) => (
                                    <li key={size}>
                                        <button className={`text-[12px] transition-colors flex items-center gap-2 ${['L (115)', 'S/M (3)'].includes(size) ? 'text-[#1e2643] font-medium' : 'text-[#1e2643]/70 hover:text-[#1e2643]'}`}>
                                            <div className={`w-1 h-1 rounded-full ${['L (115)', 'S/M (3)'].includes(size) ? 'bg-[#1e2643]' : 'bg-transparent'}`}></div>
                                            {size}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Filter */}
                        <div>
                            <h3 className="text-[13px] font-medium text-[#1e2643] mb-6 serif tracking-wider">Price</h3>
                            <div className="space-y-6">
                                {/* Simple Slider Track */}
                                <div className="relative h-1 bg-[#1e2643]/10 rounded">
                                    <div className="absolute left-0 right-0 h-full bg-[#1e2643] rounded"></div>
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#1e2643] rounded-full"></div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#1e2643] rounded-full"></div>
                                </div>
                                {/* Min/Max Inputs */}
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#1e2643]/50">₹</span>
                                        <input type="text" value="0" readOnly className="w-full border border-[#1e2643]/10 pl-8 pr-3 py-2 text-[12px] text-[#1e2643] focus:outline-none focus:border-[#1e2643]/30" />
                                    </div>
                                    <span className="text-[#1e2643]/50">-</span>
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#1e2643]/50">₹</span>
                                        <input type="text" value="21500" readOnly className="w-full border border-[#1e2643]/10 pl-8 pr-3 py-2 text-[12px] text-[#1e2643] focus:outline-none focus:border-[#1e2643]/30" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <div className="pt-4">
                            <button className="text-[10px] tracking-[0.2em] font-medium uppercase border border-[#1e2643]/20 py-2.5 px-6 text-[#1e2643] hover:bg-[#1e2643] hover:text-white transition-colors">
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Right Content Area - Main Document Scroll */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar (Grid/List Toggle & Sort) */}
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#1e2643]/5 z-20 relative bg-white">
                            {/* Left: View Toggles */}
                            <div className="flex gap-4 opacity-30 hidden sm:flex">
                                <button className="p-1 hover:opacity-100 transition-opacity">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z" /></svg>
                                </button>
                                <button className="p-1 hover:opacity-100 transition-opacity">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></svg>
                                </button>
                            </div>

                            {/* Right: Sort Dropdown */}
                            <div className="ml-auto">
                                <button className="flex items-center gap-2 text-[12px] text-[#1e2643] hover:text-[#1e2643]/70 transition-colors">
                                    Sort
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Product Grid - 3 Columns */}
                        {loading && products.length === 0 ? (
                            <div className="py-24 text-center">
                                <LoadingSpinner size="lg" text="Carefully curating your selection..." />
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
                                    {products.map((p, index) => {
                                        if (products.length === index + 1) {
                                            return (
                                                <div ref={lastProductElementRef} key={p._id || index}>
                                                    <ProductCard product={p} />
                                                </div>
                                            );
                                        } else {
                                            return <ProductCard key={p._id || index} product={p} />;
                                        }
                                    })}
                                </div>

                                {/* Pagination / Loading More */}
                                {loadingMore && (
                                    <div className="mt-16 py-10 flex justify-center border-t border-[#1e2643]/5">
                                        <LoadingSpinner size="md" text="Discovering more gems..." />
                                    </div>
                                )}

                                {!hasMore && products.length > 0 && (
                                    <div className="mt-20 py-10 text-center border-t border-[#1e2643]/5">
                                        <p className="text-[#1e2643]/30 text-[10px] font-bold uppercase tracking-[0.3em]">
                                            Our collection is complete for now
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
                                <span className="text-4xl">✨</span>
                                <h3 className="text-xl font-light text-[#1e2643] serif uppercase tracking-widest">
                                    No pieces found
                                </h3>
                                <p className="text-[#1e2643]/40 text-sm max-w-sm serif italic">
                                    We couldn't find any products in this particular collection. Please try another category or check back soon.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

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
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-light text-[#1e2643] mb-6 serif tracking-tight">
                        Our Full Collection
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-[#1e2643]/20" />
                        <span className="text-[10px] uppercase tracking-[0.4em] text-[#1e2643]/60 font-bold">
                            Timeless pieces for every occasion
                        </span>
                        <div className="h-[1px] w-12 bg-[#1e2643]/20" />
                    </div>
                </div>

                {/* Filters */}
                <CategoryTabs
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelect={handleCategoryChange}
                />

                {/* Content */}
                {loading && products.length === 0 ? (
                    <div className="py-20">
                        <LoadingSpinner size="lg" text="Curating collection..." color="#1e2643" />
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 mb-16">
                            {products.map((p, index) => {
                                if (products.length === index + 1) {
                                    return (
                                        <div ref={lastProductElementRef} key={p._id}>
                                            <ProductCard product={p} />
                                        </div>
                                    );
                                } else {
                                    return <ProductCard key={p._id} product={p} />;
                                }
                            })}
                        </div>

                        {/* Loading More Indicator */}
                        {loadingMore && (
                            <div className="py-10 flex justify-center">
                                <LoadingSpinner size="md" text="Loading more pieces..." color="#1e2643" />
                            </div>
                        )}

                        {/* End of Collection Message */}
                        {!hasMore && products.length > 0 && (
                            <div className="py-10 text-center">
                                <p className="text-[#1e2643]/40 text-xs font-bold uppercase tracking-[0.2em]">
                                    You've reached the end of our current collection
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-20 border border-[#1e2643]/10 bg-white/50 backdrop-blur-sm">
                        <EmptyState
                            title="No pieces found in this collection"
                            description="Try exploring another category or check back soon for new arrivals."
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

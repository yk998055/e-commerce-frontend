'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import api from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

const SIZES = ['XS', 'S', 'S/M', 'M', 'L', 'L/XL', 'XL', 'XXL', 'FR', 'FS', 'Free Size'];
const SUBCATEGORIES = ['All', 'Kurta', 'Pant', 'Dress', 'Kaftan', 'Top', '3 pcs set', '2 pcs set', 'Saree', 'Stole', 'Fabric'];
const SORT_OPTIONS = [
    { value: '', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'rating', label: 'Top Rated' },
];

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const observer = useRef();

    // Read initial state from URL
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sortOpen, setSortOpen] = useState(false);

    // Filter state — initialised from URL
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
    const [activeSubcategory, setActiveSubcategory] = useState(searchParams.get('subcategory') || '');
    const [activeSizes, setActiveSizes] = useState(() => {
        const s = searchParams.get('size');
        return s ? s.split(',') : [];
    });
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || '');
    const [search, setSearch] = useState(searchParams.get('search') || '');

    // Build the API URL from current filter state
    const buildApiUrl = useCallback((pageNum) => {
        const params = new URLSearchParams();
        if (activeCategory) params.set('category', activeCategory);
        if (activeSubcategory) params.set('subcategory', activeSubcategory);
        if (activeSizes.length) params.set('size', activeSizes.join(','));
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort) params.set('sort', sort);
        if (search) params.set('search', search);
        params.set('page', pageNum);
        params.set('limit', 12);
        return `/products?${params.toString()}`;
    }, [activeCategory, activeSubcategory, activeSizes, minPrice, maxPrice, sort, search]);

    // Sync filters → URL (without page reload)
    const syncUrl = useCallback(() => {
        const params = new URLSearchParams();
        if (activeCategory) params.set('category', activeCategory);
        if (activeSubcategory) params.set('subcategory', activeSubcategory);
        if (activeSizes.length) params.set('size', activeSizes.join(','));
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort) params.set('sort', sort);
        if (search) params.set('search', search);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [activeCategory, activeSubcategory, activeSizes, minPrice, maxPrice, sort, search, router, pathname]);

    // Reset & re-fetch when filters change
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        syncUrl();
    }, [activeCategory, activeSubcategory, activeSizes, minPrice, maxPrice, sort, search]);

    // Reset and re-sync if URL search param changes externally (e.g. from Navbar or browser back)
    useEffect(() => {
        const s = searchParams.get('search') || '';
        if (s !== search) setSearch(s);
        const c = searchParams.get('category') || '';
        if (c !== activeCategory) setActiveCategory(c);
        const sub = searchParams.get('subcategory') || '';
        if (sub !== activeSubcategory) setActiveSubcategory(sub);
        const sortFromUrl = searchParams.get('sort') || '';
        if (sortFromUrl !== sort) setSort(sortFromUrl);
    }, [searchParams]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            if (page === 1) setLoading(true);
            else setLoadingMore(true);
            try {
                const res = await api.get(buildApiUrl(page));
                const newProducts = res.data.data?.products || [];
                const totalPages = res.data.data?.pagination?.pages || 1;
                const total = res.data.data?.pagination?.total || 0;
                setTotalCount(total);
                setProducts(prev => {
                    if (page === 1) return newProducts;
                    const existingIds = new Set(prev.map(p => p._id));
                    const uniqueNew = newProducts.filter(p => p._id && !existingIds.has(p._id));
                    return [...prev, ...uniqueNew];
                });
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
    }, [page, buildApiUrl]);

    // Intersection observer for infinite scroll
    const lastProductRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) setPage(prev => prev + 1);
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    const toggleSize = (size) => {
        setActiveSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const resetFilters = () => {
        setActiveSubcategory('');
        setActiveSizes([]);
        setMinPrice('');
        setMaxPrice('');
        setSort('');
        setSearch('');
    };

    const activeFiltersCount = [
        activeSubcategory,
        ...activeSizes,
        minPrice,
        maxPrice,
        sort,
        search,
    ].filter(Boolean).length;

    const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || 'Sort';

    return (
        <div className="h-screen bg-white pt-32 lg:pt-36 overflow-hidden flex flex-col">
            <div className="max-w-[1700px] w-full mx-auto px-4 lg:px-12 flex flex-col flex-1 overflow-hidden">

                {/* Layout Container */}
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">

                    {/* ─── LEFT SIDEBAR (Full height, no scroll – filters stay fixed) ─────────── */}
                    <aside className="w-full md:w-[220px] lg:w-[260px] flex-shrink-0 h-full overflow-hidden flex flex-col pr-8 border-r border-[#1e2643]/8 pb-8">

                        {/* Product Subcategory */}
                        <div className="mb-10">
                            <h3 className="text-[11px] font-semibold text-[#1e2643] mb-4 tracking-[0.25em] uppercase">Product type</h3>
                            <ul className="space-y-3">
                                {SUBCATEGORIES.map(sub => (
                                    <li key={sub}>
                                        <button
                                            onClick={() => setActiveSubcategory(sub === 'All' ? '' : sub)}
                                            className={`text-[12px] transition-all flex items-center gap-2.5 group ${(sub === 'All' && !activeSubcategory) || activeSubcategory === sub
                                                ? 'text-[#1e2643] font-semibold'
                                                : 'text-[#1e2643]/55 hover:text-[#1e2643]'
                                                }`}
                                        >
                                            <span className={`w-1 h-1 rounded-full transition-all ${(sub === 'All' && !activeSubcategory) || activeSubcategory === sub
                                                ? 'bg-[#1e2643] scale-150'
                                                : 'bg-transparent group-hover:bg-[#1e2643]/30'
                                                }`} />
                                            {sub}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#1e2643]/8 mb-10" />

                        {/* Size Filter */}
                        <div className="mb-10">
                            <h3 className="text-[11px] font-semibold text-[#1e2643] mb-4 tracking-[0.25em] uppercase">Size</h3>
                            <ul className="space-y-3">
                                {SIZES.map(size => (
                                    <li key={size}>
                                        <button
                                            onClick={() => toggleSize(size)}
                                            className={`text-[12px] transition-all flex items-center gap-2.5 group ${activeSizes.includes(size)
                                                ? 'text-[#1e2643] font-semibold'
                                                : 'text-[#1e2643]/55 hover:text-[#1e2643]'
                                                }`}
                                        >
                                            <span className={`w-1 h-1 rounded-full transition-all ${activeSizes.includes(size)
                                                ? 'bg-[#1e2643] scale-150'
                                                : 'bg-transparent group-hover:bg-[#1e2643]/30'
                                                }`} />
                                            {size}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#1e2643]/8 mb-10" />

                        {/* Price Filter */}
                        <div className="mb-10">
                            <h3 className="text-[11px] font-semibold text-[#1e2643] mb-4 tracking-[0.25em] uppercase">Price</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#1e2643]/50 font-medium">₹</span>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={e => setMinPrice(e.target.value)}
                                            className="w-full border border-[#1e2643]/15 pl-7 pr-2 py-2 text-[11px] text-[#1e2643] focus:outline-none focus:border-[#1e2643]/40 bg-transparent"
                                        />
                                    </div>
                                    <span className="text-[#1e2643]/30 text-[10px]">–</span>
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#1e2643]/50 font-medium">₹</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={e => setMaxPrice(e.target.value)}
                                            className="w-full border border-[#1e2643]/15 pl-7 pr-2 py-2 text-[11px] text-[#1e2643] focus:outline-none focus:border-[#1e2643]/40 bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reset */}
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={resetFilters}
                                className="text-[10px] tracking-[0.2em] font-semibold uppercase border border-[#1e2643]/20 py-2.5 px-5 text-[#1e2643] hover:bg-[#1e2643] hover:text-white transition-all"
                            >
                                Reset Filters
                            </button>
                        )}
                    </aside>

                    {/* ─── RIGHT: Fixed header/toolbar + scrollable product grid ──── */}
                    <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden pl-10">
                        {/* Fixed block: header + toolbar + chips (do not scroll) */}
                        <div className="flex-shrink-0">
                            {/* Page Header Bar */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1e2643]/8">
                                <div>
                                    <span className="text-[10px] tracking-[0.3em] text-[#1e2643]/50 uppercase font-medium">
                                        {search ? `Searching: ${search}` : (activeCategory || 'All Products')}
                                    </span>
                                    {totalCount > 0 && (
                                        <span className="ml-3 text-[11px] text-[#1e2643]/30">
                                            {totalCount} {totalCount === 1 ? 'item' : 'items'}
                                        </span>
                                    )}
                                </div>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={resetFilters}
                                        className="text-[10px] tracking-widest uppercase text-[#1e2643]/50 hover:text-[#1e2643] transition-colors border-b border-current pb-0.5"
                                    >
                                        Clear All ({activeFiltersCount})
                                    </button>
                                )}
                            </div>

                            {/* Toolbar */}
                            <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#1e2643]/8">
                            {/* Grid toggles */}
                            <div className="flex gap-3 opacity-25">
                                <button className="p-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z" />
                                    </svg>
                                </button>
                                <button className="p-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setSortOpen(o => !o)}
                                    className="flex items-center gap-2 text-[11px] text-[#1e2643] tracking-wider uppercase hover:text-[#1e2643]/60 transition-colors"
                                >
                                    {currentSortLabel}
                                    <svg className={`w-3 h-3 transition-transform ${sortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {sortOpen && (
                                    <div className="absolute right-0 top-full mt-2 bg-white border border-[#1e2643]/10 z-30 min-w-[180px] shadow-lg">
                                        {SORT_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setSort(opt.value); setSortOpen(false); }}
                                                className={`block w-full text-left px-4 py-3 text-[11px] tracking-wider uppercase transition-colors ${sort === opt.value
                                                    ? 'bg-[#1e2643] text-white'
                                                    : 'text-[#1e2643] hover:bg-[#1e2643]/5'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                            {/* Active filter chips */}
                            {(activeSizes.length > 0 || activeSubcategory) && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {activeSubcategory && (
                                        <button
                                            onClick={() => setActiveSubcategory('')}
                                            className="flex items-center gap-1.5 text-[10px] bg-[#1e2643] text-white px-3 py-1.5 tracking-wider uppercase hover:bg-[#1e2643]/80 transition-colors"
                                        >
                                            {activeSubcategory}
                                            <span className="text-white/60">×</span>
                                        </button>
                                    )}
                                    {activeSizes.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => toggleSize(s)}
                                            className="flex items-center gap-1.5 text-[10px] bg-[#1e2643]/10 text-[#1e2643] px-3 py-1.5 tracking-wider uppercase hover:bg-[#1e2643]/20 transition-colors"
                                        >
                                            {s} <span className="opacity-50">×</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Scrollable products only */}
                        <div className="flex-1 min-h-0 overflow-y-auto hidden-scrollbar pb-32">
                        {/* Products */}
                        {loading && products.length === 0 ? (
                            <div className="py-24 text-center">
                                <LoadingSpinner size="lg" text="Curating your selection..." />
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
                                    {products.map((p, index) => {
                                        const isLast = products.length === index + 1;
                                        return (
                                            <div ref={isLast ? lastProductRef : null} key={`${p._id ?? 'product'}-${index}`}>
                                                <ProductCard product={p} />
                                            </div>
                                        );
                                    })}
                                </div>

                                {loadingMore && (
                                    <div className="mt-16 py-10 flex justify-center border-t border-[#1e2643]/5">
                                        <LoadingSpinner size="md" text="Loading more..." />
                                    </div>
                                )}

                                {!hasMore && products.length > 0 && (
                                    <div className="mt-20 py-10 text-center border-t border-[#1e2643]/5">
                                        <p className="text-[#1e2643]/25 text-[10px] font-semibold uppercase tracking-[0.4em]">
                                            End of collection
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-32 flex flex-col items-center justify-center text-center space-y-5">
                                <span className="text-3xl">✿</span>
                                <h3 className="text-lg font-light text-[#1e2643] serif uppercase tracking-widest">
                                    No pieces found
                                </h3>
                                <p className="text-[#1e2643]/40 text-sm serif italic max-w-sm">
                                    Try adjusting your filters or browse all our collections.
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="mt-4 text-[10px] tracking-[0.3em] uppercase border border-[#1e2643]/20 py-2.5 px-8 text-[#1e2643] hover:bg-[#1e2643] hover:text-white transition-all"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading..." />
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}

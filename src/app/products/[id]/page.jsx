'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CURRENCY_SYMBOL } from '@/lib/constants';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/products/${id}`);
            const prod = res.data.data;
            setProduct(prod);
            setSelectedImage(0);

            // Fetch related products
            if (prod.category?.slug) {
                const relRes = await api.get(`/products?category=${prod.category.slug}&limit=4`);
                const relProducts = (relRes.data.data?.products || []).filter((p) => p._id !== prod._id);
                setRelated(relProducts.slice(0, 4));
            }
        } catch (err) {
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner size="lg" text="Loading product..." />;

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center p-12 bg-[#FEE6A9] backdrop-blur-xl rounded-[3rem] border-4 border-[#1e2643] shadow-2xl">
                    <h2 className="text-4xl font-black text-[#1e2643] mb-6 tracking-tight">Product Not Found</h2>
                    <Link href="/" className="px-8 py-4 bg-[#1e2643] text-[#FEE6A1] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#1e2643]/90 transition-all shadow-xl shadow-[#1e2643]/10">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'];

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#1e2643]/40 mb-12 ml-1">
                    <Link href="/" className="hover:text-[#1e2643] transition-colors">Home</Link>
                    <span className="text-[#1e2643]/20">/</span>
                    {product.category?.name && (
                        <>
                            <Link href={`/products?category=${product.category.slug}`} className="hover:text-[#1e2643] transition-colors">
                                {product.category.name}
                            </Link>
                            <span className="text-[#1e2643]/20">/</span>
                        </>
                    )}
                    <span className="text-[#1e2643]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 animate-fadeIn">
                    {/* Image Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-white/50 border-4 border-[#1e2643] shadow-2xl shadow-[#1e2643]/10 group">
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-24 h-24 rounded-2xl overflow-hidden border-4 shrink-0 transition-all duration-300 ${i === selectedImage
                                            ? 'border-[#1e2643] shadow-xl scale-105'
                                            : 'border-white/50 hover:border-[#1e2643]/30 hover:scale-105'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Video Player */}
                        {product.videoUrl && (
                            <div className="rounded-[2rem] overflow-hidden border-4 border-[#1e2643] mt-8 shadow-xl bg-black">
                                <video
                                    controls
                                    className="w-full"
                                    poster={images[0]}
                                >
                                    <source src={product.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="flex-1 space-y-8">
                            <div>
                                {product.category?.name && (
                                    <span className="inline-block px-4 py-1.5 rounded-xl bg-[#1e2643] text-[#FEE6A1] text-[10px] font-black uppercase tracking-widest mb-6">
                                        {product.category.name}
                                    </span>
                                )}
                                <h1 className="text-5xl sm:text-6xl font-black text-[#1e2643] leading-tight tracking-tight mb-4">{product.name}</h1>

                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'} shadow-sm`} />
                                    <span className={`text-xs font-black uppercase tracking-widest ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {product.stock > 0 ? `In Stock: ${product.stock} units` : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="p-8 rounded-[2rem] bg-[#FEE6A9] border-2 border-[#1e2643]/5 backdrop-blur-md">
                                <div className="flex items-baseline gap-4 mb-2">
                                    {hasDiscount ? (
                                        <>
                                            <span className="text-5xl font-black text-[#1e2643]">
                                                {CURRENCY_SYMBOL}{product.discountPrice.toFixed(2)}
                                            </span>
                                            <span className="text-2xl text-[#1e2643]/30 line-through font-bold">
                                                {CURRENCY_SYMBOL}{product.price.toFixed(2)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-5xl font-black text-[#1e2643]">
                                            {CURRENCY_SYMBOL}{product.price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                {hasDiscount && (
                                    <span className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                                        Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% Today
                                    </span>
                                )}
                            </div>

                            {/* Actions - Coming Soon or Add to Cart if implemented */}
                            <button className="w-full py-6 rounded-[2rem] bg-[#1e2643] text-[#FEE6A1] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl shadow-[#1e2643]/20 hover:scale-[1.02] active:scale-95">
                                Add to Shopping Bag
                            </button>

                            {/* Description */}
                            <div className="pt-10 border-t-2 border-[#1e2643]/5">
                                <h3 className="text-xs font-black text-[#1e2643]/30 uppercase tracking-[0.2em] mb-4">The Details</h3>
                                <p className="text-[#1e2643]/70 leading-relaxed font-bold text-lg whitespace-pre-line">
                                    {product.description || "No description available for this premium item."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <section className="mt-32 pt-20 border-t-4 border-[#1e2643]">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-4xl font-black text-[#1e2643] tracking-tight">You May Also Like</h2>
                            <Link href="/products" className="text-xs font-black uppercase tracking-widest text-[#1e2643] border-b-2 border-[#1e2643] pb-1 hover:text-[#1e2643]/60 hover:border-[#1e2643]/60 transition-all">
                                View Collection
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {related.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

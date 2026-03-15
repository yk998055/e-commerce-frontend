'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

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

            if (prod) {
                setProduct(prod);
                setSelectedImage(0);

                // Fetch related products
                if (prod.category?.slug) {
                    const relRes = await api.get(`/products?category=${prod.category.slug}&limit=4`);
                    const relProducts = (relRes.data.data?.products || []).filter((p) => p._id !== prod._id);
                    setRelated(relProducts.slice(0, 4));
                }
            } else {
                setProduct(null);
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" text="Bringing you the details..." />
        </div>
    );

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center pt-32">
                <div className="text-center space-y-6">
                    <h2 className="text-2xl font-light text-[#1e2643] serif uppercase tracking-widest">Piece Not Found</h2>
                    <Link href="/products" className="inline-block px-10 py-4 bg-[#FEE6A9] text-[#1e2643] text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all">
                        Return to Collection
                    </Link>
                </div>
            </div>
        );
    }

    const price = Number(product.price) || 0;
    const discountPrice = Number(product.discountPrice) || 0;
    const hasDiscount = discountPrice > 0 && discountPrice < price;
    const images = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'];

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e2643]/40 mb-12">
                    <Link href="/" className="hover:text-[#1e2643]">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-[#1e2643]">Shop All</Link>
                    <span>/</span>
                    <span className="text-[#1e2643]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">

                    {/* Left: Image Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-50 group">
                            <img
                                src={images[selectedImage]}
                                alt={product.name || 'Product Image'}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`aspect-[3/4] overflow-hidden border transition-all ${i === selectedImage ? 'border-[#FEE6A9]' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Content */}
                    <div className="flex flex-col space-y-10">
                        <div className="space-y-4">
                            <span className="text-[10px] font-bold text-[#1e2643]/70 uppercase tracking-[0.4em]">
                                {product.category?.name || 'Exclusive Design'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-light text-[#1e2643] serif uppercase tracking-wide leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-4 pt-4">
                                {hasDiscount ? (
                                    <>
                                        <span className="text-2xl font-bold text-[#1e2643] tracking-wider">
                                            ₹{discountPrice.toLocaleString()}
                                        </span>
                                        <span className="text-lg text-[#1e2643]/30 line-through tracking-wider">
                                            ₹{price.toLocaleString()}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-2xl font-bold text-[#1e2643] tracking-wider">
                                        ₹{price.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-[#1e2643]/40 font-medium uppercase tracking-widest italic pt-1">
                                (Prices inclusive of all taxes)
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-6">
                            <div className="flex flex-col gap-4">
                                <button
                                    disabled={!product.stock || product.stock <= 0}
                                    className={`w-full py-5 text-[11px] font-bold uppercase tracking-[0.3em] transition-all ${product.stock > 0
                                        ? 'bg-[#FEE6A9] text-[#1e2643] hover:bg-[#1e2643] hover:text-white shadow-xl'
                                        : 'bg-gray-100 text-[#1e2643]/40 cursor-not-allowed'
                                        }`}
                                >
                                    {product.stock > 0 ? 'Add to Shopping Bag' : 'Out of Stock'}
                                </button>
                                <button className="w-full py-5 border border-[#1e2643]/20 text-[#1e2643] text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#1e2643]/5 transition-colors">
                                    Wishlist
                                </button>
                            </div>
                        </div>

                        {/* Description & Specs */}
                        <div className="border-t border-[#1e2643]/5 pt-10 space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold text-[#1e2643] uppercase tracking-[0.4em]">Details</h3>
                                <p className="text-[#1e2643]/70 leading-relaxed text-sm serif italic">
                                    {product.description || "Every stitch in this piece tells a tale of traditional Indian artistry, designed to be a timeless addition to your wardrobe."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                {product.fabric && (
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-[#1e2643]/40 uppercase tracking-widest">Fabric</span>
                                        <p className="text-xs font-medium text-[#1e2643] uppercase tracking-wider">{product.fabric}</p>
                                    </div>
                                )}
                                {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-[#1e2643]/40 uppercase tracking-widest">Available Sizes</span>
                                        <div className="flex flex-wrap gap-2">
                                            {product.sizes.map(size => (
                                                <span key={size} className="text-[10px] font-medium text-[#1e2643] uppercase border border-[#1e2643]/5 px-2 py-1">{size}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-[#1e2643]/40 uppercase tracking-widest">Stock Status</span>
                                    <p className={`text-xs font-bold uppercase tracking-wider ${product.stock > 0 ? 'text-[#1e2643]/60' : 'text-[#1e2643]/40'}`}>
                                        {product.stock > 0 ? 'Available' : 'Currently Unavailable'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Free Shipping Badge */}
                        <div className="bg-gray-50 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <svg className="w-6 h-6 text-[#1e2643]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1e2643]">Free Shipping in India</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {Array.isArray(related) && related.length > 0 && (
                    <section className="mt-32 pt-24 border-t border-[#1e2643]/5">
                        <div className="text-center mb-16 space-y-4">
                            <span className="text-[10px] font-bold text-[#1e2643]/70 uppercase tracking-[0.4em]">Handpicked</span>
                            <h2 className="text-3xl font-light text-[#1e2643] serif uppercase tracking-widest">You May Also Like</h2>
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

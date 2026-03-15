'use client';

import Link from 'next/link';

export default function ProductCard({ product }) {
    if (!product) return null;

    // Fallback image if none exists
    const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1595991209266-5ff5a3a2f008?w=800';
    const hasHoverImage = !!product.images?.[1];
    const hoverImage = product.images?.[1];

    const price = Number(product.price) || 0;
    const discountPrice = Number(product.discountPrice) || 0;
    const hasDiscount = discountPrice > 0 && discountPrice < price;

    const discountPercentage = hasDiscount
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0;

    return (
        <div className="group flex flex-col items-center text-center">
            {/* Image Container */}
            <Link
                href={`/products/${product._id}`}
                className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50 mb-6"
            >
                <img
                    src={mainImage}
                    alt={product.name || 'Product'}
                    className={`w-full h-full object-cover transition-opacity duration-700 ${hasHoverImage ? 'group-hover:opacity-0' : ''}`}
                />
                {hasHoverImage && (
                    <img
                        src={hoverImage}
                        alt={`${product.name || 'Product'} hover`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    />
                )}

                {/* Badges */}
                <div className="absolute top-4 left-0 flex flex-col gap-2 z-10">
                    {discountPercentage > 0 && (
                        <span className="bg-[#FEE6A9] text-[#1e2643] text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
                            {discountPercentage}% OFF
                        </span>
                    )}
                    {product.isNew && (
                        <span className="bg-[#c8a87f] text-[#1e2643] text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
                            New
                        </span>
                    )}
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                    <button className="w-full bg-white text-[#1e2643] py-3 text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-[#FEE6A9] hover:text-[#1e2643] transition-colors">
                        Quick Add
                    </button>
                </div>
            </Link>

            {/* Product Info */}
            <div className="space-y-2 px-2">
                <Link href={`/products/${product._id}`}>
                    <h3 className="text-sm font-medium text-[#1e2643] hover:text-[#1e2643] transition-colors uppercase tracking-widest leading-snug">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center justify-center gap-3">
                    {hasDiscount ? (
                        <>
                            <span className="text-[#1e2643] text-sm font-bold tracking-wider">
                                ₹{discountPrice.toLocaleString()}
                            </span>
                            <span className="text-[#1e2643]/50 text-[13px] line-through tracking-wider">
                                ₹{price.toLocaleString()}
                            </span>
                        </>
                    ) : (
                        <span className="text-[#1e2643] text-sm font-bold tracking-wider">
                            ₹{price.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

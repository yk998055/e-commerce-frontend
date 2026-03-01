import Link from 'next/link';
import { CURRENCY_SYMBOL } from '@/lib/constants';

export default function ProductCard({ product }) {
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const discountPercentage = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
    const imgSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

    return (
        <Link href={`/products/${product._id}`} className="group block">
            <div className="bg-[#FEE6A9] border border-[#1e2643]/10 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-white/50">
                    <img
                        src={imgSrc}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                    />

                    {/* Badges */}
                    {hasDiscount && (
                        <div className="absolute top-4 left-4 px-2 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-md">
                            {discountPercentage}% OFF
                        </div>
                    )}
                    {product.isFeatured && (
                        <div className="absolute top-4 right-4 px-2 py-1 bg-[#1e2643] text-[#FEE6A9] text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-md">
                            Featured
                        </div>
                    )}

                    {/* Hover overlay with serif text */}
                    <div className="absolute inset-0 bg-[#1e2643]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <span className="px-6 py-2 bg-white/90 backdrop-blur-md text-[#1e2643] text-xs font-bold uppercase tracking-[0.2em] border border-[#1e2643]/10 shadow-xl">
                            View Details
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="p-6 text-center">
                    {product.category?.name && (
                        <span className="text-[9px] font-bold text-[#1e2643]/40 uppercase tracking-[0.3em] block mb-2">
                            {product.category.name}
                        </span>
                    )}
                    <h3 className="text-[#1e2643] font-bold text-base mb-3 transition-colors duration-300 line-clamp-1 group-hover:text-[#1e2643]/80">
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-center gap-3">
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
                </div>
            </div>
        </Link>
    );
}

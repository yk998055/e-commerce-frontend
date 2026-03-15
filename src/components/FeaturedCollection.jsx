'use client';

import Link from 'next/link';

export default function FeaturedCollection() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Left: Large Image */}
                    <div className="w-full lg:w-1/2 aspect-[4/5] overflow-hidden bg-[#F3F0E9] relative group">
                        <img
                            src="https://images.unsplash.com/photo-1610030469915-9a08fa996eec?w=1200"
                            alt="Featured Collection"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 border-[1.5rem] border-white/10 group-hover:border-white/20 transition-all duration-700" />
                    </div>

                    {/* Right: Content */}
                    <div className="w-full lg:w-1/2 lg:pl-12">
                        <span className="text-[#1e2643] text-xs font-bold uppercase tracking-[0.4em] mb-6 block">Our Story</span>

                        <h2 className="text-4xl md:text-6xl font-light text-[#1e2643] mb-8 serif leading-tight">
                            The Lush <span className="italic">Detail</span>
                        </h2>

                        <p className="text-[#1e2643] text-lg leading-relaxed mb-10 font-light max-w-lg">
                            Each piece in our collection is a testament to the artisan's skill, blending contemporary silhouettes with age-old techniques. Discover a world where luxury meets heritage.
                        </p>

                        <div className="space-y-6 mb-12">
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-[1px] bg-[#1e2643] group-hover:w-16 transition-all duration-500" />
                                <span className="text-sm font-medium tracking-widest uppercase text-[#1e2643] group-hover:text-[#1e2643]/80 transition-colors">Hand-woven Textiles</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-[1px] bg-[#1e2643] group-hover:w-16 transition-all duration-500" />
                                <span className="text-sm font-medium tracking-widest uppercase text-[#1e2643] group-hover:text-[#1e2643]/80 transition-colors">Sustainable Practices</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-[1px] bg-[#1e2643] group-hover:w-16 transition-all duration-500" />
                                <span className="text-sm font-medium tracking-widest uppercase text-[#1e2643] group-hover:text-[#1e2643]/80 transition-colors">Exclusive Patterns</span>
                            </div>
                        </div>

                        <Link
                            href="/products"
                            className="inline-block px-12 py-4 border border-[#1e2643] text-[#1e2643] text-[12px] font-bold uppercase tracking-[0.5em] hover:bg-[#1e2643] hover:text-white transition-all duration-700"
                        >
                            LEARN MORE
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

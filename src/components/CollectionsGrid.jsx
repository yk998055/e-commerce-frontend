'use client';

import Link from 'next/link';

const collections = [
    {
        title: 'Festive Edit',
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800',
        link: '/products?category=artisan-apparel'
    },
    {
        title: 'New Arrivals',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
        link: '/products?category=hand-blocked-textiles'
    },
    {
        title: 'Best Sellers',
        image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800',
        link: '/products?category=heritage-decor'
    }
];

export default function CollectionsGrid() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {collections.map((item, idx) => (
                        <div key={idx} className="group relative aspect-[3/4] overflow-hidden bg-[#F3F0E9]">
                            {/* Image with hover effect */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-white/40 group-hover:bg-white/60 transition-colors duration-500" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1e2643] p-6">
                                <h3 className="text-3xl md:text-4xl font-light mb-8 serif tracking-wide text-center">
                                    {item.title}
                                </h3>

                                <Link
                                    href={item.link}
                                    className="px-8 py-3 bg-white text-[#1e2643] text-[10px] font-bold uppercase tracking-[0.4em] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-lg"
                                >
                                    SHOP NOW
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

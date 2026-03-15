'use client';

import Link from 'next/link';

const collections = [
    {
        title: 'Clothing',
        label: 'Shop the Edit',
        image: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=800',
        link: '/products?category=clothing',
    },
    {
        title: 'Festive Collection',
        label: 'Celebrate in Style',
        image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
        link: '/products?category=festive',
    },
    {
        title: 'New Arrivals',
        label: 'Just In',
        image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=800',
        link: '/products?category=new-collection',
    },
    {
        title: 'Gifting',
        label: 'For Someone Special',
        image: 'https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&w=800',
        link: '/products?category=gifting',
    },
    {
        title: "Women's Wear",
        label: 'Shop Women',
        image: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=800',
        link: '/products?category=womenswear',
    },
    {
        title: 'Printed Fabrics',
        label: 'By the Meter',
        image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=800',
        link: '/products?category=printed-fabric',
    },
];

export default function CollectionsGrid() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1700px] mx-auto px-6 lg:px-12">
                <div className="text-center mb-14 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1e2643]/50">Explore</span>
                    <h2 className="text-3xl md:text-4xl font-light text-[#1e2643] serif uppercase tracking-widest">
                        Shop By Collection
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {collections.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.link}
                            className="group relative aspect-[3/4] overflow-hidden bg-[#F3F0E9] block"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1e2643]/70 via-transparent to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-8 text-white">
                                <span className="block text-[9px] font-bold uppercase tracking-[0.3em] text-white/60 mb-1 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    {item.label}
                                </span>
                                <h3 className="text-lg lg:text-xl font-light serif uppercase tracking-wider leading-tight">
                                    {item.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

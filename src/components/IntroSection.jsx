'use client';

import Link from 'next/link';

const categories = [
    {
        title: "Women's Clothing",
        image: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?q=80&w=2000&auto=format&fit=crop',
        link: '/products?category=Clothing'
    },
    {
        title: "Home Textiles",
        image: 'https://images.unsplash.com/photo-1595991209266-5ff5a3a2f008?q=80&w=2000&auto=format&fit=crop',
        link: '/products?category=Home+Furnishing'
    },
    {
        title: "Exquisite Dupattas",
        image: 'https://images.unsplash.com/photo-1621345472098-9076046e7f86?q=80&w=2000&auto=format&fit=crop',
        link: '/products?category=Dupattas'
    }
];

export default function IntroSection() {
    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat) => (
                        <Link
                            key={cat.title}
                            href={cat.link}
                            className="group relative h-[600px] overflow-hidden bg-gray-100 flex flex-col justify-end"
                        >
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            <div className="relative p-10 text-center space-y-4">
                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-[#1e2643] text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm">
                                    Explore
                                </span>
                                <h3 className="text-2xl md:text-3xl font-light text-[#1e2643] serif uppercase tracking-wider">
                                    {cat.title}
                                </h3>
                                <div className="pt-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <span className="inline-block bg-white text-[#1e2643] px-8 py-3 text-[10px] font-bold uppercase tracking-widest">
                                        Shop Now
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

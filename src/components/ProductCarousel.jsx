'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductCarousel({ products = [] }) {
    const [activeTab, setActiveTab] = useState('New Arrivals');

    const tabs = ['New Arrivals', 'Festive Edit'];

    // Filter products based on active tab
    const filteredProducts = activeTab === 'New Arrivals'
        ? products.slice(0, 8)
        : products.filter(p => p.category?.name === 'Festive' || p.isNew).slice(0, 8);

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6">

                {/* Tabs / Header */}
                <div className="flex flex-col items-center mb-16 space-y-8">
                    <div className="flex gap-8 md:gap-16 border-b border-gray-100 w-full justify-center">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all relative ${activeTab === tab
                                    ? 'text-[#1e2643]'
                                    : 'text-[#1e2643]/30 hover:text-[#1e2643]'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FEE6A9]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Carousel Grid (Mobile Scrollable) */}
                <div className="relative">
                    <div className="flex overflow-x-auto pb-8 gap-6 md:gap-8 lg:grid lg:grid-cols-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div key={product._id || Math.random()} className="min-w-[280px] lg:min-w-0 transition-opacity duration-500 animate-fadeIn">
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}

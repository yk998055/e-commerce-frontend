'use client';

export default function QuoteSection() {
    return (
        <section className="py-32 bg-white border-y border-[#B8860B]/20">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="mb-12 w-px h-16 bg-[#B8860B]/30 mx-auto" />

                <h2 className="text-3xl md:text-5xl font-light text-[#1e2643] leading-tight serif italic">
                    "Shop in our world to experience the age-old <br className="hidden md:block" />
                    <span className="text-[#B8860B]">taste crafts</span> of our country."
                </h2>

                <div className="mt-12 w-px h-16 bg-[#B8860B]/30 mx-auto" />
            </div>
        </section>
    );
}

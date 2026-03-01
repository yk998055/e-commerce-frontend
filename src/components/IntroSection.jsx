'use client';

export default function IntroSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
                {/* Gold Diamond Icon Replacement */}
                <div className="flex justify-center mb-10">
                    <div className="relative w-16 h-16 transform rotate-45 border-2 border-[#B8860B] flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[#B8860B]/10" />
                        <div className="transform -rotate-45">
                            <svg className="w-8 h-8 text-[#B8860B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl md:text-5xl font-light text-[#1e2643] mb-8 serif tracking-tight">
                    Shaped by <span className="italic">nature</span>, crafted with <span className="italic text-[#B8860B]">care</span>
                </h2>

                <p className="text-[#1e2643]/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
                    Every design tells a story of tradition and luxury,
                    becoming a part of your moments
                    for many seasons to come.
                </p>

                <div className="mt-12 w-px h-24 bg-[#B8860B]/30 mx-auto" />
            </div>
        </section>
    );
}

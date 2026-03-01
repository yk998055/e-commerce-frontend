'use client';

export default function CategoryTabs({ categories, activeCategory, onSelect }) {
    if (!categories || categories.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button
                onClick={() => onSelect(null)}
                className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border-b-2 ${!activeCategory
                    ? 'border-[#1e2643] text-[#1e2643]'
                    : 'border-transparent text-[#1e2643]/30 hover:text-[#1e2643] hover:border-[#1e2643]/10'
                    }`}
            >
                All Collections
            </button>
            {categories.map((cat) => (
                <button
                    key={cat._id}
                    onClick={() => onSelect(cat.slug)}
                    className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border-b-2 ${activeCategory === cat.slug
                        ? 'border-[#1e2643] text-[#1e2643]'
                        : 'border-transparent text-[#1e2643]/30 hover:text-[#1e2643] hover:border-[#1e2643]/10'
                        }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
}

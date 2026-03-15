'use client';

export default function CategoryTabs({ categories, activeCategory, onSelect }) {
    if (!categories || categories.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center mb-12">
            <button
                onClick={() => onSelect(null)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 border-b ${!activeCategory
                    ? 'border-[#FEE6A9] text-[#1e2643]'
                    : 'border-transparent text-[#1e2643]/40 hover:text-[#1e2643]'
                    }`}
            >
                All
            </button>
            {categories.map((cat) => (
                <button
                    key={cat._id}
                    onClick={() => onSelect(cat.slug)}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 border-b ${activeCategory === cat.slug
                        ? 'border-[#FEE6A9] text-[#1e2643]'
                        : 'border-transparent text-[#1e2643]/40 hover:text-[#1e2643]'
                        }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
}

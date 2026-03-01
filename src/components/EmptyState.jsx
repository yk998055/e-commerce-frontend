export default function EmptyState({ title = 'No items found', description = '', icon }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fadeIn">
            <div className="w-24 h-24 rounded-[2rem] bg-white/40 border-4 border-[#1e2643]/5 flex items-center justify-center mb-8 shadow-xl shadow-[#1e2643]/5">
                {icon || (
                    <svg className="w-12 h-12 text-[#1e2643]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                )}
            </div>
            <h3 className="text-2xl font-black text-[#1e2643] mb-3 tracking-tight">{title}</h3>
            {description && <p className="text-sm text-[#1e2643]/50 max-w-sm font-bold leading-relaxed">{description}</p>}
        </div>
    );
}

'use client';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#1e2643]/40 backdrop-blur-md" onClick={onCancel} />

            {/* Dialog */}
            <div className="relative bg-[#FEE6A1] border-4 border-[#1e2643] rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 animate-fadeIn">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-[#1e2643]/10 border-4 border-[#1e2643]/20 flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-[#1e2643]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-[#1e2643] tracking-tight">{title}</h3>
                        <p className="text-[#1e2643]/50 text-sm mt-3 font-bold leading-relaxed">{message}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-10">
                    <button
                        onClick={onCancel}
                        className="px-8 py-4 rounded-2xl bg-[#1e2643]/5 hover:bg-[#1e2643]/10 text-[#1e2643] text-xs font-black uppercase tracking-widest transition-all"
                    >
                        Keep it
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-8 py-4 rounded-2xl bg-[#1e2643] hover:bg-[#1e2643]/90 text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-[#1e2643]/20"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

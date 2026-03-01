export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className={`${sizeClasses[size]} relative`}>
                <div className="absolute inset-0 border-4 border-[#1e2643]/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#1e2643] border-t-transparent rounded-full animate-spin" />
            </div>
            {text && <p className="text-[#1e2643] text-xs font-black uppercase tracking-[0.2em] animate-pulse">{text}</p>}
        </div>
    );
}

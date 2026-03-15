'use client';

const instagramPosts = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600',
        link: 'https://instagram.com'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600',
        link: 'https://instagram.com'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600',
        link: 'https://instagram.com'
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1610030469915-9a08fa996eec?w=600',
        link: 'https://instagram.com'
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1595991209266-5ff5a3a2f008?w=600',
        link: 'https://instagram.com'
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1617143714241-d64c1fd05282?w=600',
        link: 'https://instagram.com'
    }
];

export default function InstagramSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[#1e2643] text-xs font-bold uppercase tracking-[0.4em] mb-4 block">@CHHAAPAYA</span>
                    <h2 className="text-3xl md:text-5xl font-light text-[#1e2643] serif tracking-tight">
                        Follow our <span className="italic">Heritage Journey</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {instagramPosts.map((post) => (
                        <a
                            key={post.id}
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden bg-[#F3F0E9] block"
                        >
                            <img
                                src={post.image}
                                alt={`Instagram post ${post.id}`}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#1e2643]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#1e2643]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.012.013-3.583 0-3.204 0-3.584.013-4.849.07-3.26.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583-.061-4.849-.149-3.225-1.664-4.771-4.919-4.919-1.266-.057-1.645-.069-4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

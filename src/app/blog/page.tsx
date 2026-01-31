import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';

export default function BlogIndex() {
    const allPostsData = getSortedPostsData();

    return (
        <main className="min-h-screen bg-black text-white px-6 py-20 md:py-40 flex flex-col items-center">
            <div className="max-w-3xl w-full">
                <Link href="/" className="text-neutral-500 hover:text-white transition-colors mb-12 block">
                    &larr; back to home
                </Link>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-20 text-neutral-200">
                    Knowledge Pool
                </h1>

                <div className="space-y-12">
                    {allPostsData.map(({ id, date, title, description }: any) => (
                        <Link href={`/blog/${id}`} key={id} className="group block">
                            <article className="border-t border-neutral-900 py-8 group-hover:bg-neutral-900/30 transition-colors px-4 -mx-4 rounded-lg">
                                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                                    <h2 className="text-2xl font-semibold text-neutral-200 group-hover:text-white transition-colors">
                                        {title}
                                    </h2>
                                    <time className="text-sm text-neutral-600 font-mono shrink-0 mt-2 md:mt-0">
                                        {date}
                                    </time>
                                </div>
                                {description && (
                                    <p className="text-neutral-500 line-clamp-2">
                                        {description}
                                    </p>
                                )}
                            </article>
                        </Link>
                    ))}

                    {allPostsData.length === 0 && (
                        <p className="text-neutral-500 text-center py-20">No posts found.</p>
                    )}
                </div>
            </div>
        </main>
    );
}

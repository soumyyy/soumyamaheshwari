import { getPostData, getAllPostIds } from '@/lib/blog';
import Link from 'next/link';
import '@/app/globals.css';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    return paths.map((path) => ({
        slug: path.params.slug,
    }));
}

export default async function Post({ params }: { params: { slug: string } }) {
    const postData = await getPostData(params.slug);

    return (
        <main className="min-h-screen bg-black text-white px-6 py-20 md:py-40 flex flex-col items-center">
            <article className="max-w-3xl w-full prose prose-invert prose-lg prose-neutral">
                <Link href="/blog" className="no-underline text-neutral-500 hover:text-white transition-colors mb-8 block not-prose">
                    &larr; back to pool
                </Link>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white">
                    {postData.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-neutral-500 font-mono mb-12 not-prose border-b border-neutral-900 pb-8">
                    <time>{postData.date}</time>
                    {/* Can add reading time here later */}
                </div>

                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml || "" }} />
            </article>

            <div className="max-w-3xl w-full mt-20 pt-10 border-t border-neutral-900 text-center">
                <Link href="/" className="text-neutral-600 hover:text-neutral-400 text-sm">
                    soumyamaheshwari.com
                </Link>
            </div>
        </main>
    );
}

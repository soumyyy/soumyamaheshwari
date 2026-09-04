import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@fontsource-variable/instrument-sans';
import '@fontsource/commit-mono';
import './globals.css';

const zodiak = localFont({
    src: [
        { path: '../../public/fonts/zodiak-regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/zodiak-italic.woff2', weight: '400', style: 'italic' },
    ],
    variable: '--font-display',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Soumya Maheshwari',
    description:
        'agentic systems and product building — agents, trading engines, ios apps, infra and saas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`dark ${zodiak.variable}`}>
            <body>{children}</body>
        </html>
    );
}

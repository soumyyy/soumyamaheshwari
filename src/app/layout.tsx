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
    metadataBase: new URL('https://soumyamaheshwari.com'),
    title: 'Soumya Maheshwari',
    description:
        'i build things now and then. agents, ios apps, saas tools and backtesting engines, for clients and for myself.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`dark ${zodiak.variable}`}>
            <body>{children}</body>
        </html>
    );
}

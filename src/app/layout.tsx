import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const zodiak = localFont({
    src: [
        { path: '../../public/fonts/zodiak-regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/zodiak-italic.woff2', weight: '400', style: 'italic' },
    ],
    variable: '--font-display',
    display: 'swap',
});

const instrument = localFont({
    src: '../../public/fonts/instrument-sans-latin.woff2',
    weight: '400 700',
    variable: '--font-instrument',
    display: 'swap',
});

const commit = localFont({
    src: '../../public/fonts/commit-mono-latin.woff2',
    weight: '400',
    variable: '--font-commit',
    display: 'swap',
    adjustFontFallback: false,
});

export const metadata: Metadata = {
    metadataBase: new URL('https://soumyamaheshwari.com'),
    title: 'Soumya Maheshwari',
    description:
        'i build things now and then. agents, ios apps, saas tools and backtesting engines, for clients and for myself.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-scroll-behavior="smooth" className={`dark ${zodiak.variable} ${instrument.variable} ${commit.variable}`}>
            <body>{children}</body>
        </html>
    );
}

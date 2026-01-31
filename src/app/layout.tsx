import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-grotesk',
});

export const metadata: Metadata = {
    title: 'Soumya Maheshwari',
    description: 'AI Engineer & Builder. I build cool stuff, break them, fix them along the way.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${spaceGrotesk.className} font-sans`}>
                {children}
            </body>
        </html>
    );
}

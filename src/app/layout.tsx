import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import NavBar from '@/components/NavBar';
import Providers from '@/app/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Doc-Chatter | Interactive PDFs',
    description: 'Load and talk to your PDF files.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="light">
            <body
                className={cn(
                    'min-h-screen font-sans antialiased grainy',
                    inter.className
                )}
            >
                <Providers>
                    <NavBar />
                    {children}
                </Providers>
            </body>
        </html>
    );
}

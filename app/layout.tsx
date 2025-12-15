import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sonner } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Debug Technologies - Simplify. Create. Grow.',
  description:
    'Empowering businesses with innovative software, strategic branding, and digital training in Arusha, Tanzania.',
  keywords: [
    'software development',
    'web development',
    'mobile apps',
    'Tanzania',
    'Arusha',
    'digital marketing',
    'graphic design',
    'training',
    'LMS',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        <Sonner />
      </body>
    </html>
  );
}
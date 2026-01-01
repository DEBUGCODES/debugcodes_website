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
      <script type="text/javascript">
        {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/694eaf9c612ffb197dd4167a/1jddlrvpo';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();
        `}
      </script>
    </body>
    </html>
  );
}
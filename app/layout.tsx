import type { Metadata } from 'next';
import { Poppins, Open_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { CartDrawer } from '@/components/cart/CartDrawer';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Smart Retail | Modern E-Commerce Analytics Platform',
  description:
    'A modern, premium, and trustworthy e-commerce application interface for Smart Retail.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${poppins.variable} ${openSans.variable} ${mono.variable} font-sans text-slate-100 antialiased min-h-screen flex flex-col selection:bg-teal-500 selection:text-white bg-navy-gradient`}
      >
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

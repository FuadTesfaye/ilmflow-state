import type { Metadata } from 'next';
import { Lexend, Amiri } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import { ToastContainer } from '../components/common/ToastContainer';

const sansFont = Lexend({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800']
});

const arabicFont = Amiri({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: 'Hejrat Foundation Masjid Al-Nabi — Islamic Community & Learning Hub',
  description:
    'Dedicated to congregational prayers, Islamic education, youth programs, and community services at Masjid Al-Nabi in West Covina, California.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${arabicFont.variable}`}
    >
      <body className="min-h-screen bg-[#f4f8f5] text-slate-900 flex flex-col font-sans antialiased">
        <AppProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <RoleSwitcher />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}

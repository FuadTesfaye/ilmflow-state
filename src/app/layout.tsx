import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Cinzel, Amiri } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import { ToastContainer } from '../components/common/ToastContainer';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800']
});

const displayFont = Cinzel({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800']
});

const arabicFont = Amiri({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: 'IlmFlow State — Global Islamic Convocations & Competition System',
  description:
    'Enterprise platform for international Islamic summits, Holy Quran recitation championships, Hadith mastery tournaments, and accredited certificates.',
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
      className={`${sansFont.variable} ${displayFont.variable} ${arabicFont.variable}`}
    >
      <body className="min-h-screen bg-[#faf8f5] text-[#111827] flex flex-col font-sans antialiased selection:bg-[#064e3b] selection:text-[#faf8f5]">
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

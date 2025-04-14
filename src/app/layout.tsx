import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '랜덤 발표자 선정',
  description: '랜덤으로 발표자를 선정하는 앱입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

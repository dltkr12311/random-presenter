import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '랜덤 선택기',
  description: '다양한 카테고리에서 랜덤으로 항목을 선택하는 도구입니다.',
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

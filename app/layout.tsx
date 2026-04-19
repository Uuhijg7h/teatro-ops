import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import LayoutWrapper from '../components/LayoutWrapper';
import { APP_NAME, BUSINESS_ADDRESS, BUSINESS_NAME } from '../lib/banquetpro/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${APP_NAME} — ${BUSINESS_NAME}`,
  description: `${BUSINESS_NAME} online banquet hall management system for bookings, venues, staffing, finance, and event operations. ${BUSINESS_ADDRESS}`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

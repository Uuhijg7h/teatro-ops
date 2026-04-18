import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BanquetPro — Banquet Management System',
  description: 'Professional banquet and event management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f0f1f5] text-[#1a1a1a] min-h-screen`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-[220px] flex flex-col min-h-screen">
            <TopBar />
            <main className="p-8 flex-1">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function TopBar() {
  const pathname = usePathname();

  const titles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/booking': 'Bookings',
    '/calendar': 'Calendar',
    '/guests': 'Guests & Clients',
    '/menu': 'Menu & Catering',
    '/staff': 'Staff',
    '/finance': 'Finance',
    '/beo': 'BEO Documents',
  };

  const title = titles[pathname] || 'Dashboard';

  return (
    <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/booking/new"
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
        >
          <span>＋</span>
          <span>NEW BOOKING</span>
        </Link>
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-700">
          A
        </div>
      </div>
    </header>
  );
}

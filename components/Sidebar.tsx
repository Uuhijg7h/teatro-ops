'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', icon: '📊', href: '/dashboard' },
  { name: 'Bookings', icon: '📋', href: '/booking' },
  { name: 'Calendar', icon: '📅', href: '/calendar' },
  { name: 'Guests & Clients', icon: '👥', href: '/guests' },
  { name: 'Menu & Catering', icon: '🍽', href: '/menu' },
  { name: 'Staff', icon: '👔', href: '/staff' },
  { name: 'Finance', icon: '💰', href: '/finance' },
  { name: 'BEO Documents', icon: '📄', href: '/beo' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[220px] bg-[#ffffff] h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-2 border-b border-gray-100">
        <span className="text-2xl">🏛</span>
        <span className="font-bold text-lg text-gray-800 uppercase tracking-tight">BanquetPro</span>
      </div>

      <div className="px-4 py-4">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Main</div>
        <nav className="space-y-1">
          {menuItems.slice(0, 3).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                  isActive 
                    ? 'bg-[#f0f1f5] text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[13px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-4 px-2">Management</div>
        <nav className="space-y-1">
          {menuItems.slice(3, 7).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                  isActive 
                    ? 'bg-[#f0f1f5] text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[13px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-4 px-2">Reports</div>
        <nav className="space-y-1">
          {menuItems.slice(7).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                  isActive 
                    ? 'bg-[#f0f1f5] text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[13px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
          <span className="text-lg">🚪</span>
          <span className="text-[13px] font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

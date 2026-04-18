'use client';

import { usePathname } from 'next/navigation';

export default function TopBar() {
  const pathname = usePathname();
  
  const titles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/booking': 'Bookings',
    '/calendar': 'Calendar',
    '/guests': 'Guests & Clients',
    '/menu': 'Menu & Catering',
    '/staff': 'Staff Management',
    '/finance': 'Finance',
    '/beo': 'BEO Documents',
  };

  const title = titles[pathname] || 'Dashboard';

  return (
    <header className="h-[70px] bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 transition-all">
          <span className="text-xl">☰</span>
        </button>
        <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all shadow-md shadow-blue-100 flex items-center gap-2 uppercase tracking-wide">
          <span className="text-lg">＋</span>
          <span>New Booking</span>
        </button>

        <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
          <div className="text-right hidden sm:block">
            <div className="text-[13px] font-bold text-gray-900 leading-none">Admin</div>
            <div className="text-[10px] text-green-500 font-bold mt-1.5 flex items-center gap-1.5 justify-end uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Logged in
            </div>
          </div>
          <div className="w-10 h-10 bg-[#f7f8fa] rounded-full flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}

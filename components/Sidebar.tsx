'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItem = (href: string, icon: string, label: string) => {
    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
    return (
      <Link
        key={href}
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          active
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <span className="text-base">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="w-[240px] bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏛</span>
          <div>
            <div className="font-bold text-sm tracking-widest text-gray-800 uppercase">BanquetPro</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400">Teatro Banquet Hall</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Main</p>
        {navItem('/dashboard', '📊', 'Dashboard')}
        {navItem('/bookings', '📋', 'Bookings')}
        {navItem('/bookings/new', '➕', 'New Booking')}
        {navItem('/calendar', '📅', 'Calendar')}

        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2 mt-4">Operations</p>
        {navItem('/venues', '🏛', 'Venues & Halls')}
        {navItem('/guests', '👥', 'Guests & Clients')}
        {navItem('/menu', '🍽', 'Menu & Catering')}
        {navItem('/staff', '👔', 'Staff')}
        {navItem('/finance', '💰', 'Finance')}
        {navItem('/templates', '🧾', 'Templates')}

        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2 mt-4">System</p>
        {navItem('/settings', '⚙️', 'Settings')}
        {navItem('/beo', '📄', 'BEO Documents')}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors"
        >
          <span className="text-base">🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

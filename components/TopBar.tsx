'use client';

import { usePathname } from 'next/navigation';

type TopBarProps = {
  onMenuClick?: () => void;
};

export default function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();

  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/bookings': 'All Bookings',
    '/calendar': 'Calendar',
    '/guests': 'Guests & Clients',
    '/menu': 'Menu & Catering',
    '/staff': 'Staff & Assignments',
    '/finance': 'Finance & Payments',
    '/beo': 'BEO Documents',
  };

  const title =
    Object.entries(titles).find(
      ([route]) => pathname === route || pathname.startsWith(`${route}/`)
    )?.[1] || 'Dashboard';

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={onMenuClick}>
          ☰
        </button>
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-actions" />
    </div>
  );
}

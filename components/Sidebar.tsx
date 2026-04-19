'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    {
      section: 'Main',
      items: [
        { href: '/dashboard', icon: '📊', label: 'Dashboard' },
        { href: '/bookings', icon: '📋', label: 'Bookings' },
        { href: '/calendar', icon: '📅', label: 'Calendar' },
      ],
    },
    {
      section: 'Management',
      items: [
        { href: '/guests', icon: '👥', label: 'Guests & Clients' },
        { href: '/menu', icon: '🍽', label: 'Menu & Catering' },
        { href: '/staff', icon: '👔', label: 'Staff' },
        { href: '/finance', icon: '💰', label: 'Finance' },
      ],
    },
    {
      section: 'Reports',
      items: [{ href: '/beo', icon: '📄', label: 'BEO Documents' }],
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🏛</span>
        <span className="sidebar-logo-text">BanquetPro</span>
      </div>

      <div className="sidebar-user">
        <strong>Logged in</strong>
        Teatro Team
      </div>

      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <div key={group.section}>
            <div className="nav-section">{group.section}</div>
            {group.items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleSignOut}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}

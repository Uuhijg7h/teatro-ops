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

  const navItem = (href: string, icon: string, label: string) => {
    const active =
      pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

    return (
      <Link
        key={href}
        href={href}
        onClick={onClose}
        className={`nav-item ${active ? 'active' : ''}`}
      >
        <span className="icon">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🏛</span>
        <span className="sidebar-logo-text">BanquetPro</span>
      </div>

      <div className="sidebar-user">
        <strong>Teatro Team</strong>
        Logged in
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">Main</div>
        {navItem('/dashboard', '📊', 'Dashboard')}
        {navItem('/bookings', '📋', 'Bookings')}
        {navItem('/calendar', '📅', 'Calendar')}

        <div className="nav-section">Management</div>
        {navItem('/guests', '👥', 'Guests & Clients')}
        {navItem('/menu', '🍽', 'Menu & Catering')}
        {navItem('/staff', '👔', 'Staff')}
        {navItem('/finance', '💰', 'Finance')}

        <div className="nav-section">Reports</div>
        {navItem('/beo', '📄', 'BEO Documents')}
      </nav>

      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleSignOut}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}

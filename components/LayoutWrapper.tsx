'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage = pathname?.startsWith('/login');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div id="app" style={{ display: 'block', minHeight: '100vh' }}>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className="layout">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="main">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="content">{children}</div>
        </main>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

const fmt = (n: number) => '$' + (n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function statusBadge(status: string) {
  const map: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    tentative: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-600',
  };
  return `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`;
}

function payBadge(status: string) {
  const map: Record<string, string> = {
    fully_paid: 'bg-green-100 text-green-700',
    deposit_paid: 'bg-blue-100 text-blue-700',
    outstanding: 'bg-orange-100 text-orange-700',
  };
  const label: Record<string, string> = {
    fully_paid: 'Fully Paid',
    deposit_paid: 'Deposit Paid',
    outstanding: 'Outstanding',
  };
  return { cls: map[status] || 'bg-gray-100 text-gray-600', label: label[status] || status };
}

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data: all } = await supabase.from('bookings').select('*');
      const { data: upcoming } = await supabase
        .from('bookings')
        .select('*')
        .gte('event_date', today)
        .order('event_date', { ascending: true })
        .limit(5);
      setBookings(all || []);
      setUpcomingBookings(upcoming || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((s, b) => s + (b.total_amount || 0), 0);
  const totalCollected = bookings.reduce((s, b) => s + (b.deposit_paid || 0), 0);
  const totalOutstanding = totalRevenue - totalCollected;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const today = new Date().toISOString().split('T')[0];
  const upcomingCount = bookings.filter(b => b.event_date >= today).length;

  const stats = [
    { label: 'Total Bookings', value: totalBookings, sub: `${confirmedCount} confirmed`, color: 'bg-blue-50 text-blue-600' },
    { label: 'Upcoming Events', value: upcomingCount, sub: 'Next 12 months', color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Revenue', value: fmt(totalRevenue), sub: fmt(totalCollected) + ' collected', color: 'bg-green-50 text-green-600' },
    { label: 'Outstanding', value: fmt(totalOutstanding), sub: 'Balance due', color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/bookings/new" className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors">
          <span>+</span><span>NEW BOOKING</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : s.value}</p>
            <p className={`text-xs mt-1 font-medium px-2 py-0.5 rounded-full inline-block ${s.color}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
          <Link href="/bookings" className="text-xs text-gray-500 hover:text-gray-900 font-medium">View all bookings →</Link>
        </div>
        {loading ? (
          <div className="p-6 text-center text-sm text-gray-400">Loading...</div>
        ) : upcomingBookings.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">No upcoming bookings.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3 text-left">Event</th>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Hall</th>
                <th className="px-6 py-3 text-left">Guests</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Payment</th>
              </tr>
            </thead>
            <tbody>
              {upcomingBookings.map((b, i) => {
                const pay = payBadge(b.payment_status);
                return (
                  <tr key={b.id} className={`hover:bg-gray-50 ${i !== upcomingBookings.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <td className="px-6 py-4">
                      <Link href={`/bookings/${b.id}`} className="font-medium text-gray-900 hover:underline">
                        {b.event_type || b.event_name || 'Event'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.client_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {b.event_date ? new Date(b.event_date + 'T00:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.hall || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.guests || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{fmt(b.total_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={statusBadge(b.status)}>{b.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${pay.cls}`}>{pay.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { href: '/bookings', label: 'All Bookings', desc: 'Manage all events', icon: '📋' },
          { href: '/guests', label: 'Guests & Clients', desc: 'Client database', icon: '👥' },
          { href: '/menu', label: 'Menu & Catering', desc: 'Packages & items', icon: '🍽️' },
          { href: '/finance', label: 'Finance', desc: 'Payments & revenue', icon: '💰' },
        ].map(q => (
          <Link key={q.href} href={q.href} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow group">
            <div className="text-2xl mb-2">{q.icon}</div>
            <p className="font-semibold text-gray-900 group-hover:text-gray-700">{q.label}</p>
            <p className="text-xs text-gray-400 mt-1">{q.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

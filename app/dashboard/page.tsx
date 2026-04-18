'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

type Booking = {
  id: string;
  customer_name: string;
  event_name: string;
  event_date: string;
  venue: string;
  total_amount: number;
  paid_amount: number;
  status: string;
};

const fmt = (n: number) => '$' + (n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('event_date', { ascending: false })
        .limit(5);
      if (data) setBookings(data as Booking[]);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const totalCollected = bookings.reduce((sum, b) => sum + (b.paid_amount || 0), 0);
  const totalOutstanding = totalRevenue - totalCollected;

  const stats = [
    { label: 'TOTAL BOOKINGS', value: totalBookings, color: 'text-blue-600', icon: '📊', sub: 'Last 5 entries' },
    { label: 'ESTIMATED REVENUE', value: fmt(totalRevenue), color: 'text-gray-900', icon: '💰', sub: 'Total for listed' },
    { label: 'AMOUNT COLLECTED', value: fmt(totalCollected), color: 'text-green-600', icon: '📥', sub: 'Total paid' },
    { label: 'OUTSTANDING', value: fmt(totalOutstanding), color: 'text-red-600', icon: '⏳', sub: 'Balance due' },
  ];

  if (loading) return <div className="p-8 text-gray-400">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-[11px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Recent Bookings</h3>
            <Link href="/booking" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase">View All →</Link>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f7f8fa]">
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Client</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-center">Date</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-center">Status</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{b.customer_name}</div>
                    <div className="text-[11px] text-gray-400 uppercase font-bold">{b.event_name}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-semibold text-gray-700">{b.event_date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      b.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {b.status === 'confirmed' ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-black text-gray-900">{fmt(b.total_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Halls In Use / Sidebar Content */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-4">Halls Configuration</h3>
            <div className="space-y-4">
              {[
                { name: 'Teatro Restaurant', cap: '120 Seated / 160 Standing', color: 'bg-blue-600' },
                { name: 'Sipario Room', cap: '40 Seated / 60 Standing', color: 'bg-green-600' },
                { name: 'Camera Privata', cap: '15 Seated / 15 Standing', color: 'bg-amber-600' },
                { name: 'La Sala Grande', cap: '150 Seated / 200 Standing', color: 'bg-indigo-600' },
              ].map((hall, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-1 h-8 rounded-full ${hall.color} mt-0.5`} />
                  <div>
                    <div className="text-xs font-black text-gray-900 uppercase">{hall.name}</div>
                    <div className="text-[11px] text-gray-400 font-bold">{hall.cap}</div>
                  </div>Update dashboard with CAD currency and Teatro halls list
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl shadow-sm text-white">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Business Location</div>
            <div className="text-xs font-bold leading-relaxed">
              495 Welland Avenue,<br />
              St. Catharines, ON,<br />
              Canada
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Currency</span>
              <span className="text-xs font-black text-blue-400">CAD ($)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

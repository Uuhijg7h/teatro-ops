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

const fmt = (n: number) => 'NPR ' + (n || 0).toLocaleString();

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('event_date', { ascending: false });
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
    { label: 'TOTAL BOOKINGS', value: totalBookings, color: 'text-blue-600', icon: '📅' },
    { label: 'ESTIMATED REVENUE', value: fmt(totalRevenue), color: 'text-gray-900', icon: '💰' },
    { label: 'AMOUNT COLLECTED', value: fmt(totalCollected), color: 'text-green-600', icon: '📥' },
    { label: 'OUTSTANDING', value: fmt(totalOutstanding), color: 'text-red-600', icon: '⏳' },
  ];

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

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
            <div className={`text-2xl font-black ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Recent Activity</h2>
            <Link href="/booking" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f7f8fa] border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Event</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-blue-600 group-hover:underline">{b.customer_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-gray-700">{b.event_name}</div>
                        <div className="text-[11px] text-gray-400 font-medium">{b.event_date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-black text-gray-900">{fmt(b.total_amount)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          b.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                          b.paid_amount > 0 ? 'bg-blue-50 text-blue-600' : 
                          'bg-red-50 text-red-600'
                        }`}>
                          {b.status === 'confirmed' ? '✓ Paid' : b.paid_amount > 0 ? '◑ Deposit' : '✗ Outstanding'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions / Hall Status */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Hall Availability</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            {['Main Hall', 'Royal Suite', 'Garden Terrace'].map((hall) => {
              const count = bookings.filter(b => b.venue === hall).length;
              return (
                <div key={hall} className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-bold text-gray-700">{hall}</div>
                    <div className="text-[11px] text-gray-400 uppercase font-medium tracking-tighter">{count} Bookings This Month</div>
                  </div>
                  <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(count * 20, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

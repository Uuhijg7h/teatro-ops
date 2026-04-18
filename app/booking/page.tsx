'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

type Booking = {
  id: string;
  customer_name: string;
  contact_number?: string;
  event_name: string;
  event_date: string;
  created_at: string;
  venue: string;
  guests: number;
  total_amount: number;
  paid_amount: number;
  status: string;
};

export default function BookingPage() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

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

  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.event_name?.toLowerCase().includes(search.toLowerCase());

    if (filter === 'All') return matchesSearch;
    if (filter === 'Paid') return matchesSearch && b.status === 'confirmed';
    if (filter === 'Deposit') return matchesSearch && b.paid_amount > 0 && b.paid_amount < b.total_amount;
    if (filter === 'Outstanding') return matchesSearch && b.paid_amount === 0;
    return matchesSearch;
  });

  const fmt = (n: number) => '$' + (n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (loading) return <div className="p-8 text-gray-400">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search name, phone, email, res#"
            className="w-full pl-12 pr-4 py-2.5 bg-[#f7f8fa] border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-[#1a1a1a]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-[#f7f8fa] p-1 rounded-lg">
          {['All', 'Paid', 'Deposit', 'Outstanding'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {f} ({
                f === 'All' ? bookings.length :
                f === 'Paid' ? bookings.filter(b => b.status === 'confirmed').length :
                f === 'Deposit' ? bookings.filter(b => b.paid_amount > 0 && b.paid_amount < b.total_amount).length :
                bookings.filter(b => b.paid_amount === 0).length
              })
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f7f8fa] border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Res #</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Event Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Booked On</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hall</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Guests</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total (CAD)</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paid (CAD)</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredBookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600 uppercase">
                  T{b.id.slice(0, 4).toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  <div className="text-[13px] font-bold text-gray-900">{b.customer_name}</div>
                  <div className="text-[11px] text-gray-400">{b.event_name}</div>
                </td>
                <td className="px-6 py-4 text-[13px] text-gray-600">{b.contact_number || 'N/A'}</td>
                <td className="px-6 py-4 text-[13px] font-semibold text-gray-900">{b.event_date}</td>
                <td className="px-6 py-4 text-[11px] text-gray-400">
                  {new Date(b.created_at).toISOString().split('T')[0]}
                </td>
                <td className="px-6 py-4 text-[13px] text-gray-600">{b.venue}</td>
                <td className="px-6 py-4 text-[13px] font-bold text-gray-900 text-center">{b.guests}</td>
                <td className="px-6 py-4 text-[13px] font-bold text-gray-900">{fmt(b.total_amount)}</td>Update booking page with CAD currency and Canadian formatting
                <td className="px-6 py-4 text-[13px] font-bold text-green-600">{fmt(b.paid_amount)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
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
  );
}

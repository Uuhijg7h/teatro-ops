'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

type Booking = {
  id: string;
  reservation_number: string;
  client_name: string;
  event_type: string;
  contact_phone: string;
  contact_email: string;
  event_date: string;
  booked_on: string;
  hall: string;
  manager: string;
  guest_count: number;
  total_amount: number;
  amount_paid: number;
  status: string;
};

function fmt(n: number) {
  return 'CAD ' + (n || 0).toLocaleString('en-CA', { minimumFractionDigits: 0 });
}

export default function BookingPage() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('event_date', { ascending: true });
      if (data) setBookings(data);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const filtered = bookings.filter(b => {
    const matchSearch =
      !search ||
      b.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.contact_phone?.includes(search) ||
      b.contact_email?.toLowerCase().includes(search.toLowerCase()) ||
      b.reservation_number?.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === 'all' ||
      (filter === 'paid' && (b.status === 'fully_paid' || b.status === 'Fully Paid')) ||
      (filter === 'deposit' && (b.status === 'deposit_paid' || b.status === 'Deposit Paid')) ||
      (filter === 'outstanding' && (b.status === 'outstanding' || b.status === 'Outstanding'));

    return matchSearch && matchFilter;
  });

  const allCount = bookings.length;
  const paidCount = bookings.filter(b => b.status === 'fully_paid' || b.status === 'Fully Paid').length;
  const depositCount = bookings.filter(b => b.status === 'deposit_paid' || b.status === 'Deposit Paid').length;
  const outstandingCount = bookings.filter(b => b.status === 'outstanding' || b.status === 'Outstanding').length;

  const statusBadge = (status: string) => {
    if (status === 'fully_paid' || status === 'Fully Paid')
      return <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">✓ Fully Paid</span>;
    if (status === 'deposit_paid' || status === 'Deposit Paid')
      return <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">◑ Deposit Paid</span>;
    return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">✗ Outstanding</span>;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
        <Link
          href="/booking/new"
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
        >
          <span>＋</span> NEW BOOKING
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search name, phone, email, res#"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: `All (${allCount})` },
            { key: 'paid', label: `✓ Paid (${paidCount})` },
            { key: 'deposit', label: `◑ Deposit (${depositCount})` },
            { key: 'outstanding', label: `✗ Outstanding (${outstandingCount})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['RES #', 'CLIENT NAME', 'CONTACT', 'EVENT DATE', 'BOOKED ON', 'HALL', 'MANAGER', 'GUESTS', 'TOTAL', 'DEPOSIT', 'STATUS'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11} className="py-10 text-center text-gray-400">No bookings found</td></tr>
              ) : (
                filtered.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 text-gray-500 text-xs font-mono">{b.reservation_number || 'T' + b.id?.slice(0,4).toUpperCase()}</td>
                    <td className="py-3 px-3">
                      <Link href={`/booking/${b.id}`} className="font-semibold text-blue-600 hover:underline">{b.client_name}</Link>
                      <div className="text-xs text-gray-400">{b.event_type}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-gray-700">{b.contact_phone}</div>
                      <div className="text-xs text-gray-400">{b.contact_email}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">{b.event_date}</td>
                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">{b.booked_on || b.created_at?.split('T')[0]}</td>
                    <td className="py-3 px-3 text-gray-700">{b.hall}</td>
                    <td className="py-3 px-3 text-gray-700">{b.manager}</td>
                    <td className="py-3 px-3 text-gray-700 text-center">{b.guest_count}</td>
                    <td className="py-3 px-3 font-semibold text-gray-900">{fmt(b.total_amount)}</td>
                    <td className="py-3 px-3 font-semibold text-green-700">{fmt(b.amount_paid)}</td>
                    <td className="py-3 px-3">{statusBadge(b.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

type Booking = {
  id: string;
  res_no: string;
  client_name: string;
  email: string;
  phone: string;
  event_date: string;
  booking_date: string;
  hall: string;
  guests: number;
  event_type: string;
  total_amount: number;
  deposit_paid: number;
  balance_due: number;
  payment_status: string;
  manager_name: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('event_date', { ascending: true });
    setBookings(data || []);
    setLoading(false);
  }

  const filtered = bookings.filter(b => {
    const matchSearch = !search ||
      b.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.includes(search) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.res_no?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ||
      (filter === 'paid' && b.payment_status === 'fully_paid') ||
      (filter === 'deposit' && b.payment_status === 'deposit_paid') ||
      (filter === 'outstanding' && b.payment_status === 'outstanding');
    return matchSearch && matchFilter;
  });

  const counts = {
    all: bookings.length,
    paid: bookings.filter(b => b.payment_status === 'fully_paid').length,
    deposit: bookings.filter(b => b.payment_status === 'deposit_paid').length,
    outstanding: bookings.filter(b => b.payment_status === 'outstanding').length,
  };

  const statusBadge = (status: string) => {
    if (status === 'fully_paid') return <span className="px-2 py-1 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">✓ Fully Paid</span>;
    if (status === 'deposit_paid') return <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">🔶 Deposit Paid</span>;
    return <span className="px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200">× Outstanding</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">All Bookings</h1>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search name, phone, email, res#"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <span className="absolute left-2.5 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>
        <div className="flex gap-2">
          {[['all', 'All'], ['paid', 'Paid'], ['deposit', 'Deposit'], ['outstanding', 'Outstanding']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filter === key
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter === key || key === 'all' ? `${label} (${counts[key as keyof typeof counts]})` : `${label} (${counts[key as keyof typeof counts]})`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Res #</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booked On</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hall</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Manager</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deposit</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11} className="text-center py-12 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={11} className="text-center py-12 text-gray-400">No bookings found</td></tr>
            ) : (
              filtered.map(b => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 text-xs">{b.res_no}</td>
                  <td className="px-4 py-3">
                    <Link href={`/booking/${b.id}`} className="text-blue-600 hover:underline font-medium">{b.client_name}</Link>
                    <div className="text-xs text-gray-400">{b.event_type}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{b.phone}</div>
                    <div className="text-xs text-gray-400">{b.email}</div>
                  </td>
                  <td className="px-4 py-3 font-medium">{b.event_date}</td>
                  <td className="px-4 py-3 text-gray-500">{b.booking_date}</td>
                  <td className="px-4 py-3">{b.hall}</td>
                  <td className="px-4 py-3 text-gray-600">{b.manager_name}</td>
                  <td className="px-4 py-3">{b.guests}</td>
                  <td className="px-4 py-3 font-medium">CAD {b.total_amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-green-600">CAD {b.deposit_paid?.toLocaleString()}</td>
                  <td className="px-4 py-3">{statusBadge(b.payment_status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

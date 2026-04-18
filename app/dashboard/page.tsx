'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

type Booking = {
  id: string;
  client_name: string;
  event_type: string;
  event_date: string;
  hall: string;
  total_amount: number;
  amount_paid: number;
  status: string;
};

function fmt(n: number) {
  return 'CAD ' + n.toLocaleString('en-CA', { minimumFractionDigits: 0 });
}

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('event_date', { ascending: false });
      if (data) setBookings(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const totalBookings = bookings.length;
  const estimatedRevenue = bookings.reduce((s, b) => s + (b.total_amount || 0), 0);
  const amountCollected = bookings.reduce((s, b) => s + (b.amount_paid || 0), 0);
  const outstandingBalance = estimatedRevenue - amountCollected;
  const collectedPct = estimatedRevenue > 0 ? Math.round((amountCollected / estimatedRevenue) * 100) : 0;

  const fullyPaid = bookings.filter(b => b.status === 'fully_paid' || b.status === 'Fully Paid').length;
  const depositOnly = bookings.filter(b => b.status === 'deposit_paid' || b.status === 'Deposit Paid').length;
  const outstanding = bookings.filter(b => b.status === 'outstanding' || b.status === 'Outstanding').length;

  // Halls in use
  const hallMap: { [h: string]: number } = {};
  bookings.forEach(b => {
    if (b.hall) hallMap[b.hall] = (hallMap[b.hall] || 0) + 1;
  });

  const today = new Date().toISOString().split('T')[0];
  const upcomingCount = bookings.filter(b => b.event_date >= today).length;

  const recentBookings = [...bookings].slice(0, 10);

  const statusBadge = (status: string) => {
    if (status === 'fully_paid' || status === 'Fully Paid') {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">✓ Fully Paid</span>;
    } else if (status === 'deposit_paid' || status === 'Deposit Paid') {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">◑ Deposit Paid</span>;
    } else {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">✗ Outstanding</span>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Bookings */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Total Bookings</p>
          <p className="text-4xl font-bold text-gray-900">{totalBookings}</p>
          <p className="text-sm text-gray-500 mt-1">{upcomingCount} upcoming events</p>
        </div>

        {/* Estimated Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Estimated Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{fmt(estimatedRevenue)}</p>
          <p className="text-sm text-gray-500 mt-1">All bookings combined</p>
        </div>

        {/* Amount Collected */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Amount Collected</p>
          <p className="text-2xl font-bold text-green-600">{fmt(amountCollected)}</p>
          <p className="text-sm text-gray-500 mt-1">{collectedPct}% of total revenue</p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
            <div className="h-1.5 bg-green-500 rounded-full" style={{ width: collectedPct + '%' }} />
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Outstanding Balance</p>
          <p className="text-2xl font-bold text-red-600">{fmt(outstandingBalance)}</p>
          <p className="text-sm text-gray-500 mt-1">{outstanding} bookings unpaid</p>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Payment Status Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Payment Status Overview</h2>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{fullyPaid}</p>
              <p className="text-xs text-gray-500 mt-1">Fully Paid</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">{depositOnly}</p>
              <p className="text-xs text-gray-500 mt-1">Deposit Only</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{outstanding}</p>
              <p className="text-xs text-gray-500 mt-1">Outstanding</p>
            </div>
          </div>
        </div>

        {/* Halls In Use */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Halls In Use</h2>
          {Object.keys(hallMap).length === 0 ? (
            <p className="text-sm text-gray-400">No hall data available</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(hallMap).map(([hall, count]) => (
                <div key={hall} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{hall}</span>
                  <span className="text-sm font-semibold text-blue-600">{count} booking{count > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
          <Link href="/booking" className="text-sm text-blue-600 hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Client</th>
                <th className="text-left py-2 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Event Date</th>
                <th className="text-left py-2 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Hall</th>
                <th className="text-left py-2 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                <th className="text-left py-2 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left py-2 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">No bookings yet</td></tr>
              ) : (
                recentBookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-medium text-gray-900">{b.client_name}</div>
                      <div className="text-xs text-gray-400">{b.event_type}</div>
                    </td>
                    <td className="py-3 px-3 text-gray-700">{b.event_date}</td>
                    <td className="py-3 px-3 text-gray-700">{b.hall}</td>
                    <td className="py-3 px-3 text-gray-700 font-medium">{fmt(b.total_amount)}</td>
                    <td className="py-3 px-3">{statusBadge(b.status)}</td>
                    <td className="py-3 px-3">
                      <Link href={`/booking/${b.id}`} className="text-xs border border-gray-300 px-2 py-1 rounded hover:bg-gray-50">View / BEO</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

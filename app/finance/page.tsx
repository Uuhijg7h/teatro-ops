'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Booking = {
  id: string;
  reservation_number: string;
  client_name: string;
  event_type: string;
  event_date: string;
  total_amount: number;
  amount_paid: number;
  status: string;
  manager: string;
};

function fmt(n: number) {
  return 'CAD ' + (n || 0).toLocaleString('en-CA', { minimumFractionDigits: 0 });
}

export default function FinancePage() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('bookings').select('*').order('event_date');
      if (data) setBookings(data);
      setLoading(false);
    };
    load();
  }, []);

  const totalRevenue = bookings.reduce((s, b) => s + (b.total_amount || 0), 0);
  const totalCollected = bookings.reduce((s, b) => s + (b.amount_paid || 0), 0);
  const outstanding = totalRevenue - totalCollected;

  const statusBadge = (status: string) => {
    if (status === 'fully_paid' || status === 'Fully Paid')
      return <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">✓ Fully Paid</span>;
    if (status === 'deposit_paid' || status === 'Deposit Paid')
      return <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">◑ Deposit Paid</span>;
    return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">✗ Outstanding</span>;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Finance & Payments</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Total Estimated Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{fmt(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Total Collected</p>
          <p className="text-2xl font-bold text-green-600">{fmt(totalCollected)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Outstanding Balance</p>
          <p className="text-2xl font-bold text-red-600">{fmt(outstanding)}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Payment Breakdown Per Booking</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['RES #','CLIENT','EVENT DATE','ESTIMATED TOTAL','DEPOSIT PAID','BALANCE DUE','STATUS'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-gray-400">No bookings found</td></tr>
              ) : (
                bookings.map(b => {
                  const balanceDue = (b.total_amount || 0) - (b.amount_paid || 0);
                  const isCleared = balanceDue <= 0;
                  return (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-500 text-xs font-mono">{b.reservation_number || b.id?.slice(0,6)}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{b.client_name}</div>
                        <div className="text-xs text-gray-400">{b.event_type} · {b.manager}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{b.event_date}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{fmt(b.total_amount)}</td>
                      <td className="py-3 px-4 font-semibold text-green-700">{fmt(b.amount_paid)}</td>
                      <td className="py-3 px-4">{isCleared ? <span className="font-semibold text-green-600">Cleared ✓</span> : <span className="font-semibold text-red-600">{fmt(balanceDue)}</span>}</td>
                      <td className="py-3 px-4">{statusBadge(b.status)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

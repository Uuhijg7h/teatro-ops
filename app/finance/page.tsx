'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Booking = {
  id: string;
  customer_name: string;
  event_name: string;
  event_date: string;
  total_amount: number;
  paid_amount: number;
  status: string;
};

const fmt = (n: number) => 'NPR ' + (n || 0).toLocaleString();

export default function FinancePage() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('event_date', { ascending: false });
      if (data) setBookings(data as Booking[]);
      setLoading(false);
    };
    loadData();
  }, []);

  const totalRevenue = bookings.reduce((s, b) => s + (b.total_amount || 0), 0);
  const totalCollected = bookings.reduce((s, b) => s + (b.paid_amount || 0), 0);
  const outstanding = totalRevenue - totalCollected;

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Finance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Revenue</div>
          <div className="text-2xl font-black text-gray-900">{fmt(totalRevenue)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Collected</div>
          <div className="text-2xl font-black text-green-600">{fmt(totalCollected)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Outstanding</div>
          <div className="text-2xl font-black text-red-600">{fmt(outstanding)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#f7f8fa]">
          <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Payment Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f7f8fa] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Event Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Total Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Paid Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Balance</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="text-[13px] font-bold text-blue-600">{b.customer_name}</div>
                    <div className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">{b.event_name}</div>
                  </td>
                  <td className="px-6 py-5 text-[13px] font-bold text-gray-700">{b.event_date}</td>
                  <td className="px-6 py-5 text-[13px] font-black text-gray-900 text-right">{fmt(b.total_amount)}</td>
                  <td className="px-6 py-5 text-[13px] font-black text-green-600 text-right">{fmt(b.paid_amount)}</td>
                  <td className="px-6 py-5 text-[13px] font-black text-red-600 text-right">{fmt(b.total_amount - b.paid_amount)}</td>
                  <td className="px-6 py-5">
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
  );
}

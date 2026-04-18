'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

type Booking = {
  id: string;
  reservation_number: string;
  client_name: string;
  event_type: string;
  event_date: string;
  hall: string;
  guest_count: number;
  manager: string;
  status: string;
};

export default function BEOPage() {
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

  const statusBadge = (status: string) => {
    if (status === 'fully_paid' || status === 'Fully Paid')
      return <span className="text-xs font-semibold text-green-700">✓ Fully Paid</span>;
    if (status === 'deposit_paid' || status === 'Deposit Paid')
      return <span className="text-xs font-semibold text-orange-600">◑ Deposit Paid</span>;
    return <span className="text-xs font-semibold text-red-600">✗ Outstanding</span>;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">BEO Documents</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="p-5 border-b border-gray-100">
          <p className="text-sm text-gray-500">All BEO Documents — Click any booking to view & print BEO</p>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['RES #','CLIENT NAME','EVENT TYPE','EVENT DATE','HALL','GUESTS','MANAGER','STATUS','BEO'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={9} className="py-10 text-center text-gray-400">No bookings found</td></tr>
              ) : (
                bookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-500 text-xs font-mono">{b.reservation_number || b.id?.slice(0,6)}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{b.client_name}</td>
                    <td className="py-3 px-4 text-gray-700">{b.event_type}</td>
                    <td className="py-3 px-4 text-gray-700">{b.event_date}</td>
                    <td className="py-3 px-4 text-gray-700">{b.hall}</td>
                    <td className="py-3 px-4 text-gray-700 text-center">{b.guest_count}</td>
                    <td className="py-3 px-4 text-gray-700">{b.manager}</td>
                    <td className="py-3 px-4">{statusBadge(b.status)}</td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/booking/${b.id}?print=beo`}
                        className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                      >
                        <span>📄</span> Open BEO
                      </Link>
                    </td>
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

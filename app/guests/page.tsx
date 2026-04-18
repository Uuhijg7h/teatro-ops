'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

type Booking = {
  id: string;
  reservation_number: string;
  client_name: string;
  contact_phone: string;
  contact_email: string;
  event_type: string;
  event_date: string;
  guest_count: number;
  hall: string;
  manager: string;
  status: string;
};

function initials(name: string) {
  return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';
}

export default function GuestsPage() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('bookings').select('*').order('client_name');
      if (data) setBookings(data);
      setLoading(false);
    };
    fetch();
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Guests & Clients</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['CLIENT', 'CONTACT', 'EVENT TYPE', 'EVENT DATE', 'GUESTS', 'HALL', 'MANAGER', 'STATUS'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={8} className="py-10 text-center text-gray-400">No guests found</td></tr>
              ) : (
                bookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {initials(b.client_name)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{b.client_name}</div>
                          <div className="text-xs text-gray-400">{b.reservation_number}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-700">{b.contact_phone}</div>
                      <div className="text-xs text-gray-400">{b.contact_email}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{b.event_type}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{b.event_date}</td>
                    <td className="py-3 px-4 text-gray-700 text-center">{b.guest_count}</td>
                    <td className="py-3 px-4 text-gray-700">{b.hall}</td>
                    <td className="py-3 px-4 text-gray-700">{b.manager}</td>
                    <td className="py-3 px-4">{statusBadge(b.status)}</td>
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

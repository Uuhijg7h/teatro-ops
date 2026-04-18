'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

type Booking = {
  id: string;
  res_no: string;
  client_name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string;
  guests: number;
  hall: string;
  manager_name: string;
  payment_status: string;
};

function initials(name: string) {
  return name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??';
}

function avatarBg(name: string) {
  const colors = ['bg-teal-100 text-teal-700','bg-blue-100 text-blue-700','bg-purple-100 text-purple-700','bg-orange-100 text-orange-700','bg-pink-100 text-pink-700'];
  return colors[(name?.charCodeAt(0) || 0) % colors.length];
}

const statusBadge = (status: string) => {
  if (status === 'fully_paid') return <span className="px-2 py-1 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">&#10003; Fully Paid</span>;
  if (status === 'deposit_paid') return <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">&#9654; Deposit Paid</span>;
  return <span className="px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200">&#215; Outstanding</span>;
};

export default function GuestsPage() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('bookings')
        .select('id,res_no,client_name,phone,email,event_type,event_date,guests,hall,manager_name,payment_status')
        .order('client_name', { ascending: true });
      setBookings(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Guests &amp; Clients</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Type</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hall</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Manager</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">No clients yet</td></tr>
            ) : (
              bookings.map(b => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarBg(b.client_name)}`}>
                        {initials(b.client_name)}
                      </div>
                      <div>
                        <Link href={`/booking/${b.id}`} className="font-medium text-gray-900 hover:text-blue-600">{b.client_name}</Link>
                        <div className="text-xs text-gray-400">{b.res_no}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-gray-700">{b.phone}</div>
                    <div className="text-xs text-gray-400">{b.email}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{b.event_type}</td>
                  <td className="px-5 py-3 text-gray-700">{b.event_date}</td>
                  <td className="px-5 py-3 text-gray-700">{b.guests}</td>
                  <td className="px-5 py-3 text-gray-700">{b.hall}</td>
                  <td className="px-5 py-3 text-gray-600">{b.manager_name}</td>
                  <td className="px-5 py-3">{statusBadge(b.payment_status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

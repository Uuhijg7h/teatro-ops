'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Booking = {
  id: string;
  customer_name: string;
  contact_number?: string;
  event_name: string;
  event_date: string;
  guests: number;
  venue: string;
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
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('customer_name', { ascending: true });
      if (data) setBookings(data as Booking[]);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#f7f8fa]">
          <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Guest Directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f7f8fa] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Event</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Venue</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-[11px] font-black">
                        {initials(b.customer_name)}
                      </div>
                      <div className="text-[13px] font-bold text-gray-900">{b.customer_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[13px] font-bold text-gray-700">{b.contact_number || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[13px] font-bold text-gray-900">{b.event_date}</div>
                    <div className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">{b.event_name}</div>
                  </td>
                  <td className="px-6 py-5 text-[13px] font-bold text-gray-600 uppercase tracking-tight">{b.venue}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      b.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                      'bg-red-50 text-red-600'
                    }`}>
                      {b.status === 'confirmed' ? 'Active' : 'Pending'}
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

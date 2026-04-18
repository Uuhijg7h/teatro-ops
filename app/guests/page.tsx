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
  const [search, setSearch] = useState('');

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

  const filteredGuests = bookings.filter(b =>
    b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.contact_number?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-gray-400">Loading guests...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search guests by name or contact..."
            className="w-full pl-12 pr-4 py-2.5 bg-[#f7f8fa] border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {filteredGuests.length} Total Clients
        </div>
      </div>

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
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Guests</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredGuests.map((b) => (
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
                    <div className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">{b.event_name}</div>
                  </td>
                  <td className="px-6 py-5 text-center text-[13px] font-black text-gray-900">{b.guests}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      b.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
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

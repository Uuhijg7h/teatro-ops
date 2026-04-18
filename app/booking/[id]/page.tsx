'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchBooking = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', params.id)
        .single();
      if (data) setBooking(data);
      setLoading(false);
    };
    fetchBooking();
  }, [params.id, supabase]);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;
  if (!booking) return <div className="p-8 text-center text-gray-400">Booking not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">{booking.client_name} — {booking.event_type}</h1>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">✕ Close</button>
        </div>

        <div className="flex gap-8 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            📋 Full Details
          </button>
          <button
            onClick={() => setActiveTab('beo')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'beo' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            📄 BEO Preview
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'details' ? (
            <div className="p-8 space-y-8">
              <section>
                <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-4">Client Information</h3>
                <div className="border-t border-gray-100">
                  {[
                    ['Booking Contact', booking.client_name],
                    ['Email', booking.client_email || 'n/a'],
                    ['Phone', booking.client_phone || 'n/a'],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-2 py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm text-right font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-4">Event Details</h3>
                <div className="border-t border-gray-100">
                  {[
                    ['Reservation #', booking.reservation_number || booking.id?.slice(0,6)],
                    ['Event Date', booking.event_date],
                    ['Hall / Location', booking.hall],
                    ['Number of Guests', booking.guest_count],
                    ['Booking Manager', booking.manager],
                    ['Status', booking.status],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-2 py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm text-right font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="p-12">
              <div className="flex justify-between items-start mb-10">
                <div className="w-28 h-28 border-4 border-black flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl">🏛️</div>
                    <div className="text-[9px] font-black uppercase">Teatro</div>
                  </div>
                </div>
                <div className="flex-1 ml-10 border border-gray-300">
                  <div className="grid grid-cols-2 border-b border-gray-300">
                    <div className="p-2 text-[10px] font-bold bg-gray-50 border-r border-gray-300">RESERVATION #</div>
                    <div className="p-2 text-[10px]">{booking.reservation_number || booking.id?.slice(0,6)}</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-gray-300">
                    <div className="p-2 text-[10px] font-bold bg-gray-50 border-r border-gray-300">DATE CREATED</div>
                    <div className="p-2 text-[10px]">{booking.created_at?.split('T')[0]}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="p-2 text-[10px] font-bold bg-gray-50 border-r border-gray-300">EVENT DATE</div>
                    <div className="p-2 text-[10px]">{booking.event_date}</div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-base font-bold underline uppercase tracking-widest">Event Type: {booking.event_type}</h2>
                <p className="text-[10px] italic text-gray-500 mt-2">
                  Thank you for choosing us for your event! The team will have copies of this during the event. Feel free to print yourself a copy.
                </p>
              </div>

              <h3 className="text-center text-sm font-black uppercase tracking-widest mb-4">Banquet Event Order</h3>
              <div className="border border-black mb-6">
                {[
                  ['LOCATION', booking.hall, 'BOOKING CONTACT', booking.client_name],
                  ['# OF GUESTS', booking.guest_count, 'EVENT DATE', booking.event_date],
                  ['START TIME', '5:00 PM', 'END TIME', '11:00 PM'],
                  ['SALESPERSON', booking.manager, 'ON-SITE MGR', booking.manager],
                ].map(([l1, v1, l2, v2]) => (
                  <div key={String(l1)} className="grid grid-cols-2 border-b border-black last:border-b-0">
                    <div className="grid grid-cols-2 border-r border-black">
                      <div className="p-2 text-[10px] font-bold bg-gray-100 border-r border-black">{l1}</div>
                      <div className="p-2 text-[10px]">{v1}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="p-2 text-[10px] font-bold bg-gray-100 border-r border-black">{l2}</div>
                      <div className="p-2 text-[10px]">{v2}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="bg-gray-800 text-white p-2 text-[10px] font-bold uppercase tracking-wider">Billing Details</div>
                <div className="text-[10px] space-y-1">
                  <p>CAD per person x {booking.guest_count} guests</p>
                  <p className="font-bold">Estimated Total based on package pricing</p>
                  <p>Payment Status: {booking.status}</p>
                </div>
                <p className="text-[8px] italic border-t border-gray-300 pt-4">
                  Prices are exclusive of taxes and applicable service charges. Guarantee numbers are required 72 hours prior to the event.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-md text-sm font-semibold hover:bg-gray-50">
            Close
          </button>
          <button onClick={() => window.print()} className="px-5 py-2 bg-gray-900 text-white rounded-md text-sm font-semibold hover:bg-gray-800">
            🖨️ Print / Export BEO
          </button>
        </div>
      </div>
    </div>
  );
}

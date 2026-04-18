'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h1 className="text-xl font-bold text-gray-900">{booking.client_name} — {booking.event_type}</h1>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-6 no-print">
          <button 
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'details' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            📋 Full Details
            {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
          <button 
            onClick={() => setActiveTab('beo')}
            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'beo' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            📄 BEO Preview
            {activeTab === 'beo' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {activeTab === 'details' ? (
            <div className="p-8 space-y-8">
              <section>
                <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-4">Client Information</h3>
                <div className="grid grid-cols-1 border-t border-gray-100">
                  {[
                    ['Booking Contact', booking.client_name],
                    ['On-Site Contact', booking.client_name],
                    ['Email', booking.client_email || 'n/a'],
                    ['Phone', booking.client_phone || 'n/a']
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-2 py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm text-gray-900 font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-4">Event Details</h3>
                <div className="grid grid-cols-1 border-t border-gray-100">
                  {[
                    ['Reservation #', booking.reservation_number || booking.id.slice(0,6)],
                    ['Date of Booking', booking.created_at?.split('T')[0]],
                    ['Event Date', booking.event_date],
                    ['Hall / Location', booking.hall],
                    ['Number of Guests', booking.guest_count],
                    ['Start → End Time', `${booking.start_time || '5:00 PM'} → ${booking.end_time || '11:00 PM'}`],
                    ['Setup Start Time', 'Day before after 3pm'],
                    ['Food Type / Style', 'Nepali/Indian — Buffet'],
                    ['Booking Manager', booking.manager],
                    ['On-Site Manager', booking.manager]
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-2 py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm text-gray-900 font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="p-12 print:p-0">
              <div className="flex justify-between items-start mb-12">
                <div className="w-32 h-32 border-4 border-black flex items-center justify-center p-2">
                  <div className="text-center">
                    <div className="text-3xl">🏛️</div>
                    <div className="text-[10px] font-black uppercase leading-tight mt-1">Your Venue Name</div>
                  </div>
                </div>
                <div className="flex-1 ml-12 border border-gray-200">
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="p-2 text-[10px] font-bold bg-gray-50 border-r border-gray-200">RESERVATION #</div>
                    <div className="p-2 text-[10px] font-mono">{booking.reservation_number || booking.id.slice(0,6)}</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="p-2 text-[10px] font-bold bg-gray-50 border-r border-gray-200">DATE CREATED</div>
                    <div className="p-2 text-[10px] font-mono">{booking.created_at?.split('T')[0]}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="p-2 text-[10px] font-bold bg-gray-50 border-r border-gray-200">DATE REVISED</div>
                    <div className="p-2 text-[10px] font-mono">2026-04-18</div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-lg font-bold underline uppercase tracking-widest">Event Type: {booking.event_type}</h2>
                <p className="text-[10px] italic text-gray-500 mt-2 max-w-xl mx-auto">
                  Thank you for choosing us for your event! We are so happy to work with you, please see the details below of your event. The team will have a few copies of this on hand during the event to ensure everything is organized. Feel free to print yourself a copy.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-center text-sm font-black uppercase tracking-[0.2em] mb-4">Banquet Event Order</h3>
                <div className="border border-black">
                  <div className="grid grid-cols-2 border-b border-black">
                    <div className="grid grid-cols-2 border-r border-black">
                      <div className="p-2 text-[10px] font-bold bg-gray-100 border-r border-black">DAY OF EVENT</div>
                      <div className="p-2 text-[10px]">Sunday</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="p-2 text-[10px] font-bold bg-gray-100 border-r border-black">EVENT DATE</div>
                      <div className="p-2 text-[10px]">{booking.event_date}</div>
                    </div>
                  </div>
                  {/* Additional BEO rows */}
                  <div className="grid grid-cols-2 border-b border-black">
                    <div className="grid grid-cols-2 border-r border-black">
                      <div className="p-2 text-[10px] font-bold bg-gray-100 border-r border-black">LOCATION</div>
                      <div className="p-2 text-[10px]">{booking.hall}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="p-2 text-[10px] font-bold bg-gray-100 border-r border-black">BOOKING CONTACT</div>
                      <div className="p-2 text-[10px]">{booking.client_name}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-black">
                    <div className="grid grid-cols-2 border-r border-black">
                      <div className="p-2 text-[10px] font-bold bg-gray-100 border-r border-black"># OF GUESTS</div>
                      <div className="p-2 text-[10px]">{booking.guest_count}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="p-2 text-[10px] font-bold bg-gray-100 border-r border-black">ON-SITE CONTACT</div>
                      <div className="p-2 text-[10px]">{booking.client_name}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-800 text-white p-1.5 text-[10px] font-bold uppercase tracking-widest">Event Setup Details</div>
                <p className="text-[10px] leading-relaxed">
                  Round tables of 10, floral centerpieces, dance floor in center, head table for 12, white and gold linen<br/>
                  <strong>Additional items:</strong> Client providing floral arch and photo booth
                </p>

                <div className="bg-gray-800 text-white p-1.5 text-[10px] font-bold uppercase tracking-widest">***Food Details — Halal required for all meat. 10 vegetarian guests.</div>
                <div className="grid grid-cols-1 gap-4 text-[10px]">
                   <div><strong>Appetizer</strong><ul className="list-disc ml-4 mt-1"><li>Mixed vegetable samosas</li><li>Chicken tikka skewers</li></ul></div>
                   <div><strong>Mains</strong><ul className="list-disc ml-4 mt-1"><li>Butter chicken</li><li>Dal makhani</li><li>Lamb curry</li><li>Pilaf rice</li><li>Naan</li></ul></div>
                </div>

                <div className="bg-gray-800 text-white p-1.5 text-[10px] font-bold uppercase tracking-widest">Beverage Details</div>
                <p className="text-[10px]">Open bar: Beer, Wine, Soft drinks. Premium spirits on consumption.</p>

                <div className="bg-gray-800 text-white p-1.5 text-[10px] font-bold uppercase tracking-widest">Billing Details</div>
                <div className="text-[10px] space-y-1">
                  <p>CAD 800 x {booking.guest_count} guests = CAD {800 * booking.guest_count}</p>
                  <p>Bar on consumption</p>
                  <p>50% deposit paid on booking</p>
                  <div className="pt-2 border-t border-dashed border-gray-300">
                    <p className="font-bold">Estimated Total: CAD {(800 * booking.guest_count * 1.5).toFixed(2)}</p>
                    <p>Deposit Paid: CAD {(800 * booking.guest_count * 0.75).toFixed(2)}</p>
                    <p>Balance Due: CAD {(800 * booking.guest_count * 0.75).toFixed(2)}</p>
                  </div>
                  <p className="text-orange-600 font-bold mt-2">50% Deposit Paid — Balance Outstanding</p>
                </div>

                <p className="text-[8px] italic border-t border-black pt-4">
                  Prices are exclusive of taxes and applicable service charges. Guarantee numbers are required 72 hours prior to the event and will be considered the final numbers to be charged. Final numbers are not required when purchasing packages as they cannot be adjusted after the event is organized and the contract is finalized.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4 no-print">
          <button className="px-6 py-2 bg-white border border-gray-200 rounded-md text-sm font-semibold hover:bg-gray-50">Close</button>
          <button className="px-6 py-2 bg-white border border-gray-200 rounded-md text-sm font-semibold hover:bg-gray-50 flex items-center gap-2">
            ✏️ Edit Booking
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-2 bg-gray-900 text-white rounded-md text-sm font-semibold hover:bg-gray-800 flex items-center gap-2"
          >
            🖨️ Print / Export BEO
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print\\:p-0 { padding: 0 !important; }
          .shadow-sm { shadow: none !important; }
        }
      `}</style>
    </div>
  );
}

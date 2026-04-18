'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const fmt = (n: number) => '$' + (n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function BookingDetailPage() {
  const params = useParams();
  const id = params?.id;
  const supabase = createClientComponentClient();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from('bookings').select('*').eq('id', id).single().then(({ data }) => {
      setBooking(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-6 text-center text-gray-400">Loading...</div>;
  if (!booking) return <div className="p-6 text-center text-gray-400">Booking not found.</div>;

  const balance = (booking.total_amount || 0) - (booking.deposit_paid || 0);

  const sections = [
    { title: 'Client Information', fields: [
      ['Booking Contact', booking.client_name],
      ['On-Site Contact', booking.onsite_contact || 'Same as booking contact'],
      ['Email', booking.email || '-'],
      ['Phone', booking.phone || '-'],
    ]},
    { title: 'Event Details', fields: [
      ['Event Type', booking.event_type || '-'],
      ['Event Date', booking.event_date ? new Date(booking.event_date + 'T00:00:00').toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }) : '-'],
      ['Hall / Location', booking.hall || '-'],
      ['Number of Guests', booking.guests || '-'],
      ['Start Time', booking.start_time || '-'],
      ['End Time', booking.end_time || '-'],
      ['Setup Start Time', booking.setup_time || '-'],
    ]},
    { title: 'Food & Beverage', fields: [
      ['Food Type / Style', booking.food_style || '-'],
      ['Apps / Beverages', booking.apps || '-'],
      ['Dietary Notes', booking.dietary_notes || '-'],
    ]},
    { title: 'Finance', fields: [
      ['Estimated Total (CAD)', fmt(booking.total_amount)],
      ['Deposit Paid (CAD)', fmt(booking.deposit_paid)],
      ['Balance Due (CAD)', fmt(balance)],
      ['Payment Status', booking.payment_status || '-'],
    ]},
    { title: 'Staff Assignment', fields: [
      ['Booking Manager', booking.manager_name || '-'],
      ['On-Site Manager', booking.onsite_mgr_name || 'Same as booking manager'],
    ]},
  ];

  if (booking.notes) {
    sections.push({ title: 'Internal Notes', fields: [['Notes', booking.notes]] });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/bookings" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">&larr; Back to Bookings</Link>
          <h2 className="text-2xl font-bold text-gray-900">{booking.event_type || 'Booking'} Details</h2>
          <p className="text-sm text-gray-500 mt-1">ID: {booking.id}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/beo?id=${booking.id}`} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            View BEO
          </Link>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700">Edit Booking</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {sections.map(sec => (
          <div key={sec.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{sec.title}</h3>
            <div className="space-y-3">
              {sec.fields.map(([label, value], i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Status Badge */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Status</h3>
        <div className="flex gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
            booking.status === 'tentative' ? 'bg-yellow-100 text-yellow-700' :
            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {booking.status || 'Unknown'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            booking.payment_status === 'fully_paid' ? 'bg-green-100 text-green-700' :
            booking.payment_status === 'deposit_paid' ? 'bg-blue-100 text-blue-700' :
            'bg-orange-100 text-orange-700'
          }`}>
            {booking.payment_status === 'fully_paid' ? 'Fully Paid' :
             booking.payment_status === 'deposit_paid' ? 'Deposit Paid' :
             'Outstanding'}
          </span>
        </div>
      </div>
    </div>
  );
}

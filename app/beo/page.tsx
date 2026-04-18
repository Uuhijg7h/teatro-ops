'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSearchParams } from 'next/navigation';

export default function BEOPage() {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');
  const supabase = createClientComponentClient();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    supabase.from('bookings').select('*').eq('id', id).single().then(({ data }) => {
      setBooking(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-6 text-center text-gray-400">Loading...</div>;
  if (!id) return <div className="p-6"><p className="text-gray-500">Please select a booking to view its BEO.</p></div>;
  if (!booking) return <div className="p-6 text-center text-gray-400">Booking not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      {/* Header */}
      <div className="border-b-4 border-gray-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">BANQUET EVENT ORDER</h1>
        <p className="text-sm text-gray-500 mt-1">Teatro Banquet Hall</p>
      </div>

      {/* Event Info */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Event Information</p>
          <p className="font-semibold text-gray-900 text-lg">{booking.event_type || 'Event'}</p>
          <p className="text-sm text-gray-600">Date: {booking.event_date ? new Date(booking.event_date + 'T00:00:00').toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }) : '-'}</p>
          <p className="text-sm text-gray-600">Time: {booking.start_time || '-'} - {booking.end_time || '-'}</p>
          <p className="text-sm text-gray-600">Hall: {booking.hall || '-'}</p>
          <p className="text-sm text-gray-600">Guests: {booking.guests || '-'}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Client Information</p>
          <p className="font-semibold text-gray-900">{booking.client_name}</p>
          {booking.email && <p className="text-sm text-gray-600">{booking.email}</p>}
          {booking.phone && <p className="text-sm text-gray-600">{booking.phone}</p>}
          <p className="text-sm text-gray-600 mt-2">On-Site Contact: {booking.onsite_contact || 'Same as booking'}</p>
        </div>
      </div>

      {/* Food & Beverage */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Food & Beverage</p>
        <p className="text-sm text-gray-700">Style: {booking.food_style || 'TBD'}</p>
        <p className="text-sm text-gray-700">Apps/Beverages: {booking.apps || 'None'}</p>
        {booking.dietary_notes && <p className="text-sm text-gray-700 mt-1">Dietary Notes: {booking.dietary_notes}</p>}
      </div>

      {/* Setup */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Setup</p>
        <p className="text-sm text-gray-700">Setup Time: {booking.setup_time || 'TBD'}</p>
      </div>

      {/* Staff */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Staff Assignment</p>
        <p className="text-sm text-gray-700">Booking Manager: {booking.manager_name || '-'}</p>
        <p className="text-sm text-gray-700">On-Site Manager: {booking.onsite_mgr_name || 'Same as booking manager'}</p>
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="border-t border-gray-200 pt-4 mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Internal Notes</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{booking.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t-2 border-gray-900 pt-4 mt-8 text-center">
        <p className="text-xs text-gray-400">BEO ID: {booking.id} | Generated: {new Date().toLocaleString('en-CA')}</p>
        <button onClick={() => window.print()} className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 print:hidden">
          Print BEO
        </button>
      </div>

      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

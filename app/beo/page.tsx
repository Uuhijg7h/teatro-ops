'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSearchParams } from 'next/navigation';
import { formatCad } from '../../lib/banquetpro/pricing';

function field(booking: any, ...keys: string[]) {
  for (const key of keys) {
    if (booking?.[key] !== undefined && booking?.[key] !== null && booking?.[key] !== '') return booking[key];
  }
  return '—';
}

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

  const total = Number(field(booking, 'grand_total', 'total', 'total_amount') === '—' ? 0 : field(booking, 'grand_total', 'total', 'total_amount'));

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white print:p-4">
      <div className="flex items-start justify-between border-b-4 border-gray-900 pb-5 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">BanquetPro</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Banquet Event Order</h1>
          <p className="text-sm text-gray-500 mt-1">Teatro Banquet Hall • 495 Welland Avenue, St. Catharines, Ontario</p>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p><span className="font-semibold text-gray-900">Booking ID:</span> {booking.id}</p>
          <p><span className="font-semibold text-gray-900">Generated:</span> {new Date().toLocaleString('en-CA')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <section className="rounded-xl border border-gray-200 p-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Event Information</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-semibold text-gray-900">Event:</span> {field(booking, 'event_title', 'event_type', 'type')}</p>
            <p><span className="font-semibold text-gray-900">Date:</span> {field(booking, 'event_date', 'eventdate')}</p>
            <p><span className="font-semibold text-gray-900">Time:</span> {field(booking, 'start_time', 'starttime')} - {field(booking, 'end_time', 'endtime')}</p>
            <p><span className="font-semibold text-gray-900">Venue:</span> {field(booking, 'venue_name', 'hall')}</p>
            <p><span className="font-semibold text-gray-900">Guests:</span> {field(booking, 'guest_confirmed', 'guests', 'guest_expected')}</p>
            <p><span className="font-semibold text-gray-900">Pipeline Status:</span> {field(booking, 'status')}</p>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 p-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Client Information</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-semibold text-gray-900">Booking Contact:</span> {field(booking, 'client_name', 'name')}</p>
            <p><span className="font-semibold text-gray-900">Company:</span> {field(booking, 'company_name')}</p>
            <p><span className="font-semibold text-gray-900">Email:</span> {field(booking, 'email')}</p>
            <p><span className="font-semibold text-gray-900">Phone:</span> {field(booking, 'phone')}</p>
            <p><span className="font-semibold text-gray-900">On-Site Contact:</span> {field(booking, 'onsite_contact_name', 'onsite_contact', 'onsite')}</p>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Food & Beverage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p><span className="font-semibold text-gray-900">Food Type:</span> {field(booking, 'food_type')}</p>
            <p><span className="font-semibold text-gray-900">Food Package:</span> {field(booking, 'food_package_name', 'food_style', 'foodstyle')}</p>
            <p><span className="font-semibold text-gray-900">Beverage:</span> {field(booking, 'beverage_mode', 'bev', 'bar_type')}</p>
          </div>
          <div>
            <p><span className="font-semibold text-gray-900">Dietary Notes:</span> {field(booking, 'dietary_notes', 'dietary')}</p>
            <p><span className="font-semibold text-gray-900">Allergy Notes:</span> {field(booking, 'allergy_notes')}</p>
            <p><span className="font-semibold text-gray-900">Centrepieces:</span> {booking.centrepieces_included ? 'Included' : 'Not included'}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p><span className="font-semibold text-gray-900">Setup Time:</span> {field(booking, 'setup_time', 'setuptime')}</p>
            <p><span className="font-semibold text-gray-900">Decoration Access:</span> {field(booking, 'decoration_access_time')}</p>
            <p><span className="font-semibold text-gray-900">Teardown:</span> {field(booking, 'teardown_time')}</p>
          </div>
          <div>
            <p><span className="font-semibold text-gray-900">Booking Manager:</span> {field(booking, 'manager_name', 'manager')}</p>
            <p><span className="font-semibold text-gray-900">On-Site Manager:</span> {field(booking, 'onsite_mgr_name', 'onsitemgr')}</p>
            <p><span className="font-semibold text-gray-900">Contract Signed:</span> {booking.contract_signed ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Financial Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <p><span className="font-semibold text-gray-900">Payment Status:</span> {field(booking, 'payment_status', 'payment')}</p>
          <p><span className="font-semibold text-gray-900">Amount Paid:</span> {formatCad(Number(field(booking, 'amount_paid', 'deposit_amount', 'deposit') === '—' ? 0 : field(booking, 'amount_paid', 'deposit_amount', 'deposit')))}</p>
          <p><span className="font-semibold text-gray-900">Grand Total:</span> {formatCad(total)}</p>
        </div>
      </section>

      {field(booking, 'notes', 'internal_notes') !== '—' ? (
        <section className="rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Internal Notes</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{field(booking, 'notes', 'internal_notes')}</p>
        </section>
      ) : null}

      <div className="border-t border-gray-200 pt-5 mt-8 flex items-center justify-between print:hidden">
        <div className="text-xs text-gray-400">Client-ready print view</div>
        <button onClick={() => window.print()} className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700">
          Print BEO
        </button>
      </div>

      <style jsx global>{`
        @media print {
          body { background: #fff; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

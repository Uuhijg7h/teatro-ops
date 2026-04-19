'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatCad } from '../../../lib/banquetpro/pricing';

function getValue(booking: any, ...keys: string[]) {
  for (const key of keys) {
    if (booking?.[key] !== undefined && booking?.[key] !== null && booking?.[key] !== '') return booking[key];
  }
  return undefined;
}

function getMoney(booking: any, ...keys: string[]) {
  return Number(getValue(booking, ...keys) || 0);
}

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

  const financials = useMemo(() => {
    if (!booking) return null;
    const grandTotal = getMoney(booking, 'grand_total', 'total_amount', 'total');
    const paid = getMoney(booking, 'amount_paid', 'deposit_paid', 'deposit_amount', 'deposit');
    const balance = Math.max(0, grandTotal - paid);
    return { grandTotal, paid, balance };
  }, [booking]);

  if (loading) return <div className="p-6 text-center text-gray-400">Loading...</div>;
  if (!booking) return <div className="p-6 text-center text-gray-400">Booking not found.</div>;

  const sections = [
    {
      title: 'Client Information',
      fields: [
        ['Booking Contact', getValue(booking, 'client_name', 'name') || '—'],
        ['Company', getValue(booking, 'company_name') || '—'],
        ['On-Site Contact', getValue(booking, 'onsite_contact_name', 'onsite_contact', 'onsite') || '—'],
        ['Email', getValue(booking, 'email') || '—'],
        ['Phone', getValue(booking, 'phone') || '—'],
      ],
    },
    {
      title: 'Event Details',
      fields: [
        ['Event Title', getValue(booking, 'event_title') || '—'],
        ['Event Type', getValue(booking, 'event_type', 'type') || '—'],
        ['Event Date', getValue(booking, 'event_date', 'eventdate') || '—'],
        ['Venue / Hall', getValue(booking, 'venue_name', 'hall') || '—'],
        ['Confirmed Guests', getValue(booking, 'guest_confirmed', 'guests') || '0'],
        ['Expected Guests', getValue(booking, 'guest_expected') || '0'],
        ['Minimum Guests', getValue(booking, 'guest_minimum', 'guest_min') || '0'],
        ['Start Time', getValue(booking, 'start_time', 'starttime') || '—'],
        ['End Time', getValue(booking, 'end_time', 'endtime') || '—'],
        ['Setup Time', getValue(booking, 'setup_time', 'setuptime') || '—'],
        ['Decoration Access', getValue(booking, 'decoration_access_time') || '—'],
        ['Teardown Time', getValue(booking, 'teardown_time') || '—'],
      ],
    },
    {
      title: 'Food & Beverage',
      fields: [
        ['Food Type', getValue(booking, 'food_type') || '—'],
        ['Service Style', getValue(booking, 'service_style') || '—'],
        ['Food Package', getValue(booking, 'food_package_name', 'foodstyle') || '—'],
        ['Beverage Mode', getValue(booking, 'beverage_mode', 'bev', 'bar_type') || '—'],
        ['Centrepieces', booking.centrepieces_included ? 'Yes' : 'No'],
        ['Centrepiece Notes', getValue(booking, 'centrepieces_notes') || '—'],
        ['Dietary Notes', getValue(booking, 'dietary_notes', 'dietary') || '—'],
        ['Allergy Notes', getValue(booking, 'allergy_notes') || '—'],
      ],
    },
    {
      title: 'Finance',
      fields: [
        ['Grand Total (CAD)', formatCad(financials?.grandTotal || 0)],
        ['Paid (CAD)', formatCad(financials?.paid || 0)],
        ['Balance Due (CAD)', formatCad(financials?.balance || 0)],
        ['Payment Status', getValue(booking, 'payment_status', 'payment') || '—'],
        ['Deposit Received', booking.deposit_received ? 'Yes' : 'No'],
        ['Final Payment Received', booking.final_payment_received ? 'Yes' : 'No'],
      ],
    },
    {
      title: 'Operations',
      fields: [
        ['Pipeline Status', getValue(booking, 'status') || '—'],
        ['Contract Signed', booking.contract_signed ? 'Yes' : 'No'],
        ['Lead Source', getValue(booking, 'lead_source') || '—'],
        ['Manager', getValue(booking, 'manager_name', 'manager') || '—'],
        ['On-Site Manager', getValue(booking, 'onsite_mgr_name', 'onsitemgr') || '—'],
      ],
    },
  ];

  const notes = [
    ['Special Requests', getValue(booking, 'special_requests')],
    ['Internal Notes', getValue(booking, 'internal_notes', 'notes')],
    ['Client-Facing Notes', getValue(booking, 'client_facing_notes')],
  ].filter(([, value]) => value);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/bookings" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">&larr; Back to Bookings</Link>
          <h2 className="text-2xl font-bold text-gray-900">{getValue(booking, 'event_title', 'event_type', 'type') || 'Booking'} Details</h2>
          <p className="text-sm text-gray-500 mt-1">ID: {booking.id}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/beo?id=${booking.id}`} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            View BEO
          </Link>
          <Link href={`/bookings/new?id=${booking.id}`} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700">
            Edit Booking
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {sections.map((sec) => (
          <div key={sec.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{sec.title}</h3>
            <div className="space-y-3">
              {sec.fields.map(([label, value], i) => (
                <div key={i} className="flex justify-between gap-4">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {notes.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Notes</h3>
          <div className="space-y-4">
            {notes.map(([label, value]) => (
              <div key={label}>
                <div className="text-sm font-medium text-gray-900 mb-1">{label}</div>
                <div className="text-sm text-gray-600 whitespace-pre-wrap">{value as string}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

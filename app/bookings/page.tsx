'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { formatCad } from '../../lib/banquetpro/pricing';

function getClientName(booking: any) {
  return booking.client_name || booking.name || 'Unnamed Client';
}

function getReservationNo(booking: any) {
  return booking.res_no || booking.resno || '—';
}

function getVenueName(booking: any) {
  return booking.hall || booking.venue_name || '—';
}

function getGuestCount(booking: any) {
  return booking.guest_confirmed || booking.guests || booking.guest_expected || 0;
}

function getEventType(booking: any) {
  return booking.event_type || booking.type || 'Event';
}

function getTotal(booking: any) {
  return booking.grand_total || booking.total_amount || booking.total || 0;
}

function getPaid(booking: any) {
  return booking.amount_paid || booking.deposit_paid || booking.deposit_amount || booking.deposit || 0;
}

function getPaymentStatus(booking: any) {
  return booking.payment_status || booking.payment || 'unpaid';
}

function getPipelineStatus(booking: any) {
  return booking.status || 'new_inquiry';
}

function paymentBadge(status: string) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'paid' || normalized === 'fully_paid') {
    return <span className="px-2 py-1 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">Paid</span>;
  }
  if (normalized === 'deposit_paid' || normalized === 'deposit') {
    return <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Deposit Paid</span>;
  }
  if (normalized === 'partially_paid') {
    return <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Partially Paid</span>;
  }
  return <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">Outstanding</span>;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    const { data } = await supabase.from('bookings').select('*').order('event_date', { ascending: true });
    setBookings(data || []);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    return bookings.filter((booking) => {
      const haystack = [
        getClientName(booking),
        booking.email,
        booking.phone,
        getReservationNo(booking),
        getVenueName(booking),
        getEventType(booking),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !search || haystack.includes(search.toLowerCase());
      const status = getPaymentStatus(booking);
      const matchesPayment = paymentFilter === 'all' || String(status).toLowerCase() === paymentFilter;
      return matchesSearch && matchesPayment;
    });
  }, [bookings, search, paymentFilter]);

  const counts = {
    all: bookings.length,
    unpaid: bookings.filter((b) => ['unpaid', 'outstanding'].includes(String(getPaymentStatus(b)).toLowerCase())).length,
    deposit_paid: bookings.filter((b) => ['deposit_paid', 'deposit'].includes(String(getPaymentStatus(b)).toLowerCase())).length,
    paid: bookings.filter((b) => ['paid', 'fully_paid'].includes(String(getPaymentStatus(b)).toLowerCase())).length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">BanquetPro booking list with compatibility support for legacy and new booking fields.</p>
        </div>
        <Link href="/bookings/new" className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800">
          New Booking
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search client, phone, email, venue, res#"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <span className="absolute left-2.5 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            ['all', `All (${counts.all})`],
            ['unpaid', `Outstanding (${counts.unpaid})`],
            ['deposit_paid', `Deposit (${counts.deposit_paid})`],
            ['paid', `Paid (${counts.paid})`],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setPaymentFilter(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                paymentFilter === value
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Res #</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Venue</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pipeline</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="text-center py-12 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-12 text-gray-400">No bookings found</td></tr>
            ) : (
              filtered.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 text-xs">{getReservationNo(booking)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/bookings/${booking.id}`} className="text-blue-600 hover:underline font-medium">
                      {getClientName(booking)}
                    </Link>
                    <div className="text-xs text-gray-400">{booking.email || booking.phone || '—'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{booking.event_title || getEventType(booking)}</div>
                    <div className="text-xs text-gray-400">{getEventType(booking)}</div>
                  </td>
                  <td className="px-4 py-3 font-medium">{booking.event_date || '—'}</td>
                  <td className="px-4 py-3">{getVenueName(booking)}</td>
                  <td className="px-4 py-3">{getGuestCount(booking)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{getPipelineStatus(booking)}</td>
                  <td className="px-4 py-3">{paymentBadge(getPaymentStatus(booking))}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCad(getTotal(booking))}</td>
                  <td className="px-4 py-3 text-right text-green-700">{formatCad(getPaid(booking))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

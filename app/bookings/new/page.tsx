'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  createDefaultBookingFormState,
  patchBookingCore,
  patchBookingPricing,
  setCentrepieces,
  setFoodType,
  setPaymentStatus,
} from '../../../lib/banquetpro/booking-form';
import { formatCad } from '../../../lib/banquetpro/pricing';
import { getDefaultVenues } from '../../../lib/banquetpro/venues';

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const supabase = createClientComponentClient();

  const [state, setState] = useState(createDefaultBookingFormState());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const pricing = useMemo(() => state.booking.pricing, [state]);
  const totalGuests = Number(state.pricingInput.adultCount || 0) + Number(state.pricingInput.kidsCount || 0);
  const matchedVenue = getDefaultVenues().find((venue) => venue.name.toLowerCase() === (state.booking.venueName || '').toLowerCase());
  const seatedCapacityExceeded = matchedVenue ? totalGuests > matchedVenue.seatedCapacity : false;

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId) return;
      setLoading(true);
      try {
        const { data } = await supabase.from('bookings').select('*').eq('id', bookingId).single();
        if (!data) return;

        setState((current) => ({
          ...current,
          booking: {
            ...current.booking,
            id: data.id,
            clientName: data.client_name || data.name || '',
            companyName: data.company_name || '',
            email: data.email || '',
            phone: data.phone || '',
            eventTitle: data.event_title || '',
            eventType: data.event_type || data.type || '',
            eventDate: data.event_date || data.eventdate || '',
            venueName: data.venue_name || data.hall || '',
            foodType: data.food_type || 'italian',
            centrepiecesIncluded: Boolean(data.centrepieces_included),
            centrepiecesNotes: data.centrepieces_notes || '',
            paymentStatus: data.payment_status || data.payment || 'unpaid',
            status: data.status || 'new_inquiry',
            pricing: {
              ...current.booking.pricing,
              subtotal: Number(data.subtotal || 0),
              taxAmount: Number(data.tax_amount || 0),
              gratuityAmount: Number(data.gratuity_amount || 0),
              grandTotal: Number(data.grand_total || data.total_amount || data.total || 0),
              depositAmount: Number(data.deposit_amount || data.deposit_paid || data.deposit || 0),
              amountPaid: Number(data.amount_paid || data.deposit_paid || data.deposit || 0),
              balanceDue: Number(data.balance_due || 0),
            },
          },
          pricingInput: {
            ...current.pricingInput,
            adultCount: Number(data.adult_count || 0),
            adultRate: Number(data.adult_rate || 0),
            kidsCount: Number(data.kids_count || 0),
            kidsRate: Number(data.kids_rate || 0),
            cakeCuttingFee: Number(data.cake_cutting_fee || 0),
            hallRentalFee: Number(data.hall_rental_fee || 0),
            beverageSubtotal: Number(data.beverage_subtotal || 0),
            addonsAmount: Number(data.addons_amount || 0),
            discountAmount: Number(data.discount_amount || 0),
            extraFees: Number(data.extra_fees || 0),
            depositAmount: Number(data.deposit_amount || data.deposit_paid || data.deposit || 0),
            customPaymentsTotal: Number((data.amount_paid || 0) - (data.deposit_amount || data.deposit_paid || data.deposit || 0)),
            taxRate: Number(data.tax_rate || 0.13),
            gratuityRate: Number(data.gratuity_rate || 0.18),
          },
        }));
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [bookingId]);

  async function saveBooking() {
    setError('');
    setMessage('');

    if (!state.booking.clientName.trim()) {
      setError('Client name is required.');
      return;
    }
    if (!state.booking.eventDate) {
      setError('Event date is required.');
      return;
    }
    if (state.pricingInput.adultRate < 0 || state.pricingInput.kidsRate < 0 || state.pricingInput.extraFees < 0 || state.pricingInput.cakeCuttingFee < 0) {
      setError('Rates and fees must be zero or greater.');
      return;
    }
    if (seatedCapacityExceeded) {
      setError(`Guest count exceeds the seated capacity for ${matchedVenue?.name}. Please reduce guests or choose a larger hall.`);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: bookingId || undefined,
        client_name: state.booking.clientName,
        company_name: state.booking.companyName,
        email: state.booking.email,
        phone: state.booking.phone,
        event_title: state.booking.eventTitle,
        event_type: state.booking.eventType,
        event_date: state.booking.eventDate,
        venue_name: state.booking.venueName,
        food_type: state.booking.foodType,
        centrepieces_included: state.booking.centrepiecesIncluded,
        centrepieces_notes: state.booking.centrepiecesNotes,
        payment_status: state.booking.paymentStatus,
        status: state.booking.status,
        adult_count: state.pricingInput.adultCount,
        adult_rate: state.pricingInput.adultRate,
        kids_count: state.pricingInput.kidsCount,
        kids_rate: state.pricingInput.kidsRate,
        cake_cutting_fee: state.pricingInput.cakeCuttingFee,
        extra_fees: state.pricingInput.extraFees,
        hall_rental_fee: state.pricingInput.hallRentalFee,
        beverage_subtotal: state.pricingInput.beverageSubtotal,
        addons_amount: state.pricingInput.addonsAmount,
        discount_amount: state.pricingInput.discountAmount,
        subtotal: pricing.subtotal,
        tax_rate: state.pricingInput.taxRate,
        tax_amount: pricing.taxAmount,
        gratuity_rate: state.pricingInput.gratuityRate,
        gratuity_amount: pricing.gratuityAmount,
        grand_total: pricing.grandTotal,
        deposit_amount: pricing.depositAmount,
        amount_paid: pricing.amountPaid,
        balance_due: pricing.balanceDue,
      };

      const { data, error } = await supabase.from('bookings').upsert(payload).select('id').single();
      if (error) throw error;
      if (data?.id) {
        setMessage('Booking saved successfully.');
        router.push(`/bookings/${data.id}`);
      }
    } catch {
      setError('Could not save booking. Please review the form and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{bookingId ? 'Edit Booking' : 'New Booking'}</h1>
          <p className="text-sm text-gray-500 mt-1">
            BanquetPro booking form wiring for Teatro: adults, kids, cake cutting fee, extras, centrepieces, food type, and payment status.
          </p>
        </div>
        <button onClick={saveBooking} disabled={saving || loading} className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50">
          {saving ? 'Saving…' : bookingId ? 'Save Changes' : 'Create Booking'}
        </button>
      </div>

      {message ? <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div> : null}
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="text-sm text-gray-400">Loading booking...</div> : null}
      {matchedVenue ? <div className={`rounded-lg px-4 py-3 text-sm border ${seatedCapacityExceeded ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>Venue capacity check: {matchedVenue.name} seated capacity {matchedVenue.seatedCapacity}. Current guest count {totalGuests}.</div> : null}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.booking.clientName} onChange={(e) => setState(patchBookingCore(state, { clientName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.booking.eventTitle} onChange={(e) => setState(patchBookingCore(state, { eventTitle: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
              <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.booking.eventDate} onChange={(e) => setState(patchBookingCore(state, { eventDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.booking.venueName || ''} onChange={(e) => setState(patchBookingCore(state, { venueName: e.target.value }))} placeholder="e.g. Teatro Restaurant" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.booking.paymentStatus} onChange={(e) => setState(setPaymentStatus(state, e.target.value as typeof state.booking.paymentStatus))}>
                <option value="unpaid">Unpaid</option>
                <option value="deposit_paid">Deposit Paid</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.booking.foodType} onChange={(e) => setState(setFoodType(state, e.target.value as 'indian' | 'italian' | 'custom'))}>
                <option value="indian">Indian</option>
                <option value="italian">Italian</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Centrepieces</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.booking.centrepiecesIncluded ? 'yes' : 'no'} onChange={(e) => setState(setCentrepieces(state, e.target.value === 'yes', state.booking.centrepiecesNotes || ''))}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
              <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.pricingInput.adultCount} onChange={(e) => setState(patchBookingPricing(state, { adultCount: Number(e.target.value || 0) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adult Rate</label>
              <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.pricingInput.adultRate} onChange={(e) => setState(patchBookingPricing(state, { adultRate: Number(e.target.value || 0) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kids</label>
              <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.pricingInput.kidsCount} onChange={(e) => setState(patchBookingPricing(state, { kidsCount: Number(e.target.value || 0) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kids Rate</label>
              <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.pricingInput.kidsRate} onChange={(e) => setState(patchBookingPricing(state, { kidsRate: Number(e.target.value || 0) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cake Cutting Fee</label>
              <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.pricingInput.cakeCuttingFee} onChange={(e) => setState(patchBookingPricing(state, { cakeCuttingFee: Number(e.target.value || 0) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Extras</label>
              <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={state.pricingInput.extraFees} onChange={(e) => setState(patchBookingPricing(state, { extraFees: Number(e.target.value || 0) }))} />
            </div>
          </div>
        </section>

        <aside className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Financial Summary</h2>
          <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Food Subtotal</span><span className="font-medium text-gray-900">{formatCad(pricing.foodSubtotal)}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium text-gray-900">{formatCad(pricing.subtotal)}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Tax</span><span className="font-medium text-gray-900">{formatCad(pricing.taxAmount)}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Gratuity</span><span className="font-medium text-gray-900">{formatCad(pricing.gratuityAmount)}</span></div>
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-sm"><span className="font-semibold text-gray-900">Grand Total</span><span className="font-semibold text-gray-900">{formatCad(pricing.grandTotal)}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Paid</span><span className="font-medium text-gray-900">{formatCad(pricing.amountPaid)}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Balance Due</span><span className="font-semibold text-orange-600">{formatCad(pricing.balanceDue)}</span></div>
        </aside>
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import {
  createDefaultBookingFormState,
  patchBookingCore,
  patchBookingPricing,
  setCentrepieces,
  setFoodType,
  setPaymentStatus,
} from '../../../lib/banquetpro/booking-form';
import { formatCad } from '../../../lib/banquetpro/pricing';

export default function NewBookingPage() {
  const [state, setState] = useState(createDefaultBookingFormState());
  const pricing = useMemo(() => state.booking.pricing, [state]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">New Booking</h1>
        <p className="text-sm text-gray-500 mt-1">
          BanquetPro booking form wiring for Teatro: adults, kids, cake cutting fee, extras, centrepieces, food type, and payment status.
        </p>
      </div>

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

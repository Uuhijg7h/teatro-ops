'use client';

import { useMemo } from 'react';
import { createDefaultBookingFormState } from '../../lib/banquetpro/booking-form';
import { getFinanceCardValues } from '../../lib/banquetpro/finance';
import { formatCad } from '../../lib/banquetpro/pricing';

export default function FinancePage() {
  const sampleA = createDefaultBookingFormState().booking;
  sampleA.id = 'sample-a';
  sampleA.clientName = 'Teatro Wedding Sample';
  sampleA.eventTitle = 'Wedding Reception';
  sampleA.eventDate = '2026-06-20';
  sampleA.paymentStatus = 'deposit_paid';
  sampleA.pricing = {
    ...sampleA.pricing,
    subtotal: 10000,
    taxAmount: 1300,
    gratuityAmount: 1800,
    grandTotal: 13100,
    depositAmount: 5000,
    customPaymentsTotal: 0,
    amountPaid: 5000,
    balanceDue: 8100,
  };

  const sampleB = createDefaultBookingFormState().booking;
  sampleB.id = 'sample-b';
  sampleB.clientName = 'Corporate Dinner Sample';
  sampleB.eventTitle = 'Corporate Dinner';
  sampleB.eventDate = '2026-05-15';
  sampleB.paymentStatus = 'paid';
  sampleB.pricing = {
    ...sampleB.pricing,
    subtotal: 4200,
    taxAmount: 546,
    gratuityAmount: 756,
    grandTotal: 5502,
    depositAmount: 2000,
    customPaymentsTotal: 3502,
    amountPaid: 5502,
    balanceDue: 0,
  };

  const bookings = [sampleA, sampleB];
  const finance = useMemo(() => getFinanceCardValues(bookings), [bookings]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Finance</h1>
        <p className="text-sm text-gray-500 mt-1">
          BanquetPro finance wiring now reads from the shared pricing and finance layer instead of old one-off booking fields.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total Revenue</div>
          <div className="text-2xl font-bold mt-2 text-green-600">{finance.totalRevenueLabel}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Collected</div>
          <div className="text-2xl font-bold mt-2 text-blue-600">{finance.totalCollectedLabel}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Outstanding</div>
          <div className="text-2xl font-bold mt-2 text-orange-600">{finance.totalOutstandingLabel}</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Booking Finance Snapshot</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Booking</th>
                <th className="px-5 py-3 text-left">Client</th>
                <th className="px-5 py-3 text-right">Grand Total</th>
                <th className="px-5 py-3 text-right">Paid</th>
                <th className="px-5 py-3 text-right">Balance</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{booking.eventTitle}</td>
                  <td className="px-5 py-4 text-gray-600">{booking.clientName}</td>
                  <td className="px-5 py-4 text-right font-medium text-gray-900">{formatCad(booking.pricing.grandTotal)}</td>
                  <td className="px-5 py-4 text-right text-gray-700">{formatCad(booking.pricing.amountPaid)}</td>
                  <td className="px-5 py-4 text-right font-medium text-orange-600">{formatCad(booking.pricing.balanceDue)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${booking.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : booking.paymentStatus === 'deposit_paid' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                      {booking.paymentStatus}
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

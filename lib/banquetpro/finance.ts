import { formatCad } from './pricing';
import type { Booking, BookingPaymentEntry } from './types';

export interface FinanceOverview {
  totalRevenue: number;
  totalCollected: number;
  totalOutstanding: number;
  bookingCount: number;
}

export function summarizeBookings(bookings: Booking[]): FinanceOverview {
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.pricing.grandTotal, 0);
  const totalCollected = bookings.reduce((sum, booking) => sum + booking.pricing.amountPaid, 0);
  const totalOutstanding = bookings.reduce((sum, booking) => sum + booking.pricing.balanceDue, 0);

  return {
    totalRevenue,
    totalCollected,
    totalOutstanding,
    bookingCount: bookings.length,
  };
}

export function createCustomPaymentEntry(
  amount: number,
  label = 'Custom Payment',
  method = 'manual',
): BookingPaymentEntry {
  return {
    id: `payment-${Date.now()}`,
    label,
    amount,
    method,
    paidAt: new Date().toISOString(),
  };
}

export function getFinanceCardValues(bookings: Booking[]) {
  const summary = summarizeBookings(bookings);
  return {
    ...summary,
    totalRevenueLabel: formatCad(summary.totalRevenue),
    totalCollectedLabel: formatCad(summary.totalCollected),
    totalOutstandingLabel: formatCad(summary.totalOutstanding),
  };
}

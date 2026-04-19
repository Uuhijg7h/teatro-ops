import { calculateBookingPricing } from './pricing';
import type { Booking, BookingCore, BookingPricingInput, BookingPricingSummary } from './types';

export function createEmptyBooking(): Booking {
  const pricing = calculateBookingPricing({});

  return {
    id: 'draft-booking',
    status: 'new_inquiry',
    paymentStatus: 'unpaid',
    clientName: '',
    companyName: '',
    onsiteContactName: '',
    email: '',
    phone: '',
    leadSource: 'website',
    eventTitle: '',
    eventType: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    setupTime: '',
    decorationAccessTime: '',
    teardownTime: '',
    venueId: '',
    venueName: '',
    guestMinimum: 0,
    guestExpected: 0,
    guestConfirmed: 0,
    adultCount: 0,
    kidsCount: 0,
    foodType: 'italian',
    serviceStyle: 'buffet',
    beverageMode: 'not_included',
    beverageIncludedNotes: '',
    foodPackageName: '',
    foodPackageDescription: '',
    indianPackageNotes: '',
    italianPackageNotes: '',
    centrepiecesIncluded: false,
    centrepiecesNotes: '',
    dietaryNotes: '',
    allergyNotes: '',
    specialRequests: '',
    internalNotes: '',
    clientFacingNotes: '',
    contractSigned: false,
    depositReceived: false,
    finalPaymentReceived: false,
    pricing,
    payments: [],
  };
}

export function calculateBookingFromForm(
  booking: Partial<BookingCore>,
  pricingInput: Partial<BookingPricingInput>,
): Booking {
  const base = createEmptyBooking();
  const pricing = calculateBookingPricing(pricingInput);

  return {
    ...base,
    ...booking,
    pricing,
    payments: base.payments,
  };
}

export function getBookingHeadline(booking: Partial<BookingCore>): string {
  const title = booking.eventTitle?.trim();
  const type = booking.eventType?.trim();
  const client = booking.clientName?.trim();

  if (title) return title;
  if (type && client) return `${type} — ${client}`;
  if (client) return client;
  return 'New Booking';
}

export function getBookingFinancialSummary(pricing: BookingPricingSummary) {
  return {
    subtotal: pricing.subtotal,
    tax: pricing.taxAmount,
    gratuity: pricing.gratuityAmount,
    total: pricing.grandTotal,
    paid: pricing.amountPaid,
    balance: pricing.balanceDue,
  };
}

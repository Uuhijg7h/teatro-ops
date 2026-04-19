import { calculateBookingPricing } from './pricing';
import { createEmptyBooking } from './bookings';
import type { Booking, BookingCore, BookingPricingInput } from './types';

export interface BookingFormState {
  booking: Booking;
  pricingInput: BookingPricingInput;
}

export function createDefaultBookingFormState(): BookingFormState {
  const emptyBooking = createEmptyBooking();

  return {
    booking: emptyBooking,
    pricingInput: {
      adultCount: 0,
      adultRate: 0,
      kidsCount: 0,
      kidsRate: 0,
      cakeCuttingFee: 0,
      hallRentalFee: 0,
      beverageSubtotal: 0,
      addonsAmount: 0,
      discountAmount: 0,
      extraFees: 0,
      depositAmount: 0,
      customPaymentsTotal: 0,
      taxRate: emptyBooking.pricing.taxAmount ? 0.13 : 0.13,
      gratuityRate: emptyBooking.pricing.gratuityAmount ? 0.18 : 0.18,
    },
  };
}

export function patchBookingCore(
  state: BookingFormState,
  patch: Partial<BookingCore>,
): BookingFormState {
  return {
    ...state,
    booking: {
      ...state.booking,
      ...patch,
    },
  };
}

export function patchBookingPricing(
  state: BookingFormState,
  patch: Partial<BookingPricingInput>,
): BookingFormState {
  const nextPricingInput = {
    ...state.pricingInput,
    ...patch,
  };

  return {
    ...state,
    pricingInput: nextPricingInput,
    booking: {
      ...state.booking,
      pricing: calculateBookingPricing(nextPricingInput),
      adultCount: nextPricingInput.adultCount,
      kidsCount: nextPricingInput.kidsCount,
    },
  };
}

export function setFoodType(
  state: BookingFormState,
  foodType: 'indian' | 'italian' | 'custom',
): BookingFormState {
  return patchBookingCore(state, {
    foodType,
    indianPackageNotes: foodType === 'indian' ? state.booking.indianPackageNotes : '',
    italianPackageNotes: foodType === 'italian' ? state.booking.italianPackageNotes : '',
  });
}

export function setCentrepieces(
  state: BookingFormState,
  included: boolean,
  notes = '',
): BookingFormState {
  return patchBookingCore(state, {
    centrepiecesIncluded: included,
    centrepiecesNotes: included ? notes : '',
  });
}

export function setPaymentStatus(
  state: BookingFormState,
  paymentStatus: Booking['paymentStatus'],
): BookingFormState {
  return patchBookingCore(state, {
    paymentStatus,
    depositReceived: ['deposit_paid', 'partially_paid', 'paid'].includes(paymentStatus),
    finalPaymentReceived: paymentStatus === 'paid',
  });
}

import type { BookingPricingInput, BookingPricingSummary } from './types';
import { DEFAULT_GRATUITY_RATE, DEFAULT_TAX_RATE } from './constants';

function roundCurrency(value: number): number {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
}

function normalizeMoney(value: unknown): number {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return roundCurrency(parsed);
}

function normalizeRate(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return parsed > 1 ? parsed / 100 : parsed;
}

export function calculateBookingPricing(input: Partial<BookingPricingInput>): BookingPricingSummary {
  const adultCount = normalizeMoney(input.adultCount);
  const adultRate = normalizeMoney(input.adultRate);
  const kidsCount = normalizeMoney(input.kidsCount);
  const kidsRate = normalizeMoney(input.kidsRate);

  const cakeCuttingFee = normalizeMoney(input.cakeCuttingFee);
  const hallRentalFee = normalizeMoney(input.hallRentalFee);
  const beverageSubtotal = normalizeMoney(input.beverageSubtotal);
  const addonsAmount = normalizeMoney(input.addonsAmount);
  const discountAmount = normalizeMoney(input.discountAmount);
  const extraFees = normalizeMoney(input.extraFees);
  const depositAmount = normalizeMoney(input.depositAmount);
  const customPaymentsTotal = normalizeMoney(input.customPaymentsTotal);

  const taxRate = normalizeRate(input.taxRate, DEFAULT_TAX_RATE);
  const gratuityRate = normalizeRate(input.gratuityRate, DEFAULT_GRATUITY_RATE);

  const adultsSubtotal = roundCurrency(adultCount * adultRate);
  const kidsSubtotal = roundCurrency(kidsCount * kidsRate);
  const foodSubtotal = roundCurrency(adultsSubtotal + kidsSubtotal);

  const subtotalBeforeDiscount = roundCurrency(
    foodSubtotal + hallRentalFee + beverageSubtotal + addonsAmount + cakeCuttingFee + extraFees,
  );

  const subtotal = roundCurrency(Math.max(0, subtotalBeforeDiscount - discountAmount));
  const taxAmount = roundCurrency(subtotal * taxRate);
  const gratuityAmount = roundCurrency(subtotal * gratuityRate);
  const grandTotal = roundCurrency(subtotal + taxAmount + gratuityAmount);
  const amountPaid = roundCurrency(depositAmount + customPaymentsTotal);
  const balanceDue = roundCurrency(Math.max(0, grandTotal - amountPaid));

  return {
    adultsSubtotal,
    kidsSubtotal,
    foodSubtotal,
    hallRentalFee,
    beverageSubtotal,
    addonsAmount: roundCurrency(addonsAmount + cakeCuttingFee),
    extraFees,
    discountAmount,
    subtotal,
    taxAmount,
    gratuityAmount,
    grandTotal,
    depositAmount,
    customPaymentsTotal,
    amountPaid,
    balanceDue,
  };
}

export function formatCad(value: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

import type {
  BeverageMode,
  BookingPipelineStage,
  FoodType,
  PaymentStatus,
  ServiceStyle,
  UserRole,
} from './constants';

export type UUID = string;

export interface OrganizationProfile {
  id: UUID;
  businessName: string;
  legalName?: string;
  address: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  currencyCode: string;
  taxRate: number;
  gratuityRate: number;
  timezone: string;
}

export interface Venue {
  id: UUID;
  slug: string;
  name: string;
  description?: string;
  seatedCapacity: number;
  standingCapacity: number;
  standingOnly?: boolean;
  roomTurnBufferMinutesBefore?: number;
  roomTurnBufferMinutesAfter?: number;
  priceFrom?: number;
  active: boolean;
}

export interface TeamMember {
  id: UUID;
  displayName: string;
  email?: string;
  phone?: string;
  role: UserRole;
  active: boolean;
}

export interface BookingPricingInput {
  adultCount: number;
  adultRate: number;
  kidsCount: number;
  kidsRate: number;
  cakeCuttingFee: number;
  hallRentalFee: number;
  beverageSubtotal: number;
  addonsAmount: number;
  discountAmount: number;
  extraFees: number;
  depositAmount: number;
  customPaymentsTotal: number;
  taxRate: number;
  gratuityRate: number;
}

export interface BookingPricingSummary {
  adultsSubtotal: number;
  kidsSubtotal: number;
  foodSubtotal: number;
  hallRentalFee: number;
  beverageSubtotal: number;
  addonsAmount: number;
  extraFees: number;
  discountAmount: number;
  subtotal: number;
  taxAmount: number;
  gratuityAmount: number;
  grandTotal: number;
  depositAmount: number;
  customPaymentsTotal: number;
  amountPaid: number;
  balanceDue: number;
}

export interface BookingPaymentEntry {
  id: UUID;
  label: string;
  amount: number;
  paidAt?: string;
  method?: string;
  notes?: string;
}

export interface BookingCore {
  id: UUID;
  resno?: string;
  status: BookingPipelineStage;
  paymentStatus: PaymentStatus;
  clientName: string;
  companyName?: string;
  onsiteContactName?: string;
  email?: string;
  phone?: string;
  leadSource?: string;
  eventTitle?: string;
  eventType?: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  setupTime?: string;
  decorationAccessTime?: string;
  teardownTime?: string;
  venueId?: UUID;
  venueName?: string;
  guestMinimum?: number;
  guestExpected?: number;
  guestConfirmed?: number;
  adultCount?: number;
  kidsCount?: number;
  foodType?: FoodType;
  serviceStyle?: ServiceStyle;
  beverageMode?: BeverageMode;
  beverageIncludedNotes?: string;
  foodPackageName?: string;
  foodPackageDescription?: string;
  indianPackageNotes?: string;
  italianPackageNotes?: string;
  centrepiecesIncluded?: boolean;
  centrepiecesNotes?: string;
  dietaryNotes?: string;
  allergyNotes?: string;
  specialRequests?: string;
  internalNotes?: string;
  clientFacingNotes?: string;
  assignedManagerId?: UUID;
  assignedOnsiteManagerId?: UUID;
  contractSigned?: boolean;
  depositReceived?: boolean;
  finalPaymentReceived?: boolean;
  holdExpiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking extends BookingCore {
  pricing: BookingPricingSummary;
  payments: BookingPaymentEntry[];
}

export interface VenueConflictCheckInput {
  bookingId?: UUID;
  venueId: UUID;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  setupTime?: string;
  teardownTime?: string;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
}

export interface BanquetTemplate {
  id: UUID;
  key: 'beo' | 'quote' | 'invoice' | 'run_sheet' | 'booking_summary';
  name: string;
  description?: string;
  content: string;
  active: boolean;
  updatedAt?: string;
}

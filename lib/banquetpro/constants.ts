export const APP_NAME = 'BanquetPro';
export const BUSINESS_NAME = 'Teatro Banquet Hall';
export const BUSINESS_ADDRESS = '495 Welland Avenue, St. Catharines, Ontario, Canada';
export const BUSINESS_PHONE = '905-641-7002';
export const BUSINESS_EMAIL = 'info@theteatro.ca';
export const CURRENCY_CODE = 'CAD';
export const DEFAULT_TAX_RATE = 0.13;
export const DEFAULT_GRATUITY_RATE = 0.18;

export const BOOKING_PIPELINE = [
  'new_inquiry',
  'follow_up_needed',
  'tour_scheduled',
  'quote_sent',
  'deposit_pending',
  'confirmed',
  'final_guest_count_pending',
  'finalized',
  'completed',
  'cancelled',
] as const;

export type BookingPipelineStage = (typeof BOOKING_PIPELINE)[number];

export const PAYMENT_STATUSES = [
  'unpaid',
  'deposit_paid',
  'partially_paid',
  'paid',
  'overdue',
  'cancelled',
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const FOOD_TYPES = ['indian', 'italian', 'custom'] as const;
export type FoodType = (typeof FOOD_TYPES)[number];

export const SERVICE_STYLES = [
  'plated',
  'buffet',
  'family_style',
  'cocktail',
  'standing_reception',
  'cash_bar_only',
  'no_food',
  'custom',
] as const;

export type ServiceStyle = (typeof SERVICE_STYLES)[number];

export const BEVERAGE_MODES = [
  'included',
  'not_included',
  'extras',
  'hosted_bar',
  'cash_bar',
  'non_alcoholic_only',
  'custom',
] as const;

export type BeverageMode = (typeof BEVERAGE_MODES)[number];

export const TEATRO_VENUES = [
  {
    slug: 'teatro-restaurant',
    name: 'Teatro Restaurant',
    description:
      'Our main restaurant space that is ideal for elegant main receptions and grand receptions.',
    seatedCapacity: 120,
    standingCapacity: 160,
  },
  {
    slug: 'sipario-room',
    name: 'Sipario Room',
    description:
      'An intimate setting perfect for micro-weddings, rehearsal dinners, and private dining.',
    seatedCapacity: 40,
    standingCapacity: 60,
  },
  {
    slug: 'camerino-room',
    name: 'Camerino Room',
    description:
      'A compact flexible room that can function as a bridal suite, storage room, or private dining space.',
    seatedCapacity: 15,
    standingCapacity: 15,
  },
  {
    slug: 'la-sala-grande',
    name: 'La Sala Grande',
    description:
      'Our premier event space, offering elegance and flexibility for larger receptions and celebrations.',
    seatedCapacity: 150,
    standingCapacity: 200,
  },
] as const;

export const USER_ROLES = ['admin', 'manager', 'staff', 'visitor'] as const;
export type UserRole = (typeof USER_ROLES)[number];

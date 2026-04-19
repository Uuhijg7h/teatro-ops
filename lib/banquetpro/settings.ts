import {
  APP_NAME,
  BUSINESS_ADDRESS,
  BUSINESS_EMAIL,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  CURRENCY_CODE,
  DEFAULT_GRATUITY_RATE,
  DEFAULT_TAX_RATE,
} from './constants';
import type { OrganizationProfile } from './types';

export interface BrandingSettings {
  appName: string;
  shortName: string;
  businessName: string;
  logoUrl?: string;
  printLogoUrl?: string;
  sidebarLogoUrl?: string;
  icon192Url?: string;
  icon512Url?: string;
  themeColor?: string;
  backgroundColor?: string;
}

export interface BookingDefaultsSettings {
  taxRate: number;
  gratuityRate: number;
  defaultLeadSource: string;
  defaultRoomTurnBufferBeforeMinutes: number;
  defaultRoomTurnBufferAfterMinutes: number;
  defaultFoodType: 'indian' | 'italian' | 'custom';
  defaultServiceStyle:
    | 'plated'
    | 'buffet'
    | 'family_style'
    | 'cocktail'
    | 'standing_reception'
    | 'cash_bar_only'
    | 'no_food'
    | 'custom';
}

export interface BusinessSettingsBundle {
  profile: OrganizationProfile;
  branding: BrandingSettings;
  bookingDefaults: BookingDefaultsSettings;
}

export function getDefaultOrganizationProfile(): OrganizationProfile {
  return {
    id: 'org-teatro',
    businessName: BUSINESS_NAME,
    address: BUSINESS_ADDRESS,
    city: 'St. Catharines',
    province: 'Ontario',
    country: 'Canada',
    phone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    currencyCode: CURRENCY_CODE,
    taxRate: DEFAULT_TAX_RATE,
    gratuityRate: DEFAULT_GRATUITY_RATE,
    timezone: 'America/Toronto',
  };
}

export function getDefaultBusinessSettings(): BusinessSettingsBundle {
  return {
    profile: getDefaultOrganizationProfile(),
    branding: {
      appName: APP_NAME,
      shortName: APP_NAME,
      businessName: BUSINESS_NAME,
      themeColor: '#111827',
      backgroundColor: '#f8fafc',
    },
    bookingDefaults: {
      taxRate: DEFAULT_TAX_RATE,
      gratuityRate: DEFAULT_GRATUITY_RATE,
      defaultLeadSource: 'website',
      defaultRoomTurnBufferBeforeMinutes: 120,
      defaultRoomTurnBufferAfterMinutes: 120,
      defaultFoodType: 'italian',
      defaultServiceStyle: 'buffet',
    },
  };
}

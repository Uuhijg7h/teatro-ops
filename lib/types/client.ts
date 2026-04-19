export type ContactPreference = 'email' | 'phone' | 'text' | 'any';

export interface Client {
  id: string;
  
  // Basic Information
  name: string;
  email: string;
  phone: string;
  
  // Address
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  
  // Contact Preferences
  contact_preference: ContactPreference;
  preferred_contact_time?: string;
  
  // Additional Info
  company_name?: string;
  notes?: string;
  
  // Status
  is_active: boolean;
  
  // Statistics (derived)
  total_bookings?: number;
  total_spent?: number;
  last_booking_date?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

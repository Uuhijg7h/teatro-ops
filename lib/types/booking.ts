export type PaymentStatus = 'fully_paid' | 'deposit_paid' | 'outstanding';
export type BookingStatus = 'tentative' | 'confirmed' | 'cancelled';

export interface Booking {
  // Core IDs
  id: string;
  res_no: string; // RES-2024-001
  
  // Client Information
  client_name: string;
  onsite_contact?: string;
  email: string;
  phone: string;
  
  // Event Basic Info
  booking_date: string;
  event_date: string;
  event_day?: string;
  event_type: string;
  hall: string;
  guests: number;
  
  // Timing
  start_time: string;
  end_time: string;
  setup_time?: string;
  
  // Food & Beverage
  food_style?: string;
  apps?: string;
  mains?: string;
  desserts?: string;
  dietary_notes?: string;
  beverages?: string;
  
  // Setup & AV
  setup_details?: string;
  additional_items?: string;
  av_requirements?: string;
  
  // Timeline & Billing
  timeline?: string;
  billing_breakdown?: string;
  
  // Financial
  total_amount: number;
  deposit_paid: number;
  balance_due: number;
  payment_status: PaymentStatus;
  
  // Management
  manager_name: string;
  onsite_mgr_name?: string;
  notes?: string;
  
  // Status & Metadata
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

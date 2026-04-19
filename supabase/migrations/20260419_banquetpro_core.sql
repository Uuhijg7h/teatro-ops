create extension if not exists pgcrypto;

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  legal_name text,
  address text not null,
  city text,
  province text,
  postal_code text,
  country text default 'Canada',
  phone text,
  email text,
  website text,
  currency_code text not null default 'CAD',
  tax_rate numeric not null default 0.13,
  gratuity_rate numeric not null default 0.18,
  timezone text not null default 'America/Toronto',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  slug text not null unique,
  name text not null,
  description text,
  seated_capacity integer not null default 0,
  standing_capacity integer not null default 0,
  price_from numeric not null default 0,
  room_turn_buffer_before_minutes integer not null default 120,
  room_turn_buffer_after_minutes integer not null default 120,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  slug text not null,
  name text not null,
  system_role boolean not null default false,
  created_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  created_at timestamptz not null default now()
);

create table if not exists role_permissions (
  role_id uuid not null references roles(id) on delete cascade,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  role_id uuid references roles(id) on delete set null,
  auth_user_id uuid,
  username text unique,
  display_name text not null,
  email text unique,
  phone text,
  active boolean not null default true,
  force_password_reset boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists booking_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  template_key text not null,
  name text not null,
  description text,
  content text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists menu_packages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  cuisine_type text not null,
  package_name text not null,
  package_type text,
  min_guests integer not null default 0,
  description text,
  included_items jsonb not null default '[]'::jsonb,
  price_per_person numeric not null default 0,
  flat_fee numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  resno text unique,
  status text not null,
  payment_status text not null,
  lead_source text,
  client_name text not null,
  company_name text,
  onsite_contact_name text,
  email text,
  phone text,
  event_title text,
  event_type text,
  event_date date not null,
  start_time text,
  end_time text,
  setup_time text,
  decoration_access_time text,
  teardown_time text,
  venue_id uuid references venues(id) on delete set null,
  guest_minimum integer not null default 0,
  guest_expected integer not null default 0,
  guest_confirmed integer not null default 0,
  adult_count integer not null default 0,
  adult_rate numeric not null default 0,
  kids_count integer not null default 0,
  kids_rate numeric not null default 0,
  cake_cutting_fee numeric not null default 0,
  hall_rental_fee numeric not null default 0,
  beverage_subtotal numeric not null default 0,
  addons_amount numeric not null default 0,
  discount_amount numeric not null default 0,
  extra_fees numeric not null default 0,
  subtotal numeric not null default 0,
  tax_rate numeric not null default 0.13,
  tax_amount numeric not null default 0,
  gratuity_rate numeric not null default 0.18,
  gratuity_amount numeric not null default 0,
  grand_total numeric not null default 0,
  deposit_amount numeric not null default 0,
  amount_paid numeric not null default 0,
  balance_due numeric not null default 0,
  food_type text,
  service_style text,
  beverage_mode text,
  food_package_name text,
  food_package_description text,
  indian_package_notes text,
  italian_package_notes text,
  centrepieces_included boolean not null default false,
  centrepieces_notes text,
  dietary_notes text,
  allergy_notes text,
  special_requests text,
  internal_notes text,
  client_facing_notes text,
  contract_signed boolean not null default false,
  deposit_received boolean not null default false,
  final_payment_received boolean not null default false,
  assigned_manager_id uuid references users(id) on delete set null,
  assigned_onsite_manager_id uuid references users(id) on delete set null,
  hold_expires_at timestamptz,
  outlook_event_id text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists booking_payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  label text not null,
  amount numeric not null default 0,
  paid_at timestamptz,
  method text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists soft_holds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  venue_id uuid not null references venues(id) on delete cascade,
  lead_name text,
  event_date date not null,
  start_time text,
  end_time text,
  expires_at timestamptz not null,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  category text,
  quantity_owned integer not null default 0,
  quantity_reserved integer not null default 0,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  user_id uuid references users(id) on delete set null,
  action text not null,
  details text,
  created_at timestamptz not null default now()
);

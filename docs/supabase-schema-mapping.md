# BanquetPro Supabase schema mapping

This file maps the BanquetPro domain layer into the online Supabase/Postgres model.

## organizations
Stores the business profile and defaults.
- id uuid primary key
- business_name text not null
- legal_name text
- address text not null
- city text
- province text
- postal_code text
- country text default 'Canada'
- phone text
- email text
- website text
- currency_code text default 'CAD'
- tax_rate numeric default 0.13
- gratuity_rate numeric default 0.18
- timezone text default 'America/Toronto'
- created_at timestamptz default now()
- updated_at timestamptz default now()

## branding_assets
Stores uploaded branding/logo/icon records.
- id uuid primary key
- organization_id uuid references organizations(id)
- asset_type text not null
- storage_path text not null
- public_url text
- mime_type text
- width integer
- height integer
- active boolean default true
- created_at timestamptz default now()

## venues
Stores editable hall/room definitions.
- id uuid primary key
- organization_id uuid references organizations(id)
- slug text unique not null
- name text not null
- description text
- seated_capacity integer not null default 0
- standing_capacity integer not null default 0
- price_from numeric default 0
- room_turn_buffer_before_minutes integer default 120
- room_turn_buffer_after_minutes integer default 120
- active boolean default true
- created_at timestamptz default now()
- updated_at timestamptz default now()

## roles
- id uuid primary key
- organization_id uuid references organizations(id)
- slug text not null
- name text not null
- system_role boolean default false
- created_at timestamptz default now()

## permissions
- id uuid primary key
- key text unique not null
- label text not null
- created_at timestamptz default now()

## role_permissions
- role_id uuid references roles(id)
- permission_id uuid references permissions(id)
- primary key (role_id, permission_id)

## users
Application-managed team members.
- id uuid primary key
- organization_id uuid references organizations(id)
- role_id uuid references roles(id)
- auth_user_id uuid
- username text unique
- display_name text not null
- email text unique
- phone text
- active boolean default true
- force_password_reset boolean default false
- created_at timestamptz default now()
- updated_at timestamptz default now()

## booking_templates
Admin-editable document templates.
- id uuid primary key
- organization_id uuid references organizations(id)
- template_key text not null
- name text not null
- description text
- content text not null
- active boolean default true
- created_at timestamptz default now()
- updated_at timestamptz default now()

## menu_packages
- id uuid primary key
- organization_id uuid references organizations(id)
- cuisine_type text not null
- package_name text not null
- package_type text
- min_guests integer default 0
- description text
- included_items jsonb default '[]'::jsonb
- price_per_person numeric default 0
- flat_fee numeric default 0
- active boolean default true
- created_at timestamptz default now()
- updated_at timestamptz default now()

## bookings
Core booking + CRM + financial workflow.
- id uuid primary key
- organization_id uuid references organizations(id)
- resno text unique
- status text not null
- payment_status text not null
- lead_source text
- client_name text not null
- company_name text
- onsite_contact_name text
- email text
- phone text
- event_title text
- event_type text
- event_date date not null
- start_time text
- end_time text
- setup_time text
- decoration_access_time text
- teardown_time text
- venue_id uuid references venues(id)
- guest_minimum integer default 0
- guest_expected integer default 0
- guest_confirmed integer default 0
- adult_count integer default 0
- adult_rate numeric default 0
- kids_count integer default 0
- kids_rate numeric default 0
- cake_cutting_fee numeric default 0
- hall_rental_fee numeric default 0
- beverage_subtotal numeric default 0
- addons_amount numeric default 0
- discount_amount numeric default 0
- extra_fees numeric default 0
- subtotal numeric default 0
- tax_rate numeric default 0.13
- tax_amount numeric default 0
- gratuity_rate numeric default 0.18
- gratuity_amount numeric default 0
- grand_total numeric default 0
- deposit_amount numeric default 0
- amount_paid numeric default 0
- balance_due numeric default 0
- food_type text
- service_style text
- beverage_mode text
- food_package_name text
- food_package_description text
- indian_package_notes text
- italian_package_notes text
- centrepieces_included boolean default false
- centrepieces_notes text
- dietary_notes text
- allergy_notes text
- special_requests text
- internal_notes text
- client_facing_notes text
- contract_signed boolean default false
- deposit_received boolean default false
- final_payment_received boolean default false
- assigned_manager_id uuid references users(id)
- assigned_onsite_manager_id uuid references users(id)
- hold_expires_at timestamptz
- outlook_event_id text
- created_by uuid references users(id)
- created_at timestamptz default now()
- updated_at timestamptz default now()

## booking_payments
Custom payment entries and installment tracking.
- id uuid primary key
- booking_id uuid references bookings(id)
- label text not null
- amount numeric not null default 0
- paid_at timestamptz
- method text
- notes text
- created_at timestamptz default now()

## soft_holds
- id uuid primary key
- organization_id uuid references organizations(id)
- venue_id uuid references venues(id)
- lead_name text
- event_date date not null
- start_time text
- end_time text
- expires_at timestamptz not null
- notes text
- active boolean default true
- created_at timestamptz default now()

## inventory_items
- id uuid primary key
- organization_id uuid references organizations(id)
- name text not null
- category text
- quantity_owned integer default 0
- quantity_reserved integer default 0
- notes text
- active boolean default true
- created_at timestamptz default now()

## vendors
- id uuid primary key
- organization_id uuid references organizations(id)
- name text not null
- vendor_type text
- contact_name text
- email text
- phone text
- coi_reference text
- coi_expiry date
- load_in_instructions text
- notes text
- active boolean default true
- created_at timestamptz default now()

## booking_vendors
- booking_id uuid references bookings(id)
- vendor_id uuid references vendors(id)
- primary key (booking_id, vendor_id)

## activity_log
- id uuid primary key
- organization_id uuid references organizations(id)
- booking_id uuid references bookings(id)
- user_id uuid references users(id)
- action text not null
- details text
- created_at timestamptz default now()

## Integration note
Outlook sync state should be linked from bookings using outlook_event_id and future sync metadata fields. Firebase is not the primary target in this schema; Supabase/Postgres is the canonical online data model.

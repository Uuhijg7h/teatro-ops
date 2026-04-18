# Teatro Banquet Hall - Implementation Plan (BanquetPro Upgrade)

This document outlines the exact technical specification for rebuilding the Teatro Banquet Hall Event Management System to precisely match the BanquetPro design and functionality.

## 1. Core Architecture
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (matching exact hex codes from BanquetPro)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (with roles)
- **Deployment:** Vercel

## 2. Design System (Exact Match)
- **Backgrounds:** `#f0f1f5` (main content), `#f7f8fa` (secondary areas)
- **Text:** `#1a1a1a` (primary), `#6b7280` (secondary)
- **Accents:** `#2563eb` (blue), `#065f46` (success), `#92400e` (warning), `#991b1b` (danger)
- **Sidebar:** 220px width, white background, fixed left
- **Cards:** White, 1px solid border `#e5e7eb`, 12px radius, subtle shadow
- **Typography:** Apple System / Segoe UI / Roboto, 14px base size

## 3. Database Schema (Supabase)
### `bookings` table
- `id` (uuid, pk)
- `res_no` (text, e.g., T0001)
- `client_name` (text)
- `onsite_contact` (text)
- `email` (text)
- `phone` (text)
- `event_date` (date)
- `booking_date` (date)
- `event_type` (text)
- `hall` (text)
- `guests` (integer)
- `start_time` (text)
- `end_time` (text)
- `setup_time` (text)
- `food_style` (text)
- `manager_id` (uuid, fk to users)
- `onsite_mgr_id` (uuid, fk to users)
- `apps` (text)
- `mains` (text)
- `desserts` (text)
- `dietary` (text)
- `bev` (text)
- `setup_details` (text)
- `add_items` (text)
- `av_reqs` (text)
- `timeline` (text)
- `billing` (text)
- `total_cad` (numeric)
- `deposit_cad` (numeric)
- `payment_status` (text: paid, deposit, outstanding)
- `internal_notes` (text)

### `users` table (profiles)
- `id` (uuid, pk)
- `username` (text)
- `full_name` (text)
- `role` (text: owner, admin, manager, staff, viewer)

## 4. Required Pages
1. **Login Page:** Exact replica of BanquetPro auth screen
2. **Dashboard:** 4 status cards, payment overview, hall usage, recent bookings table
3. **Bookings Page:** Full list, search bar, status filter chips, view/edit/delete actions
4. **Calendar Page:** Monthly grid, today highlight, sidebar with upcoming events
5. **Guests & Clients:** Client directory with avatars and contact info
6. **Menu & Catering:** List of packages and per-booking catering assignments
7. **Staff Assignments:** Staff profiles and their assigned events
8. **Finance & Payments:** Revenue breakdown, collection status, and balances
9. **BEO Documents:** List view with "Open BEO" button for each event
10. **Contracts:** Template-based contract generation
11. **Invoices:** Billing and payment tracking
12. **Settings:** Business profile, halls, tax/gratuity, templates

## 5. Key Functionalities
- **Booking Modal:** 4-tab form matching BanquetPro exactly
- **BEO Generation:** HTML/CSS printable layout matching the document template
- **Currency:** CAD (Canadian Dollars) formatting
- **Tax/Gratuity:** 13% GST, 18% Service Charge
- **Status Badges:** Dynamic color coding based on payment status
- **Real-time Updates:** Auto-refresh UI when data changes in Supabase
- **Outlook Sync:** Publish events to Outlook calendar

## 6. Implementation Phases
- **Phase 1:** Database migration and Auth setup (Done)
- **Phase 2:** Global layout, Sidebar, and Sidebar navigation (Done)
- **Phase 3:** Dashboard and Bookings (Core CRUD) (In Progress)
- **Phase 4:** Calendar and Guests pages (In Progress)
- **Phase 5:** Menu, Staff, Finance, and BEO document pages
- **Phase 6:** Contracts, Invoices, and Settings
- **Phase 7:** Outlook Integration and Final QA

## 7. Business Info
- **Name:** Teatro Banquet Hall
- **Address:** 495 Welland Avenue, St. Catharines, Ontario, Canada
- **Halls:**
  1. Teatro Restaurant (120 seated / 160 standing)
  2. Sipario Room (40 seated / 60 standing)
  3. Camera Privata (15 seated / 15 standing)
  4. La Sala Grande (150 seated / 200 standing)

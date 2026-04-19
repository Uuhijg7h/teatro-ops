# BanquetPro source of truth

This repository is being rebuilt as **BanquetPro**, using the uploaded legacy ZIP as the functional source of truth for booking workflows, screens, business rules, and document behavior.

## Product identity
- Product name: BanquetPro
- Business name: Teatro Banquet Hall
- Address: 495 Welland Avenue, St. Catharines, Ontario, Canada
- Currency: CAD
- Tax default: 13%
- Gratuity default: 18%

## Primary goal
Turn the previous local/full-stack banquet management prototype into a real online banquet hall management system.

## Booking pipeline
1. New Inquiry
2. Follow-Up Needed
3. Tour Scheduled
4. Quote Sent
5. Deposit Pending
6. Confirmed
7. Final Guest Count Pending
8. Finalized
9. Completed
10. Cancelled

## Core booking requirements
Each booking must support at minimum:
- client full name
- contact number
- email
- company / organization
- event type
- internal event title
- event date
- start time
- end time
- setup time
- decoration access time
- teardown / cleanup end time
- guest count minimum
- guest count expected
- guest count final confirmed
- hall assignment
- service style
- food type (Indian / Italian / custom)
- food package details
- beverage service details
- hosted bar / cash bar / none
- centrepieces yes/no + notes
- hall rental fee
- adult pricing breakdown
- kids pricing breakdown
- cake cutting fee
- extra fees
- discounts
- subtotal
- tax
- gratuity
- grand total
- deposit amount
- payment status
- custom payment amount entries
- contract signed status
- internal notes
- client-facing notes
- staff assignments
- activity history
- BEO generation
- quote generation
- invoice-style summary
- run sheet

## Venues
Default Teatro venues to seed, but editable from the web app:
- Teatro Restaurant — seated 120, standing 160
- Sipario Room — seated 40, standing 60
- Camerino Room — seated 15, standing 15
- La Sala Grande — seated 150, standing 200

## Administrative requirements
The owner/admin should not need code changes for routine business administration. The app must support from the web UI:
- add/edit/delete staff login accounts
- assign roles and permissions
- reset passwords
- change business info
- upload logos and icons
- edit venue details
- edit menu/packages
- edit tax / gratuity defaults
- edit BEO / quote / invoice templates
- manage visitor/team access

## Architecture direction
- GitHub for source control
- Vercel for deployment
- Supabase for online database/auth/storage
- legacy ZIP behavior and data model are the functional reference

## Rebuild rule
When legacy ZIP behavior conflicts with the current repo implementation, follow the ZIP for business behavior and field coverage, then modernize it into the online architecture rather than copying the legacy local storage / local DB approach directly.

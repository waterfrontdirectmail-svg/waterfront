# Waterfront Direct Mail - Database Schema

This document describes the complete PostgreSQL database schema for the Waterfront Direct Mail platform running on Supabase.

## Entity Relationship Diagram (Text-Based)

```
┌─────────────┐    ┌─────────────────┐    ┌──────────────────┐
│    auth.    │────│      users      │────│   campaigns      │
│   users     │    │  (profile ext)  │    │  (core entity)   │
│ (Supabase)  │    └─────────────────┘    └──────────────────┘
└─────────────┘              │                       │
                              │                       ├─────┐
                              │                       │     │
                    ┌─────────────────┐               │     │
                    │   exclusivity   │               │     │
                    │ (territorial)   │               │     │
                    └─────────────────┘               │     │
                                                      │     │
    ┌─────────────────────────────────────────────────┘     │
    │                                                       │
    ├─ ┌──────────────────┐    ┌─────────────────────┐     │
    │  │     orders       │    │campaign_tracking_   │     │
    │  │   (payments)     │    │      config         │     │
    │  └──────────────────┘    └─────────────────────┘     │
    │                                     │                │
    │  ┌──────────────────┐              │                │
    │  │   addresses      │              ├─ ┌─────────────┐│
    │  │ (mailing PII)    │              │  │ qr_scans    ││
    │  └──────────────────┘              │  │ (tracking)  ││
    │                                     │  └─────────────┘│
    │  ┌──────────────────┐              │                │
    │  │ coverage_counts  │              └─ ┌─────────────┐│
    │  │ (public agg)     │                 │call_events  ││
    │  └──────────────────┘                 │(CallRail)   ││
    │                                        └─────────────┘│
    └─ ┌──────────────────┐                                │
       │ design_tickets   │                                │
       │ (creative flow)  │                                │
       └──────────────────┘                                │
                                                           │
                           ┌─────────────────────────────────┘
                           │
                    ┌──────────────┐
                    │  templates   │
                    │ (designs)    │
                    └──────────────┘
```

## Core Tables

### users
Extends Supabase `auth.users` with business profile data.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key, references auth.users(id) |
| `email` | TEXT | Email address (from auth.users) |
| `full_name` | TEXT | Customer's full name |
| `company_name` | TEXT | Business name |
| `phone` | TEXT | Business phone number |
| `role` | ENUM | 'customer' or 'admin' |
| `billing_address_*` | TEXT | Complete billing address |
| `industry_category` | TEXT | Business type (dock_builder, marine_insurance, etc.) |
| `referral_source` | TEXT | How they found the platform |
| `notes` | TEXT | Admin notes about the customer |
| `email_verified_at` | TIMESTAMP | When email was verified |
| `last_login_at` | TIMESTAMP | Last login timestamp |

**Security**: RLS enabled. Users see only their own profile; admins see all.

### campaigns
The core entity tracking full campaign lifecycle.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Campaign owner (references users) |
| `name` | TEXT | Campaign name/title |
| `status` | ENUM | draft → pending_review → approved → in_production → mailed → complete |
| `mail_piece_type` | ENUM | postcard_4x6, postcard_6x9, letter_8_5x11, brochure |
| `design_option` | ENUM | customer_artwork, template_customization, full_custom |

**Audience Targeting:**
| Field | Type | Description |
|-------|------|-------------|
| `target_counties` | TEXT[] | ['palm_beach', 'broward'] |
| `target_cities` | TEXT[] | Selected cities |
| `target_zip_codes` | TEXT[] | Selected zip codes |
| `waterway_type` | ENUM | intracoastal, ocean_access_canal, navigable_waterway, all |
| `home_value_min/max` | INTEGER | Price range filters |
| `boat_owner_only` | BOOLEAN | Restrict to boat owners |

**Design & Creative:**
| Field | Type | Description |
|-------|------|-------------|
| `template_id` | UUID | Selected template (if applicable) |
| `design_front_url` | TEXT | Front artwork URL |
| `design_back_url` | TEXT | Back artwork URL |
| `design_brief` | TEXT | Creative requirements |

**Costs & Fulfillment:**
| Field | Type | Description |
|-------|------|-------------|
| `target_quantity` | INTEGER | Desired mail pieces |
| `actual_quantity` | INTEGER | Actual pieces mailed |
| `estimated_cost_cents` | INTEGER | Quote amount (cents USD) |
| `actual_cost_cents` | INTEGER | Final cost (cents USD) |
| `fulfillment_provider` | TEXT | Lob, PostGrid, or manual |
| `fulfillment_job_id` | TEXT | External provider job ID |

**Security**: Users see own campaigns; admins see all. Users can only edit drafts.

### campaign_tracking_config
Tracking configuration per campaign (CallRail, QR codes, UTM parameters).

| Field | Type | Description |
|-------|------|-------------|
| `campaign_id` | UUID | References campaigns(id) |
| `callrail_number` | TEXT | Unique tracking phone number |
| `callrail_tracker_id` | TEXT | CallRail API tracker ID |
| `qr_short_code` | TEXT | Unique code for wfdm.co/go/{code} |
| `qr_destination_url` | TEXT | Where QR code redirects |
| `qr_image_url` | TEXT | Generated QR code image for print |
| `utm_source` | TEXT | 'directmail' |
| `utm_medium` | TEXT | 'postcard' |
| `utm_campaign` | TEXT | Auto-generated campaign code |
| `tracking_url` | TEXT | Full UTM-tagged URL |

**Security**: Inherits from campaigns. Used for response tracking analytics.

### addresses
Homeowner PII for mailing lists. **NEVER exposed via public API.**

| Field | Type | Description |
|-------|------|-------------|
| `campaign_id` | UUID | References campaigns(id) |
| `first_name` | TEXT | Homeowner first name |
| `last_name` | TEXT | Homeowner last name |
| `address_line1` | TEXT | Street address |
| `city` | TEXT | City name |
| `state` | TEXT | State (FL) |
| `zip_code` | TEXT | 5-digit ZIP |
| `zip4` | TEXT | ZIP+4 extension |
| `county` | TEXT | palm_beach or broward |
| `waterway_access` | ENUM | Type of waterway access |
| `home_value_estimate` | INTEGER | Estimated property value |
| `boat_owner` | BOOLEAN | Boat registration overlay |
| `cass_verified` | BOOLEAN | USPS address verified |
| `deliverable` | BOOLEAN | Mailable address |

**Security**: Admin-only access. Never accessible to customers or public API.

### coverage_counts
Aggregated homeowner counts by geography. **Public API, no PII.**

| Field | Type | Description |
|-------|------|-------------|
| `county` | TEXT | palm_beach or broward |
| `city` | TEXT | City name |
| `zip_code` | TEXT | ZIP code |
| `homeowner_count` | INTEGER | Total homeowners in this area |
| `intracoastal_count` | INTEGER | Intracoastal access only |
| `ocean_canal_count` | INTEGER | Ocean-access canals |
| `navigable_count` | INTEGER | Other navigable waterways |
| `home_value_*` | INTEGER | Counts by value segments |
| `boat_owner_count` | INTEGER | Overlay of boat owners |

**Security**: Public read access (no auth required). Admin-only write.
**Usage**: Powers the audience explorer and public count API.

## Tracking & Analytics Tables

### qr_scans
Individual QR code scan events with device and location data.

| Field | Type | Description |
|-------|------|-------------|
| `campaign_id` | UUID | References campaigns(id) |
| `tracking_config_id` | UUID | References campaign_tracking_config |
| `scanned_at` | TIMESTAMP | When scan occurred |
| `ip_address` | INET | Scanner IP (for geo lookup) |
| `device_type` | TEXT | mobile, tablet, desktop |
| `os` | TEXT | iOS, Android, Windows |
| `browser` | TEXT | Chrome, Safari, Firefox |
| `city/state` | TEXT | IP-based location |
| `is_unique` | BOOLEAN | Unique scan flag |

**Security**: Campaign owner and admins can view. Powers scan analytics.

### call_events
CallRail webhook data for call tracking analytics.

| Field | Type | Description |
|-------|------|-------------|
| `campaign_id` | UUID | References campaigns(id) |
| `callrail_call_id` | TEXT | CallRail unique call ID |
| `caller_number` | TEXT | Caller phone number |
| `duration` | INTEGER | Call length in seconds |
| `call_answered` | BOOLEAN | Was call answered |
| `recording_url` | TEXT | Call recording (if enabled) |
| `first_time_caller` | BOOLEAN | New vs repeat caller |

**Security**: Campaign owner and admins can view. Powers call analytics.

## Payment & Order Management

### orders
Payment records integrated with Stripe.

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | UUID | Customer who placed order |
| `campaign_id` | UUID | Campaign being paid for |
| `amount_cents` | INTEGER | Total amount in cents USD |
| `status` | ENUM | pending, paid, failed, refunded |
| `piece_count` | INTEGER | Number of mail pieces |
| `piece_rate_cents` | INTEGER | Per-piece rate in cents |
| `design_fee_cents` | INTEGER | Design service fee |
| `stripe_payment_intent_id` | TEXT | Stripe payment intent |
| `paid_at` | TIMESTAMP | When payment succeeded |
| `receipt_url` | TEXT | Stripe receipt URL |

**Security**: Users see own orders; admins see all.

## Creative Workflow

### design_tickets
Creative workflow tracking for custom designs.

| Field | Type | Description |
|-------|------|-------------|
| `campaign_id` | UUID | Campaign needing design |
| `user_id` | UUID | Customer requesting design |
| `title` | TEXT | Ticket title/summary |
| `status` | ENUM | pending → in_progress → review → approved |
| `business_type` | TEXT | Type of business for targeting |
| `key_message` | TEXT | Primary marketing message |
| `offer_details` | TEXT | Special offers/promotions |
| `brand_assets_urls` | TEXT[] | Logo, photos, brand guidelines |
| `assigned_designer_id` | UUID | Designer working on ticket |
| `first_proof_url` | TEXT | Initial design proof |
| `final_proof_url` | TEXT | Approved final design |
| `revision_count` | INTEGER | Number of revision rounds |

**Security**: Customer can view own tickets; admins and assigned designers see relevant tickets.

### templates
Pre-built mail piece designs.

| Field | Type | Description |
|-------|------|-------------|
| `name` | TEXT | Template name |
| `category` | ENUM | postcard_4x6, postcard_6x9, letter, brochure |
| `thumbnail_url` | TEXT | Preview image |
| `design_front_url` | TEXT | Front design file |
| `design_back_url` | TEXT | Back design file |
| `industry_tags` | TEXT[] | Applicable industries |
| `is_active` | BOOLEAN | Available for selection |

**Security**: Public read access for active templates.

## Business Logic

### exclusivity
Territorial rights management for business exclusivity.

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | UUID | Customer with exclusive rights |
| `industry_category` | TEXT | dock_builder, marine_insurance, etc. |
| `territory_type` | TEXT | zip_codes, city, county |
| `territory_*` | TEXT[] | Specific areas locked |
| `agreement_type` | ENUM | annual_commitment, one_time_premium |
| `status` | ENUM | active, expired, cancelled |
| `start_date/end_date` | DATE | Agreement period |
| `quarterly_minimum_spend_cents` | INTEGER | Required spend for annual |
| `premium_paid_cents` | INTEGER | One-time fee amount |

**Security**: Users see own exclusivity; admins manage all agreements.

## Key Indexes

Performance-optimized indexes for common queries:

```sql
-- Coverage counts (public API)
CREATE INDEX idx_coverage_county ON coverage_counts(county);
CREATE INDEX idx_coverage_city ON coverage_counts(city);  
CREATE INDEX idx_coverage_zip ON coverage_counts(zip_code);

-- Campaign queries
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);

-- QR tracking
CREATE INDEX idx_qr_scans_campaign_id ON qr_scans(campaign_id);
CREATE INDEX idx_qr_scans_date ON qr_scans(scanned_at DESC);

-- Address lookups (careful with PII)
CREATE INDEX idx_addresses_campaign_id ON addresses(campaign_id);
CREATE INDEX idx_addresses_zip ON addresses(zip_code);
```

## Row-Level Security (RLS)

All tables have RLS enabled with policies enforcing:

- **Customer isolation**: Users can only access their own campaigns, orders, and analytics
- **Admin privileges**: Admin role can access all data
- **Public APIs**: `coverage_counts` is read-only public (no auth required)
- **PII protection**: `addresses` table is admin-only, never exposed to customers
- **Inheritance**: Child tables (tracking, orders) inherit access from parent campaigns

## API Endpoints

### Public (No Auth Required)
```
GET /api/public/coverage
  → All available areas with homeowner counts

GET /api/public/count?zips=33458,33410
  → Total count for selected zip codes

GET /api/public/count?cities=Jupiter,Boca Raton  
  → Total count for selected cities
```

### Authenticated (Customer)
```
GET /api/campaigns/:id/analytics
  → Combined tracking stats (calls + QR scans)

GET /api/campaigns/:id/analytics/calls
  → CallRail call data for campaign

GET /api/campaigns/:id/analytics/scans
  → QR scan events for campaign
```

## Data Pipeline

The `addresses` table contains all homeowner PII and is refreshed periodically by importing CSV files. After each import, the `refresh_coverage_counts()` function regenerates the `coverage_counts` aggregation table that powers the public API.

**Import Flow:**
1. Admin uploads CSV with homeowner data
2. Data is loaded into `addresses` table
3. CASS/NCOA verification marks deliverable addresses
4. `refresh_coverage_counts()` aggregates data by geography
5. Public API immediately shows updated counts

**Privacy**: Individual homeowner data never leaves the `addresses` table. All public and customer-facing APIs use only aggregated counts from `coverage_counts`.

## Sample Data

The seed migration includes:
- 45+ coverage count records across Palm Beach and Broward counties
- ~50,000 total waterfront homeowners across both counties
- Sample templates for different industries
- Example exclusivity agreements
- Realistic segmentation by waterway type and home value

This schema supports the full Waterfront Direct Mail platform requirements from the PRD, with proper security, performance optimization, and data privacy protection.
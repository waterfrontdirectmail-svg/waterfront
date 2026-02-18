-- 001_initial_schema.sql
-- Waterfront Direct Mail - Supabase PostgreSQL Schema
-- Generated from PRD: WaterfrontDirectMail.com (Connxtion Ads LLC)

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('customer', 'admin');

CREATE TYPE campaign_status AS ENUM (
  'draft',
  'pending_review',
  'approved',
  'in_production',
  'mailed',
  'complete',
  'cancelled'
);

CREATE TYPE mail_piece_type AS ENUM (
  'postcard_4x6',
  'postcard_6x9',
  'letter_8.5x11',
  'brochure'
);

CREATE TYPE order_status AS ENUM ('pending', 'paid', 'refunded', 'failed');

CREATE TYPE address_status AS ENUM ('pending', 'verified', 'undeliverable');

CREATE TYPE exclusivity_agreement AS ENUM ('annual_commitment', 'one_time_premium');

CREATE TYPE exclusivity_status AS ENUM ('active', 'expired', 'cancelled');

CREATE TYPE exclusivity_territory AS ENUM ('zip_codes', 'city', 'county');

CREATE TYPE design_ticket_status AS ENUM (
  'pending',
  'assigned',
  'in_progress',
  'proof_uploaded',
  'revision_requested',
  'approved',
  'cancelled'
);

CREATE TYPE template_category AS ENUM ('postcard', 'letter', 'brochure');

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles: extends Supabase auth.users
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  company_name  TEXT,
  phone         TEXT,
  billing_address JSONB,  -- {line1, line2, city, state, zip}
  role          user_role NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Campaigns
CREATE TABLE campaigns (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL,
  status                campaign_status NOT NULL DEFAULT 'draft',
  mail_piece_type       mail_piece_type,
  quantity              INTEGER,
  target_area           JSONB,          -- {county, zip_codes[], waterway_type}
  audience_filters      JSONB,          -- {home_value_min, home_value_max, waterfront_type, boat_owner}
  design_front_url      TEXT,
  design_back_url       TEXT,
  estimated_cost        NUMERIC(10,2),
  actual_cost           NUMERIC(10,2),
  fulfillment_provider_id TEXT,         -- Lob job ID, PostGrid ID, or internal ref
  mail_date             DATE,
  estimated_delivery_date DATE,
  tracking_url          TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Addresses (homeowner PII - NEVER publicly accessible)
CREATE TABLE addresses (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id         UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  first_name          TEXT,
  last_name           TEXT,
  address_1           TEXT NOT NULL,
  address_2           TEXT,
  city                TEXT NOT NULL,
  state               TEXT NOT NULL DEFAULT 'FL',
  zip                 TEXT NOT NULL,
  county              TEXT,
  property_type       TEXT,
  waterway_access     TEXT,           -- intracoastal, ocean_canal, etc.
  home_value_estimate NUMERIC(12,2),
  boat_owner          BOOLEAN,
  status              address_status NOT NULL DEFAULT 'pending',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders (Stripe payment tracking)
CREATE TABLE orders (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id             UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  amount                  NUMERIC(10,2) NOT NULL,
  currency                TEXT NOT NULL DEFAULT 'usd',
  status                  order_status NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  stripe_invoice_id       TEXT,
  stripe_checkout_session_id TEXT,
  paid_at                 TIMESTAMPTZ,
  receipt_url             TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Templates (pre-built designs by industry)
CREATE TABLE templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  category        template_category NOT NULL,
  thumbnail_url   TEXT,
  design_file_url TEXT,
  industry_tags   TEXT[] DEFAULT '{}',  -- {dock_builder, marine_insurance, boat_dealer}
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Exclusivity (territorial rights)
CREATE TABLE exclusivity (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  industry_category     TEXT NOT NULL,   -- dock_builder, boat_dealer, marine_insurance, etc.
  territory_type        exclusivity_territory NOT NULL,
  territory_value       JSONB NOT NULL,  -- ["33458","33410"] or "Jupiter" or "Palm Beach"
  agreement_type        exclusivity_agreement NOT NULL,
  start_date            DATE NOT NULL,
  end_date              DATE,            -- NULL for perpetual one_time_premium
  quarterly_campaign_ids UUID[] DEFAULT '{}',
  premium_paid          NUMERIC(10,2),
  status                exclusivity_status NOT NULL DEFAULT 'active',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- QR Scans (scan events)
CREATE TABLE qr_scans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id   UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  scanned_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  device_type   TEXT,    -- mobile, tablet, desktop
  os            TEXT,    -- iOS, Android, other
  city          TEXT,
  state         TEXT,
  is_unique     BOOLEAN NOT NULL DEFAULT true,
  referrer_url  TEXT,
  ip_hash       TEXT     -- hashed IP for dedup, never raw IP
);

-- Campaign Tracking Config
CREATE TABLE campaign_tracking_config (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id         UUID NOT NULL UNIQUE REFERENCES campaigns(id) ON DELETE CASCADE,
  callrail_number     TEXT,
  callrail_tracker_id TEXT,
  qr_short_url        TEXT,
  qr_destination_url  TEXT,
  tracking_url        TEXT,    -- UTM-tagged landing page URL
  custom_vanity_url   TEXT,
  utm_source          TEXT DEFAULT 'directmail',
  utm_medium          TEXT,
  utm_campaign        TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Coverage Counts (aggregated for public API - no PII)
CREATE TABLE coverage_counts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county          TEXT NOT NULL,
  city            TEXT NOT NULL,
  zip_code        TEXT NOT NULL,
  homeowner_count INTEGER NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Design Tickets (creative workflow)
CREATE TABLE design_tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id     UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  status          design_ticket_status NOT NULL DEFAULT 'pending',
  brief           TEXT,
  brand_assets_url TEXT,
  designer_id     UUID REFERENCES profiles(id),
  designer_name   TEXT,
  proof_url       TEXT,
  revision_count  INTEGER NOT NULL DEFAULT 0,
  max_revisions   INTEGER NOT NULL DEFAULT 3,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_coverage_zip ON coverage_counts(zip_code);
CREATE INDEX idx_coverage_city ON coverage_counts(city);
CREATE INDEX idx_campaigns_user_status ON campaigns(user_id, status);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_qr_scans_campaign ON qr_scans(campaign_id);
CREATE INDEX idx_qr_scans_scanned_at ON qr_scans(campaign_id, scanned_at);
CREATE INDEX idx_addresses_campaign ON addresses(campaign_id);
CREATE INDEX idx_exclusivity_user ON exclusivity(user_id);
CREATE INDEX idx_exclusivity_territory ON exclusivity(industry_category, territory_type, status);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_campaigns_updated BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_addresses_updated BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_templates_updated BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_exclusivity_updated BEFORE UPDATE ON exclusivity FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tracking_config_updated BEFORE UPDATE ON campaign_tracking_config FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_design_tickets_updated BEFORE UPDATE ON design_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE exclusivity ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_tracking_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE coverage_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_tickets ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES: users see own, admins see all
CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (id = auth.uid() OR is_admin());

-- CAMPAIGNS: users see own, admins see all
CREATE POLICY campaigns_select ON campaigns FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY campaigns_insert ON campaigns FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY campaigns_update ON campaigns FOR UPDATE USING (user_id = auth.uid() OR is_admin());
CREATE POLICY campaigns_delete ON campaigns FOR DELETE USING (user_id = auth.uid() OR is_admin());

-- ADDRESSES: NEVER public. Admins only via service role. No user-facing policies.
-- Access only through service_role key (server-side API).
CREATE POLICY addresses_admin_only ON addresses FOR ALL USING (is_admin());

-- ORDERS: users see own, admins see all
CREATE POLICY orders_select ON orders FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY orders_insert ON orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY orders_update ON orders FOR UPDATE USING (is_admin());

-- TEMPLATES: public read, admin write
CREATE POLICY templates_select ON templates FOR SELECT USING (true);
CREATE POLICY templates_admin_write ON templates FOR ALL USING (is_admin());

-- EXCLUSIVITY: users see own, admins see all
CREATE POLICY exclusivity_select ON exclusivity FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY exclusivity_admin_write ON exclusivity FOR ALL USING (is_admin());

-- QR_SCANS: users see scans for their campaigns, admins see all
CREATE POLICY qr_scans_select ON qr_scans FOR SELECT USING (
  EXISTS (SELECT 1 FROM campaigns c WHERE c.id = campaign_id AND c.user_id = auth.uid())
  OR is_admin()
);
CREATE POLICY qr_scans_insert ON qr_scans FOR INSERT WITH CHECK (true); -- Edge function inserts via service role

-- CAMPAIGN_TRACKING_CONFIG: users see own campaign config, admins see all
CREATE POLICY tracking_config_select ON campaign_tracking_config FOR SELECT USING (
  EXISTS (SELECT 1 FROM campaigns c WHERE c.id = campaign_id AND c.user_id = auth.uid())
  OR is_admin()
);
CREATE POLICY tracking_config_admin_write ON campaign_tracking_config FOR ALL USING (is_admin());

-- COVERAGE_COUNTS: public read (no auth required)
CREATE POLICY coverage_counts_public_read ON coverage_counts FOR SELECT USING (true);
CREATE POLICY coverage_counts_admin_write ON coverage_counts FOR ALL USING (is_admin());

-- DESIGN_TICKETS: users see own campaign tickets, admins see all
CREATE POLICY design_tickets_select ON design_tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM campaigns c WHERE c.id = campaign_id AND c.user_id = auth.uid())
  OR is_admin()
);
CREATE POLICY design_tickets_admin_write ON design_tickets FOR ALL USING (is_admin());

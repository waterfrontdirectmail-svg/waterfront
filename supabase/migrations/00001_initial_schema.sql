-- Waterfront Direct Mail - Initial Schema
-- See PRD sections 1B (Data Models) and 1A-2 (Coverage Counts)

-- Coverage counts (public, aggregate only - no PII)
CREATE TABLE coverage_counts (
  id SERIAL PRIMARY KEY,
  county TEXT NOT NULL,
  city TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  homeowner_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_coverage_zip ON coverage_counts(zip_code);
CREATE INDEX idx_coverage_city ON coverage_counts(city);
CREATE INDEX idx_coverage_county ON coverage_counts(county);

-- Profiles (extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  company_name TEXT,
  phone TEXT,
  billing_address JSONB,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'in_production', 'mailed', 'complete')),
  mail_piece_type TEXT CHECK (mail_piece_type IN ('postcard_4x6', 'postcard_6x9', 'letter_8.5x11', 'brochure')),
  quantity INTEGER,
  target_area JSONB, -- { county, zip_codes[], waterway_type }
  audience_filters JSONB, -- { home_value_min/max, waterfront_type, boat_owner }
  design_front_url TEXT,
  design_back_url TEXT,
  estimated_cost NUMERIC(10,2),
  actual_cost NUMERIC(10,2),
  fulfillment_job_id TEXT,
  mail_date DATE,
  estimated_delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_campaigns_user ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- Mailing list addresses (per campaign)
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  address_1 TEXT NOT NULL,
  address_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'FL',
  zip TEXT NOT NULL,
  property_type TEXT,
  waterway_access TEXT,
  home_value_estimate NUMERIC(12,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'undeliverable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_addresses_campaign ON addresses(campaign_id);

-- Orders / Payments
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded')),
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_campaign ON orders(campaign_id);

-- Exclusivity territories
CREATE TABLE exclusivity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  industry_category TEXT NOT NULL,
  territory_type TEXT NOT NULL CHECK (territory_type IN ('zip_codes', 'city', 'county')),
  territory_value JSONB NOT NULL,
  agreement_type TEXT NOT NULL CHECK (agreement_type IN ('annual_commitment', 'one_time_premium')),
  start_date DATE NOT NULL,
  end_date DATE,
  premium_paid NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign tracking config
CREATE TABLE campaign_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE UNIQUE,
  callrail_number TEXT,
  callrail_tracker_id TEXT,
  qr_short_url TEXT,
  qr_destination_url TEXT,
  tracking_url TEXT,
  custom_vanity_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QR scan events
CREATE TABLE qr_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_type TEXT,
  os TEXT,
  city TEXT,
  state TEXT,
  is_unique BOOLEAN DEFAULT TRUE,
  referrer_url TEXT
);

CREATE INDEX idx_qr_scans_campaign ON qr_scans(campaign_id);

-- Templates
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('postcard', 'letter', 'brochure')),
  thumbnail_url TEXT,
  design_file_url TEXT,
  industry_tags TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE exclusivity ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies: customers see only their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own campaigns" ON campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own draft campaigns" ON campaigns FOR UPDATE USING (auth.uid() = user_id AND status = 'draft');
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own addresses" ON addresses FOR SELECT USING (campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid()));
CREATE POLICY "Public can view templates" ON templates FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view coverage" ON coverage_counts FOR SELECT USING (TRUE);

-- Coverage counts is publicly readable
ALTER TABLE coverage_counts ENABLE ROW LEVEL SECURITY;

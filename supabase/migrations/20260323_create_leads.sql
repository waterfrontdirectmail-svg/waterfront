CREATE TABLE IF NOT EXISTS leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  phone text,
  service_type text NOT NULL,
  service_area text,
  message text,
  source text DEFAULT 'website_form',
  created_at timestamptz DEFAULT now()
);

-- Allow service role to insert
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can do everything" ON leads FOR ALL USING (true) WITH CHECK (true);

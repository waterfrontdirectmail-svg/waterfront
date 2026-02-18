-- Waterfront Direct Mail - Sample Coverage Data
-- Seed data for coverage_counts table
-- Based on Palm Beach and Broward County waterfront communities
-- Created: 2026-02-17

-- Insert sample coverage data for Palm Beach County
INSERT INTO coverage_counts (county, city, zip_code, total_homeowners, intracoastal_homeowners, ocean_access_homeowners, homes_under_500k, homes_500k_to_1m, homes_1m_to_2m, homes_over_2m, boat_owners, data_source) VALUES

-- Palm Beach County - Northern Communities
('Palm Beach', 'Jupiter', '33458', 2847, 1205, 1642, 245, 892, 1347, 363, 1891, 'sample_data'),
('Palm Beach', 'Jupiter', '33477', 1203, 567, 636, 134, 398, 512, 159, 798, 'sample_data'),
('Palm Beach', 'Palm Beach Gardens', '33410', 1876, 743, 1133, 89, 576, 867, 344, 1247, 'sample_data'),
('Palm Beach', 'North Palm Beach', '33408', 892, 456, 436, 67, 298, 389, 138, 591, 'sample_data'),
('Palm Beach', 'Juno Beach', '33408', 456, 234, 222, 34, 167, 189, 66, 302, 'sample_data'),

-- Palm Beach County - Central Communities  
('Palm Beach', 'West Palm Beach', '33401', 1245, 567, 678, 234, 445, 432, 134, 823, 'sample_data'),
('Palm Beach', 'West Palm Beach', '33407', 987, 423, 564, 178, 356, 343, 110, 654, 'sample_data'),
('Palm Beach', 'Palm Beach', '33480', 3421, 1876, 1545, 23, 234, 1234, 1930, 2267, 'sample_data'),
('Palm Beach', 'Lake Worth', '33460', 1678, 789, 889, 345, 567, 543, 223, 1112, 'sample_data'),
('Palm Beach', 'Lantana', '33462', 1234, 556, 678, 267, 456, 398, 113, 818, 'sample_data'),

-- Palm Beach County - Southern Communities
('Palm Beach', 'Boynton Beach', '33435', 2156, 987, 1169, 432, 678, 734, 312, 1429, 'sample_data'),
('Palm Beach', 'Delray Beach', '33483', 1876, 834, 1042, 234, 567, 743, 332, 1243, 'sample_data'),
('Palm Beach', 'Highland Beach', '33487', 567, 234, 333, 23, 89, 234, 221, 376, 'sample_data'),
('Palm Beach', 'Boca Raton', '33432', 3412, 1567, 1845, 145, 789, 1456, 1022, 2264, 'sample_data'),
('Palm Beach', 'Boca Raton', '33487', 2134, 934, 1200, 89, 567, 892, 586, 1414, 'sample_data'),

-- Broward County - Northern Communities
('Broward', 'Deerfield Beach', '33441', 1567, 723, 844, 234, 567, 534, 232, 1038, 'sample_data'),
('Broward', 'Lighthouse Point', '33064', 834, 387, 447, 67, 234, 367, 166, 552, 'sample_data'),
('Broward', 'Pompano Beach', '33062', 2104, 934, 1170, 345, 678, 756, 325, 1394, 'sample_data'),
('Broward', 'Pompano Beach', '33063', 1456, 645, 811, 267, 456, 523, 210, 965, 'sample_data'),
('Broward', 'Sea Ranch Lakes', '33308', 123, 67, 56, 12, 34, 56, 21, 81, 'sample_data'),

-- Broward County - Central Communities
('Broward', 'Fort Lauderdale', '33301', 1876, 834, 1042, 234, 567, 743, 332, 1243, 'sample_data'),
('Broward', 'Fort Lauderdale', '33304', 2543, 1123, 1420, 345, 678, 967, 553, 1686, 'sample_data'),
('Broward', 'Fort Lauderdale', '33308', 1987, 887, 1100, 178, 567, 834, 408, 1316, 'sample_data'),
('Broward', 'Fort Lauderdale', '33316', 1234, 545, 689, 267, 434, 423, 110, 818, 'sample_data'),
('Broward', 'Wilton Manors', '33305', 456, 203, 253, 89, 178, 156, 33, 302, 'sample_data'),
('Broward', 'Oakland Park', '33334', 789, 356, 433, 134, 267, 298, 90, 523, 'sample_data'),

-- Broward County - Las Olas & Beach Communities  
('Broward', 'Fort Lauderdale', '33312', 2876, 1287, 1589, 234, 678, 1123, 841, 1906, 'sample_data'),
('Broward', 'Lauderdale-by-the-Sea', '33308', 567, 256, 311, 45, 167, 234, 121, 376, 'sample_data'),
('Broward', 'Pompano Beach', '33069', 1123, 498, 625, 178, 345, 423, 177, 744, 'sample_data'),

-- Broward County - Southern Communities
('Broward', 'Dania Beach', '33004', 987, 445, 542, 234, 334, 298, 121, 654, 'sample_data'),
('Broward', 'Hollywood', '33019', 1678, 734, 944, 345, 567, 534, 232, 1112, 'sample_data'),
('Broward', 'Hollywood', '33020', 2134, 934, 1200, 267, 678, 789, 400, 1414, 'sample_data'),
('Broward', 'Hallandale Beach', '33009', 1345, 589, 756, 234, 445, 456, 210, 891, 'sample_data'),

-- High-value waterfront enclaves
('Palm Beach', 'Gulf Stream', '33483', 234, 123, 111, 5, 23, 89, 117, 195, 'sample_data'),
('Palm Beach', 'Ocean Ridge', '33435', 345, 178, 167, 12, 67, 145, 121, 228, 'sample_data'),
('Palm Beach', 'Manalapan', '33462', 178, 89, 89, 3, 23, 67, 85, 148, 'sample_data'),
('Broward', 'Hillsboro Beach', '33062', 456, 234, 222, 23, 89, 189, 155, 302, 'sample_data'),
('Broward', 'Lauderdale-by-the-Sea', '33062', 678, 334, 344, 45, 167, 267, 199, 449, 'sample_data'),

-- Canal communities (primarily ocean-access)
('Palm Beach', 'Tequesta', '33469', 1456, 234, 1222, 89, 345, 678, 344, 965, 'sample_data'),
('Broward', 'Coral Ridge', '33308', 2345, 456, 1889, 167, 567, 934, 677, 1554, 'sample_data'),
('Broward', 'Rio Vista', '33301', 1123, 178, 945, 134, 334, 456, 199, 744, 'sample_data'),
('Broward', 'Colee Hammock', '33301', 567, 89, 478, 67, 178, 234, 88, 376, 'sample_data'),

-- Additional zip codes for comprehensive coverage
('Palm Beach', 'Wellington', '33414', 234, 0, 234, 67, 89, 67, 11, 155, 'sample_data'), -- Inland community with some canal access
('Broward', 'Sunrise', '33322', 345, 0, 345, 89, 134, 122, 0, 228, 'sample_data'), -- Primarily inland with some canal communities
('Broward', 'Plantation', '33324', 456, 0, 456, 123, 178, 155, 0, 302, 'sample_data'), -- Inland with canal access
('Palm Beach', 'Greenacres', '33463', 123, 0, 123, 45, 56, 22, 0, 81, 'sample_data'), -- Limited waterfront access

-- Marina and yacht club adjacent areas (high boat owner concentration)
('Palm Beach', 'Riviera Beach', '33404', 1876, 845, 1031, 456, 567, 623, 230, 1243, 'sample_data'),
('Broward', 'Aventura', '33180', 2134, 934, 1200, 234, 678, 834, 388, 1414, 'sample_data'); -- North Miami-Dade but serves Broward market

-- Update timestamp for all sample records
UPDATE coverage_counts 
SET last_updated = NOW() 
WHERE data_source = 'sample_data';

-- Insert some design templates for seeding
INSERT INTO templates (name, category, description, industry_tags, thumbnail_url, design_file_url) VALUES

-- Dock Builder Templates
('Classic Dock Builder Postcard', 'postcard_4x6', 'Clean professional design for dock installation and repair services', 
 ARRAY['dock_builder', 'marine_contractor'], 
 '/templates/thumbnails/dock-builder-classic.png', 
 '/templates/designs/dock-builder-classic-4x6.pdf'),

('Premium Dock & Seawall', 'postcard_6x9', 'Luxury design showcasing high-end dock and seawall installations', 
 ARRAY['dock_builder', 'seawall', 'luxury'], 
 '/templates/thumbnails/dock-seawall-premium.png', 
 '/templates/designs/dock-seawall-premium-6x9.pdf'),

-- Boat Dealer Templates  
('New Boat Showcase', 'postcard_6x9', 'Feature new boat models with stunning water photography', 
 ARRAY['boat_dealer', 'yacht_broker', 'new_boats'], 
 '/templates/thumbnails/boat-showcase.png', 
 '/templates/designs/boat-showcase-6x9.pdf'),

('Pre-Owned Boat Sales', 'postcard_4x6', 'Promote certified pre-owned boat inventory', 
 ARRAY['boat_dealer', 'used_boats'], 
 '/templates/thumbnails/preowned-boats.png', 
 '/templates/designs/preowned-boats-4x6.pdf'),

-- Marine Insurance Templates
('Boat Insurance Protection', 'letter_8_5x11', 'Comprehensive marine insurance coverage information', 
 ARRAY['marine_insurance', 'boat_insurance'], 
 '/templates/thumbnails/boat-insurance.png', 
 '/templates/designs/boat-insurance-letter.pdf'),

('Waterfront Home Insurance', 'postcard_6x9', 'Specialized coverage for waterfront properties', 
 ARRAY['marine_insurance', 'waterfront_insurance'], 
 '/templates/thumbnails/waterfront-insurance.png', 
 '/templates/designs/waterfront-insurance-6x9.pdf'),

-- Marine Services Templates
('Boat Detailing Services', 'postcard_4x6', 'Professional yacht cleaning and maintenance services', 
 ARRAY['boat_detailing', 'yacht_management'], 
 '/templates/thumbnails/boat-detailing.png', 
 '/templates/designs/boat-detailing-4x6.pdf'),

('Marine Electronics Install', 'brochure', 'Complete marine electronics and navigation systems', 
 ARRAY['marine_electronics', 'navigation'], 
 '/templates/thumbnails/marine-electronics.png', 
 '/templates/designs/marine-electronics-brochure.pdf'),

-- Landscaping & Pool Templates
('Waterfront Landscaping', 'postcard_6x9', 'Specialized landscaping for waterfront properties', 
 ARRAY['landscaping', 'waterfront'], 
 '/templates/thumbnails/waterfront-landscaping.png', 
 '/templates/designs/waterfront-landscaping-6x9.pdf'),

('Pool & Spa Services', 'postcard_4x6', 'Pool maintenance and renovation for waterfront homes', 
 ARRAY['pool_service', 'waterfront'], 
 '/templates/thumbnails/pool-services.png', 
 '/templates/designs/pool-services-4x6.pdf');

-- Create some admin users (update with real emails before production)
-- Note: These would be created through Supabase Auth, then profiles added here
-- This is just a placeholder showing the structure

-- Example: INSERT INTO users (id, email, name, role, company_name) VALUES 
-- (uuid_generate_v4(), 'austin@waterfrontdirectmail.com', 'Austin Lovvorn', 'admin', 'Waterfront Direct Mail'),
-- (uuid_generate_v4(), 'ryan@waterfrontdirectmail.com', 'Ryan', 'admin', 'Waterfront Direct Mail');

-- Add helpful views for common queries

-- Campaign analytics summary view
CREATE VIEW campaign_analytics AS
SELECT 
  c.id,
  c.name,
  c.status,
  c.quantity,
  c.mail_date,
  c.actual_cost,
  
  -- Call tracking stats  
  tc.callrail_number,
  
  -- QR scan stats
  COUNT(DISTINCT qs.id) as total_qr_scans,
  COUNT(DISTINCT qs.id) FILTER (WHERE qs.is_unique_scan = true) as unique_qr_scans,
  
  -- Response rate calculation
  CASE 
    WHEN c.quantity > 0 THEN 
      ROUND((COUNT(DISTINCT qs.id)::decimal / c.quantity * 100), 2)
    ELSE 0 
  END as qr_response_rate_percent
  
FROM campaigns c
LEFT JOIN campaign_tracking_config tc ON c.id = tc.campaign_id  
LEFT JOIN qr_scans qs ON c.id = qs.campaign_id
GROUP BY c.id, c.name, c.status, c.quantity, c.mail_date, c.actual_cost, tc.callrail_number;

-- Coverage summary view for public API
CREATE VIEW public_coverage_summary AS
SELECT 
  county,
  city,
  array_agg(DISTINCT zip_code ORDER BY zip_code) as zip_codes,
  SUM(total_homeowners) as total_homeowners,
  SUM(intracoastal_homeowners) as intracoastal_homeowners, 
  SUM(ocean_access_homeowners) as ocean_access_homeowners,
  SUM(boat_owners) as boat_owners,
  MAX(last_updated) as last_updated
FROM coverage_counts
GROUP BY county, city
ORDER BY county, city;

-- Admin dashboard stats view
CREATE VIEW admin_dashboard_stats AS
SELECT 
  -- Campaign stats
  COUNT(*) FILTER (WHERE status = 'pending_review') as pending_campaigns,
  COUNT(*) FILTER (WHERE status = 'in_production') as production_campaigns,
  COUNT(*) FILTER (WHERE status = 'mailed') as mailed_campaigns,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as campaigns_last_30_days,
  
  -- Revenue stats (from orders)
  (SELECT SUM(amount) FROM orders WHERE status = 'paid' AND paid_at >= CURRENT_DATE - INTERVAL '30 days') as revenue_last_30_days,
  (SELECT COUNT(DISTINCT user_id) FROM orders WHERE status = 'paid') as paying_customers,
  
  -- User stats
  (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers,
  (SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as new_users_last_7_days
  
FROM campaigns;

-- Add some helpful comments
COMMENT ON VIEW campaign_analytics IS 'Combined campaign performance metrics for customer dashboards';
COMMENT ON VIEW public_coverage_summary IS 'Aggregated coverage data by city for public API endpoints';
COMMENT ON VIEW admin_dashboard_stats IS 'Key metrics for admin dashboard overview';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Sample data inserted successfully!';
    RAISE NOTICE 'Total coverage records: %', (SELECT COUNT(*) FROM coverage_counts);
    RAISE NOTICE 'Template records: %', (SELECT COUNT(*) FROM templates);
    RAISE NOTICE 'Schema setup complete. Ready for production data import.';
END $$;
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('coverage_counts')
    .select('county, city, zip_code, homeowner_count')
    .order('homeowner_count', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group by county → cities (aggregate zip counts per city)
  const countyMap: Record<string, Record<string, { count: number; zip_codes: string[] }>> = {};

  for (const row of data) {
    if (!countyMap[row.county]) countyMap[row.county] = {};
    const cityData = countyMap[row.county];
    if (!cityData[row.city]) cityData[row.city] = { count: 0, zip_codes: [] };
    cityData[row.city].count += row.homeowner_count;
    cityData[row.city].zip_codes.push(row.zip_code);
  }

  const counties = Object.entries(countyMap).map(([name, cities]) => ({
    name,
    cities: Object.entries(cities)
      .map(([cityName, d]) => ({ name: cityName, count: d.count, zip_codes: d.zip_codes }))
      .sort((a, b) => b.count - a.count),
  }));

  // Also build zip-level data
  const zips = data.map((r) => ({
    zip_code: r.zip_code,
    city: r.city,
    county: r.county,
    count: r.homeowner_count,
  }));

  return NextResponse.json({ counties, zips });
}

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const cities = searchParams.get('cities');
  const zips = searchParams.get('zips');

  if (!cities && !zips) {
    return NextResponse.json({ error: 'Provide cities or zips parameter' }, { status: 400 });
  }

  if (cities) {
    const cityList = cities.split(',').map((c) => c.trim()).filter(Boolean);
    const { data, error } = await supabaseAdmin
      .from('coverage_counts')
      .select('city, homeowner_count')
      .in('city', cityList);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Aggregate per city
    const breakdown: Record<string, number> = {};
    let total = 0;
    for (const row of data) {
      breakdown[row.city] = (breakdown[row.city] || 0) + row.homeowner_count;
      total += row.homeowner_count;
    }

    return NextResponse.json({ total, breakdown });
  }

  if (zips) {
    const zipList = zips.split(',').map((z) => z.trim()).filter(Boolean);
    const { data, error } = await supabaseAdmin
      .from('coverage_counts')
      .select('zip_code, city, homeowner_count')
      .in('zip_code', zipList);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const breakdown: Record<string, { city: string; count: number }> = {};
    let total = 0;
    for (const row of data) {
      breakdown[row.zip_code] = { city: row.city, count: row.homeowner_count };
      total += row.homeowner_count;
    }

    return NextResponse.json({ total, breakdown });
  }
}

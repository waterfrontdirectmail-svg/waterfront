'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CitySelector, type CityData } from './CitySelector';
import { ZipSelector, type ZipData } from './ZipSelector';
import { CountDisplay } from './CountDisplay';
import { ExplorerCTAs } from './ExplorerCTAs';

type Mode = 'city' | 'zip';

interface CoverageResponse {
  counties: { name: string; cities: CityData[] }[];
  zips: ZipData[];
}

export function AudienceExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<CoverageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>(searchParams.get('zips') ? 'zip' : 'city');
  const [selectedCities, setSelectedCities] = useState<string[]>(
    searchParams.get('cities')?.split(',').filter(Boolean) || []
  );
  const [selectedZips, setSelectedZips] = useState<string[]>(
    searchParams.get('zips')?.split(',').filter(Boolean) || []
  );
  const [selectedCounty] = useState('Palm Beach');

  // Fetch coverage data
  useEffect(() => {
    fetch('/api/public/coverage')
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Update URL params (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (mode === 'city' && selectedCities.length > 0) {
        params.set('cities', selectedCities.join(','));
      } else if (mode === 'zip' && selectedZips.length > 0) {
        params.set('zips', selectedZips.join(','));
      }
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : '?', { scroll: false });
    }, 300);
    return () => clearTimeout(timeout);
  }, [mode, selectedCities, selectedZips, router]);

  const toggleCity = useCallback((city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  }, []);

  const toggleZip = useCallback((zip: string) => {
    setSelectedZips((prev) =>
      prev.includes(zip) ? prev.filter((z) => z !== zip) : [...prev, zip]
    );
  }, []);

  // Filter data by county
  const countyData = useMemo(() => {
    if (!data) return { cities: [] as CityData[], zips: [] as ZipData[] };
    const county = data.counties.find((c) => c.name === selectedCounty);
    const cities = county?.cities || [];
    const zips = data.zips
      .filter((z) => z.county === selectedCounty)
      .sort((a, b) => b.count - a.count);
    return { cities, zips };
  }, [data, selectedCounty]);

  // Calculate total
  const total = useMemo(() => {
    if (mode === 'city') {
      return countyData.cities
        .filter((c) => selectedCities.includes(c.name))
        .reduce((sum, c) => sum + c.count, 0);
    }
    return countyData.zips
      .filter((z) => selectedZips.includes(z.zip_code))
      .reduce((sum, z) => sum + z.count, 0);
  }, [mode, selectedCities, selectedZips, countyData]);

  // Build selection params for CTAs
  const selectionParams = useMemo(() => {
    if (mode === 'city' && selectedCities.length > 0) return `cities=${selectedCities.join(',')}`;
    if (mode === 'zip' && selectedZips.length > 0) return `zips=${selectedZips.join(',')}`;
    return '';
  }, [mode, selectedCities, selectedZips]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader className="text-center pb-4" style={{ backgroundColor: '#1B2A4A' }}>
        <CardTitle className="text-white text-xl md:text-2xl font-bold leading-tight">
          See How Many Waterfront Homeowners You Can Reach
        </CardTitle>
        <p className="text-slate-300 text-sm mt-1">
          Real data from {selectedCounty} County
        </p>
      </CardHeader>

      <CardContent className="p-4 md:p-6 space-y-4">
        {/* County selector (expandable later) */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 font-medium">County:</span>
          <Button variant="outline" size="sm" className="font-semibold" disabled>
            Palm Beach
          </Button>
          <span className="text-xs text-slate-400">More coming soon</span>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-lg border overflow-hidden">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              mode === 'city'
                ? 'text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
            style={mode === 'city' ? { backgroundColor: '#1B2A4A' } : {}}
            onClick={() => setMode('city')}
          >
            Select by City
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              mode === 'zip'
                ? 'text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
            style={mode === 'zip' ? { backgroundColor: '#1B2A4A' } : {}}
            onClick={() => setMode('zip')}
          >
            Select by Zip Code
          </button>
        </div>

        {/* Selector */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading coverage data...</div>
        ) : mode === 'city' ? (
          <CitySelector
            cities={countyData.cities}
            selected={selectedCities}
            onToggle={toggleCity}
          />
        ) : (
          <ZipSelector
            allZips={countyData.zips}
            selected={selectedZips}
            onToggle={toggleZip}
          />
        )}

        {/* Running total */}
        <CountDisplay count={total} loading={loading} />

        {/* CTAs */}
        <ExplorerCTAs
          selectionParams={selectionParams}
          disabled={total === 0}
        />
      </CardContent>
    </Card>
  );
}

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
    <Card className="w-full max-w-2xl mx-auto border border-slate-200/80 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
      <CardHeader className="relative pb-5 pt-6 px-6 md:px-8 text-center bg-gradient-to-br from-[#1B2A4A] via-[#1F3158] to-[#243A65]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMC44IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDQpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2cpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-60" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/70 text-xs font-medium tracking-wide uppercase px-3 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Live Data
          </div>
          <CardTitle className="text-white text-xl md:text-2xl font-bold leading-tight tracking-tight">
            Audience Explorer
          </CardTitle>
          <p className="text-slate-300/80 text-sm mt-1.5 font-normal">
            See exactly how many waterfront homeowners you can reach in {selectedCounty} County
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6 space-y-4">
        {/* County selector */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">County</span>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <span className="text-sm font-semibold text-slate-700">Palm Beach</span>
          </div>
          <span className="text-xs text-slate-400 italic">More coming soon</span>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              mode === 'city'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setMode('city')}
          >
            Select by City
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              mode === 'zip'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
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

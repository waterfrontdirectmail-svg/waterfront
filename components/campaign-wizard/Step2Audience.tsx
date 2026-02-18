"use client";

import React, { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Users } from "lucide-react";
import { MINIMUM_PIECES } from "@/lib/campaign-pricing";
import type { CampaignDraft } from "./types";

// Mock data — replace with Supabase queries against coverage_counts
const COUNTIES = ["Palm Beach", "Broward", "Miami-Dade", "Lee", "Collier", "Duval"];

const CITIES_BY_COUNTY: Record<string, { name: string; count: number }[]> = {
  "Palm Beach": [
    { name: "Boca Raton", count: 4200 },
    { name: "Delray Beach", count: 2800 },
    { name: "Jupiter", count: 3100 },
    { name: "West Palm Beach", count: 2600 },
    { name: "Palm Beach Gardens", count: 1900 },
  ],
  Broward: [
    { name: "Fort Lauderdale", count: 5800 },
    { name: "Pompano Beach", count: 3200 },
    { name: "Hollywood", count: 2400 },
    { name: "Deerfield Beach", count: 1800 },
  ],
  "Miami-Dade": [
    { name: "Miami Beach", count: 4100 },
    { name: "Coral Gables", count: 2900 },
    { name: "Key Biscayne", count: 1500 },
    { name: "Aventura", count: 2200 },
  ],
  Lee: [
    { name: "Cape Coral", count: 6200 },
    { name: "Fort Myers", count: 3400 },
    { name: "Sanibel", count: 1200 },
  ],
  Collier: [
    { name: "Naples", count: 4800 },
    { name: "Marco Island", count: 2100 },
  ],
  Duval: [
    { name: "Jacksonville", count: 3600 },
    { name: "Jacksonville Beach", count: 1400 },
  ],
};

const WATERWAY_TYPES = [
  { value: "all", label: "All Navigable Waterways" },
  { value: "intracoastal", label: "Intracoastal" },
  { value: "ocean-access", label: "Ocean-Access Canal" },
];

interface Props {
  draft: CampaignDraft;
  onUpdate: (data: Partial<CampaignDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Audience({ draft, onUpdate, onNext, onBack }: Props) {
  const [county, setCounty] = useState(draft.county);
  const [selectedCities, setSelectedCities] = useState<string[]>(draft.cities);
  const [selectedZips, setSelectedZips] = useState<string[]>(draft.zips);
  const [waterwayType, setWaterwayType] = useState(draft.waterwayType);

  const cities = county ? CITIES_BY_COUNTY[county] || [] : [];

  const audienceCount = cities
    .filter((c) => selectedCities.includes(c.name))
    .reduce((sum, c) => {
      // Apply rough waterway filter multiplier
      const mult = waterwayType === "all" ? 1 : waterwayType === "intracoastal" ? 0.6 : 0.35;
      return sum + Math.round(c.count * mult);
    }, 0);

  const underMinimum = audienceCount > 0 && audienceCount < MINIMUM_PIECES;

  const toggleCity = (name: string) => {
    setSelectedCities((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleCountyChange = useCallback((newCounty: string) => {
    setCounty(newCounty);
    setSelectedCities([]);
    setSelectedZips([]);
  }, []);

  const handleContinue = () => {
    onUpdate({
      county,
      cities: selectedCities,
      zips: selectedZips,
      waterwayType,
      audienceCount,
    });
    onNext();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1B2A4A]">Target Audience</h2>
      <p className="text-gray-500">
        Select the waterfront homeowners you want to reach.
      </p>

      {/* County */}
      <div className="space-y-2">
        <Label>County</Label>
        <select
          value={county}
          onChange={(e) => handleCountyChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
        >
          <option value="">Select a county...</option>
          {COUNTIES.map((c) => (
            <option key={c} value={c}>
              {c} County
            </option>
          ))}
        </select>
      </div>

      {/* Cities */}
      {county && cities.length > 0 && (
        <div className="space-y-2">
          <Label>Cities</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {cities.map((city) => (
              <label
                key={city.name}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedCities.includes(city.name)
                    ? "border-[#C9A84C] bg-[#C9A84C]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCities.includes(city.name)}
                    onChange={() => toggleCity(city.name)}
                    className="accent-[#1B2A4A]"
                  />
                  <span className="text-sm font-medium">{city.name}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {city.count.toLocaleString()} homes
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Waterway type */}
      <div className="space-y-2">
        <Label>Waterway Type</Label>
        <select
          value={waterwayType}
          onChange={(e) => setWaterwayType(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
        >
          {WATERWAY_TYPES.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </select>
      </div>

      {/* Running total */}
      <Card className="p-4 bg-[#1B2A4A]/5 border-[#1B2A4A]/20">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-[#C9A84C]" />
          <div>
            <p className="text-2xl font-bold text-[#1B2A4A]">
              {audienceCount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              waterfront homeowners match your criteria
            </p>
          </div>
        </div>
      </Card>

      {underMinimum && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm">
            Minimum order is {MINIMUM_PIECES.toLocaleString()} pieces. Add more
            cities to meet the minimum.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={audienceCount < MINIMUM_PIECES}
          className="flex-1 bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white disabled:opacity-50"
        >
          Continue to Design
        </Button>
      </div>
    </div>
  );
}

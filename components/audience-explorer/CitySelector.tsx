'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

export interface CityData {
  name: string;
  count: number;
  zip_codes: string[];
}

interface CitySelectorProps {
  cities: CityData[];
  selected: string[];
  onToggle: (city: string) => void;
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function CitySelector({ cities, selected, onToggle }: CitySelectorProps) {
  return (
    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
      {cities.map((city) => {
        const checked = selected.includes(city.name);
        return (
          <label
            key={city.name}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
              checked ? 'bg-slate-100 border border-slate-200' : 'hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={checked}
                onCheckedChange={() => onToggle(city.name)}
              />
              <span className="font-medium text-slate-800">{city.name}</span>
            </div>
            <Badge variant="secondary" className="font-mono text-xs tabular-nums">
              {formatNumber(city.count)}
            </Badge>
          </label>
        );
      })}
    </div>
  );
}

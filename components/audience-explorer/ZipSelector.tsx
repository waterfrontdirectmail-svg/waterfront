'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface ZipData {
  zip_code: string;
  city: string;
  county: string;
  count: number;
}

interface ZipSelectorProps {
  allZips: ZipData[];
  selected: string[];
  onToggle: (zip: string) => void;
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function ZipSelector({ allZips, selected, onToggle }: ZipSelectorProps) {
  const [input, setInput] = useState('');

  const filtered = input.length > 0
    ? allZips.filter((z) => z.zip_code.startsWith(input))
    : allZips;

  const handleAdd = (zip: string) => {
    if (!selected.includes(zip)) onToggle(zip);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.length === 5) {
      const match = allZips.find((z) => z.zip_code === input);
      if (match) handleAdd(match.zip_code);
    }
  };

  return (
    <div className="space-y-3">
      {/* Selected zips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((zip) => {
            const data = allZips.find((z) => z.zip_code === zip);
            return (
              <Badge
                key={zip}
                variant="default"
                className="px-3 py-1.5 text-sm cursor-pointer hover:opacity-80"
                style={{ backgroundColor: '#1B2A4A' }}
                onClick={() => onToggle(zip)}
              >
                {zip} {data ? `(${formatNumber(data.count)})` : ''}
                <span className="ml-1.5 opacity-70">✕</span>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Input */}
      <Input
        placeholder="Type a zip code (e.g. 33483)..."
        value={input}
        onChange={(e) => setInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
        onKeyDown={handleKeyDown}
        className="font-mono"
      />

      {/* Dropdown suggestions */}
      {input.length > 0 && filtered.length > 0 && (
        <div className="border rounded-lg max-h-[250px] overflow-y-auto">
          {filtered.map((z) => (
            <button
              key={z.zip_code}
              onClick={() => handleAdd(z.zip_code)}
              className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                selected.includes(z.zip_code) ? 'bg-slate-100' : ''
              }`}
            >
              <div>
                <span className="font-mono font-medium">{z.zip_code}</span>
                <span className="text-slate-500 text-sm ml-2">{z.city}</span>
              </div>
              <Badge variant="secondary" className="font-mono text-xs tabular-nums">
                {formatNumber(z.count)}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {/* Show all available when no input */}
      {input.length === 0 && (
        <div className="border rounded-lg max-h-[300px] overflow-y-auto">
          {allZips
            .sort((a, b) => b.count - a.count)
            .map((z) => (
              <button
                key={z.zip_code}
                onClick={() => onToggle(z.zip_code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                  selected.includes(z.zip_code) ? 'bg-slate-100' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs ${
                      selected.includes(z.zip_code)
                        ? 'bg-slate-800 border-slate-800 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {selected.includes(z.zip_code) && '✓'}
                  </div>
                  <span className="font-mono font-medium">{z.zip_code}</span>
                  <span className="text-slate-500 text-sm">{z.city}</span>
                </div>
                <Badge variant="secondary" className="font-mono text-xs tabular-nums">
                  {formatNumber(z.count)}
                </Badge>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';

interface ExplorerCTAsProps {
  selectionParams: string;
  disabled?: boolean;
}

export function ExplorerCTAs({ selectionParams, disabled }: ExplorerCTAsProps) {
  const quoteUrl = `/contact?${selectionParams}`;
  const campaignUrl = `/signup?${selectionParams}`;

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <Button
        asChild
        size="lg"
        className="w-full text-base font-semibold"
        style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
        disabled={disabled}
      >
        <a href={campaignUrl}>Start Your Campaign →</a>
      </Button>
    </div>
  );
}

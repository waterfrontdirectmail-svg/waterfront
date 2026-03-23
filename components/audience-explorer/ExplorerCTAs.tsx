'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ExplorerCTAsProps {
  selectionParams: string;
  disabled?: boolean;
}

export function ExplorerCTAs({ selectionParams, disabled }: ExplorerCTAsProps) {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to homepage then scroll to form
    router.push('/?scroll=get-started&' + selectionParams);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <Button
        size="lg"
        className="w-full text-base font-semibold"
        style={{ backgroundColor: '#C9A84C', color: '#1B2A4A' }}
        disabled={disabled}
        onClick={handleClick}
      >
        Start Your Campaign →
      </Button>
    </div>
  );
}

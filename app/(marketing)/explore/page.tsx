import { Suspense } from 'react';
import { AudienceExplorer } from '@/components/audience-explorer/AudienceExplorer';

export const metadata = {
  title: 'Explore Waterfront Coverage | Waterfront Direct Mail',
  description:
    'See how many waterfront homeowners you can reach with direct mail in Palm Beach & Broward counties.',
};

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="py-12 px-4">
        <div className="text-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: '#1B2A4A' }}
          >
            Waterfront Direct Mail
          </h1>
          <p className="text-slate-600 text-lg">
            Reach waterfront homeowners with precision-targeted direct mail
          </p>
        </div>
        <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading...</div>}>
          <AudienceExplorer />
        </Suspense>
      </div>
    </main>
  );
}

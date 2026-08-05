import { useEffect } from 'react';
import PicksLayout from '../../components/picksHome/PicksLayout.js';
import PricingPlans from '../../components/subscription/PricingPlans.js';

const PAGE_TITLE = 'Pricing | SharpSide Sports';

export default function PicksPricing() {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = 'sharpside golf';
    };
  }, []);

  return (
    <PicksLayout>
      <div className="px-4 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Pricing</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Every plan across sports and tools — pick what fits how you bet.
        </p>
      </div>
      <PricingPlans />
    </PicksLayout>
  );
}

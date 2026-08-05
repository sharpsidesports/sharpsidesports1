import { useEffect } from 'react';
import PicksLayout from '../../components/picksHome/PicksLayout.js';

interface NFLModelComingSoonProps {
  modelName: string;
}

export default function NFLModelComingSoon({ modelName }: NFLModelComingSoonProps) {
  useEffect(() => {
    document.title = `${modelName} | SharpSide Sports`;
    return () => {
      document.title = 'sharpside golf';
    };
  }, [modelName]);

  return (
    <PicksLayout>
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{modelName}</h1>
        <div className="mt-8 w-full rounded-2xl border border-gray-100 bg-gray-50 p-10 shadow-sm">
          <p className="text-lg font-semibold text-gray-900">Will be updated for Week 1 in the coming weeks.</p>
        </div>
      </div>
    </PicksLayout>
  );
}

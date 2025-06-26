import { Link } from 'react-router-dom';

interface UpgradePromptProps {
  requiredTier: 'basic' | 'pro';
}

export default function UpgradePrompt({ requiredTier }: UpgradePromptProps) {
  return (
    <div className="sticky top-0 z-50 pt-4 pb-6">
      <div className="text-center max-w-md mx-auto p-4 bg-white/95 rounded-lg shadow-lg backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} Plan
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {requiredTier === 'basic' 
            ? 'Upgrade to our Basic plan to access advanced features including Matchups, Three Ball, and Fantasy Optimizer.'
            : 'Upgrade to our Pro plan to unlock premium features including AI Caddie, Course Fit, and Expert Insights.'}
        </p>
        <button
          type="button"
          onClick={() => { window.location.href = '/subscription#plans'; }}
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          View Plans
        </button>
      </div>
    </div>
  );
} 
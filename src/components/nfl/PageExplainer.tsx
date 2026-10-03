import { useEffect, useState, type ReactNode } from 'react';

interface PageExplainerProps {
  // Unique per page — also doubles as the localStorage key, so changing it
  // effectively resets "has this browser seen it" (useful if the content
  // changes enough to warrant re-showing it once).
  storageKey: string;
  children: ReactNode;
}

// Collapsed by default, but auto-expands once per browser on a page a
// visitor has never opened before (no localStorage flag yet) — same
// collapsible pattern as the "Hide chart" toggle on the scatter plots, just
// defaulting open exactly once instead of always-open. Costs screen space
// on a first-ever visit only, not on every repeat visit.
export default function PageExplainer({ storageKey, children }: PageExplainerProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey);
      if (!seen) {
        setExpanded(true);
        localStorage.setItem(storageKey, '1');
      }
    } catch {
      // Private browsing / blocked storage — fall back to collapsed, no crash.
    }
  }, [storageKey]);

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/60">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-semibold text-gray-700"
      >
        <span>ⓘ How to read this page</span>
        <span className="shrink-0 text-xs font-normal text-gray-400">{expanded ? 'Hide' : 'Show'}</span>
      </button>
      {expanded && (
        <div className="space-y-1.5 border-t border-gray-200 px-3 py-3 text-xs text-gray-600">{children}</div>
      )}
    </div>
  );
}

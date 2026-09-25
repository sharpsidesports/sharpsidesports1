import React, { useState } from 'react';
import NflPlayerAvatar from './NflPlayerAvatar.js';

export interface PlayerCardTag {
  label: string;
  tone?: 'green' | 'blue' | 'amber' | 'gray';
}

interface PlayerCardProps {
  rank: number;
  name: string;
  espnId?: string | null;
  subtitle: string; // e.g. "WR · DET vs BUF"
  tags?: PlayerCardTag[];
  score: number | null;
  scoreLabel?: string;
  blurred?: boolean;
  onUnlockClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode; // detail panel content, shown when expanded
}

const TAG_STYLES: Record<NonNullable<PlayerCardTag['tone']>, string> = {
  green: 'bg-sharpside-green/10 text-sharpside-green',
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  gray: 'bg-gray-100 text-gray-600',
};

// Shared card shell for both NFL model pages: rank, headshot, name/subtitle,
// tag chips, a big score badge, and an expandable detail panel. Each page
// supplies its own detail content via children, and its own tags/score.
export default function PlayerCard({
  rank,
  name,
  espnId,
  subtitle,
  tags = [],
  score,
  scoreLabel = 'Sharp Score',
  blurred = false,
  onUnlockClick,
  children,
}: PlayerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail = Boolean(children);

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="w-5 shrink-0 text-center text-sm font-semibold text-gray-400 sm:w-6">{rank}</div>
        <NflPlayerAvatar name={name} espnId={espnId} size={40} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-gray-900">{name}</div>
          <div className="truncate text-xs text-gray-500">{subtitle}</div>
          {tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag.label}
                  className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${TAG_STYLES[tag.tone ?? 'gray']}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="relative shrink-0 text-center">
          {blurred && (
            <button
              type="button"
              onClick={onUnlockClick}
              className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 text-[10px] font-semibold text-sharpside-green backdrop-blur-sm"
            >
              Unlock
            </button>
          )}
          <div className={blurred ? 'blur-sm select-none' : ''}>
            <div className="text-2xl font-bold text-sharpside-green">{score ?? '—'}</div>
            <div className="text-[10px] uppercase tracking-wide text-gray-400">{scoreLabel}</div>
          </div>
        </div>
        {hasDetail && !blurred && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 text-xs font-semibold text-sharpside-green hover:underline"
          >
            {expanded ? 'Hide' : 'Detail'}
          </button>
        )}
      </div>
      {expanded && !blurred && hasDetail && (
        <div className="rounded-b-xl border-t border-gray-100 bg-gray-50/60 px-4 py-3">{children}</div>
      )}
    </div>
  );
}

function Block({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

// Placeholder table rows shown while the initial fetch is in flight — matches
// TdModelTable's column count/shape so layout doesn't jump once data lands.
export function TableRowsSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-t border-gray-100">
          <td className="p-3">
            <div className="flex items-center gap-3">
              <Block className="h-9 w-9 shrink-0 rounded-full" />
              <div className="space-y-1.5">
                <Block className="h-3.5 w-28" />
                <Block className="h-3 w-20" />
              </div>
            </div>
          </td>
          {Array.from({ length: 5 }).map((__, j) => (
            <td key={j} className="p-3">
              <Block className="h-5 w-16 ml-auto" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function TopPlayCardSkeleton() {
  return (
    <div className="w-60 shrink-0 snap-start rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center gap-3">
        <Block className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Block className="h-3.5 w-24" />
          <Block className="h-3 w-16" />
        </div>
      </div>
      <Block className="mt-3 h-3 w-full" />
      <Block className="mt-1.5 h-3 w-2/3" />
    </div>
  );
}

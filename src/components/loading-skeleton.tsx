type LoadingSkeletonProps = {
  columns: number;
  rows?: number;
};

export function LoadingSkeleton({ columns, rows = 10 }: LoadingSkeletonProps) {
  return (
    <div className="border border-gray-200 rounded-b-lg">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid gap-4 p-4 border-b border-gray-200 last:border-b-0`}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

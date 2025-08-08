type ProgressBarProps = {
  progress: number | null;
  showPercentage?: boolean;
};

export function ProgressBar({
  progress,
  showPercentage = true,
}: ProgressBarProps) {
  if (progress == null) {
    return <span className="text-sm text-gray-500">-</span>;
  }

  const percentage = Math.round(progress * 100);

  return (
    <>
      <div
        className="w-full bg-gray-200 rounded-full h-2 mr-2"
        data-testid="progress-bar-container"
      >
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: percentage + "%" }}
          data-testid="progress-bar-fill"
        ></div>
      </div>
      {showPercentage && (
        <span className="text-sm font-mono">{percentage}%</span>
      )}
    </>
  );
}

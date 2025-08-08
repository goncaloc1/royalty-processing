import { DashboardEntry } from "@/types/songs";
import { ProgressBar } from "./progress-bar";

type SongsProps = {
  data: DashboardEntry[];
  onIssueInvoice: (row: DashboardEntry) => void;
  mutatingId: number | null;
};

export function Songs({
  data,
  onIssueInvoice: handleClick,
  mutatingId,
}: SongsProps) {
  const isButtonDisabled = (row: DashboardEntry) =>
    mutatingId === row.id ||
    row?.progress === 0 ||
    row?.progress === row.lastClickProgress;

  return (
    <>
      <div className="grid grid-cols-[1fr_4fr_3fr_2fr_3fr_2fr_3fr] gap-4 bg-gray-100 p-4 rounded-t-lg font-semibold text-sm text-gray-700">
        <div>Id</div>
        <div>Song Name</div>
        <div>Author</div>
        <div>Progress</div>
        <div></div>
        <div>Last Click Date</div>
        <div>Last Click Progress</div>
      </div>

      <div className="border border-gray-200 rounded-b-lg">
        {data.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[1fr_4fr_3fr_2fr_3fr_2fr_3fr] gap-4 p-4 border-b border-gray-200 hover:bg-gray-50"
          >
            <div className="text-sm">{row.id}</div>
            <div className="font-medium">{row.song}</div>
            <div className="text-gray-600">{row.author}</div>
            <div className="flex items-center">
              <ProgressBar progress={row.progress} />
            </div>
            <div className="flex items-center border-l border-gray-300 pl-4 ml-2">
              <button
                onClick={() => handleClick(row)}
                disabled={isButtonDisabled(row)}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-xs"
              >
                Issue Invoice
              </button>
            </div>
            <div className="text-xs text-gray-600">
              {row.lastClickDate || "-"}
            </div>
            <div className="text-xs text-gray-600">
              {row.lastClickProgress ? `${row.lastClickProgress * 100}%` : "-"}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

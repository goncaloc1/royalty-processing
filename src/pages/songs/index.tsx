import { DashboardEntry } from "@/types/songs";
import { useState } from "react";

type SongsPageProps = {
  data: DashboardEntry[];
};

export default function Home({ data }: SongsPageProps) {
  const [isGenerating, setIsGenerating] = useState<number | null>(null);

  const handleIssueInvoice = async (row: DashboardEntry) => {
    setIsGenerating(row.id);

    try {
      // Get current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      const payload = {
        date: currentDate,
        author: row.author,
        songName: row.song,
        progress: row.progress,
      };

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create invoice");
      }

      const result = await response.json();
      console.log(`Invoice created successfully! ID: ${result.data.id}`);

      // Refresh the page to update the "Last Click" data
      window.location.reload();
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice. Please try again.");
    } finally {
      setIsGenerating(null);
    }
  };
  return (
    <div className="w-[70%]">
      <div className="grid grid-cols-[1fr_4fr_3fr_2fr_3fr_2fr_3fr] gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-t-lg font-semibold text-sm text-gray-700 dark:text-gray-300">
        <div>Id</div>
        <div>Song Name</div>
        <div>Author</div>
        <div>Progress</div>
        <div></div>
        <div>Last Click Date</div>
        <div>Last Click Progress</div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg">
        {data.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[1fr_4fr_3fr_2fr_3fr_2fr_3fr] gap-4 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="font-mono text-sm">{row.id}</div>
            <div className="font-medium">{row.song}</div>
            <div className="text-gray-600 dark:text-gray-400">{row.author}</div>
            <div className="flex items-center">
              {row.progress !== null ? (
                <>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: row.progress * 100 + "%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-mono">
                    {Math.round(row.progress * 100)}%
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  -
                </span>
              )}
            </div>
            <div className="flex items-center border-l border-gray-300 dark:border-gray-600 pl-4 ml-2">
              <button
                onClick={() => handleIssueInvoice(row)}
                disabled={
                  isGenerating === row.id ||
                  !row.progress ||
                  row.progress === 0 ||
                  row.progress === row.lastClickProgress
                }
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              >
                Issue Invoice
              </button>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {row.lastClickDate || "-"}
            </div>
            <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
              {row.lastClickProgress ? `${row.lastClickProgress * 100}%` : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { getServerSideProps } from "./get-server-side-props";

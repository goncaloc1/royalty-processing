import { InvoiceEntry } from "@/types/invoices";
import { ProgressBar } from "./progress-bar";

type InvoicesProps = {
  data: InvoiceEntry[];
};

export function Invoices({ data }: InvoicesProps) {
  return (
    <>
      <div className="grid grid-cols-[1fr_2fr_3fr_4fr_2fr] gap-4 bg-gray-100 p-4 rounded-t-lg font-semibold text-sm text-gray-700">
        <div>Id</div>
        <div>Date</div>
        <div>Author</div>
        <div>Song Name</div>
        <div>Progress</div>
      </div>

      <div className="border border-gray-200 rounded-b-lg">
        {data.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[1fr_2fr_3fr_4fr_2fr] gap-4 p-4 border-b border-gray-200 hover:bg-gray-50"
          >
            <div className="font-mono text-sm">{row.id}</div>
            <div className="text-sm text-gray-600">{row.date}</div>
            <div className="text-gray-600">{row.author}</div>
            <div className="font-medium">{row.songName}</div>
            <div className="flex items-center">
              <ProgressBar progress={row.progress} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

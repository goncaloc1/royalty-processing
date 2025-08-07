import { useInvoices } from "@/hooks/useInvoices";

export default function Invoices() {
  const { error, data } = useInvoices();

  if (error) {
    return <div>Error...</div>;
  }

  if (data == null) {
    return <div>loading</div>;
  }

  return (
    <div className="w-[70%]">
      <div className="grid grid-cols-[1fr_2fr_3fr_4fr_2fr] gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-t-lg font-semibold text-sm text-gray-700 dark:text-gray-300">
        <div>Id</div>
        <div>Date</div>
        <div>Author</div>
        <div>Song Name</div>
        <div>Progress</div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg">
        {data.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[1fr_2fr_3fr_4fr_2fr] gap-4 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="font-mono text-sm">{row.id}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {row.date}
            </div>
            <div className="text-gray-600 dark:text-gray-400">{row.author}</div>
            <div className="font-medium">{row.songName}</div>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: Math.round(row.progress * 100) + "%" }}
                ></div>
              </div>
              <span className="text-sm font-mono">
                {Math.round(row.progress * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { getStaticProps } from "../../ssr/invoices/get-server-side-props";

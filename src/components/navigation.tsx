import Link from "next/link";

type NavigationProps = {
  activeTab: "songs" | "invoices";
};

export default function Navigation({ activeTab }: NavigationProps) {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700">
      <nav className="flex justify-center">
        <Link href="/songs">
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "songs"
                ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Songs
          </button>
        </Link>
        <Link href="/invoices">
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "invoices"
                ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Invoices
          </button>
        </Link>
      </nav>
    </header>
  );
}

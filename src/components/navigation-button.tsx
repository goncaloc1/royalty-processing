import Link from "next/link";

type NavigationButtonProps = {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
};

export function NavigationButton({
  href,
  isActive,
  children,
}: NavigationButtonProps) {
  return (
    <Link href={href}>
      <button
        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
          isActive
            ? "text-blue-600 border-blue-600 bg-blue-50"
            : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        {children}
      </button>
    </Link>
  );
}

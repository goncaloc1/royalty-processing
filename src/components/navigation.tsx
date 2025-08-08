import { NavigationButton } from "./navigation-button";

type NavigationProps = {
  activeTab: "songs" | "invoices";
};

export function Navigation({ activeTab }: NavigationProps) {
  return (
    <header className="w-full border-b border-gray-200">
      <nav className="flex justify-center">
        <NavigationButton href="/songs" isActive={activeTab === "songs"}>
          Songs
        </NavigationButton>
        <NavigationButton href="/invoices" isActive={activeTab === "invoices"}>
          Invoices
        </NavigationButton>
      </nav>
    </header>
  );
}

import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "./navigation";
import { useRouter } from "next/router";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  // Determine active tab based on current route - songs is the default page
  const getActiveTab = (): "songs" | "invoices" =>
    router.pathname === "/invoices" ? "invoices" : "songs";

  // Hide navigation for error page
  const hideNavigation = router.pathname === "/error";

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen flex flex-col`}
    >
      {!hideNavigation && <Navigation activeTab={getActiveTab()} />}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="w-[70%]">{children}</div>
      </main>
    </div>
  );
}

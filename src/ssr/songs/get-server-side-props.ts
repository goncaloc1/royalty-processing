import { DashboardEntry, isDashboardEntry } from "@/types/songs";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetStaticProps } from "next";
import { dbQueries } from "@/repository/queries";
import { seedDatabase } from "@/repository/seed";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["songs"],
      queryFn: async (): Promise<{ data: DashboardEntry[] }> => {
        console.log("songs SSR");

        // Seed database on first run (safe to call multiple times)
        seedDatabase();

        // Get data directly from database instead of API call
        const result = dbQueries.getDashboard.all();

        const data: DashboardEntry[] = result.map((o: unknown) => {
          if (!isDashboardEntry(o)) {
            throw new Error("Invalid dashboard entry");
          }
          return o;
        });

        return { data };
      },
    });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
      // data will be served from cache until revalidation
      revalidate: 9999,
    };
  } catch (err) {
    console.error("Error during static generation:", err);
    // For static generation, we can't redirect on error during build
    // Return empty state and let client handle the error
    return {
      props: {
        dehydratedState: dehydrate(new QueryClient()),
      },
      revalidate: 10, // Retry more frequently if there was an error
    };
  }
};

import { InvoiceEntry, isInvoiceEntry } from "@/types/invoices";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetStaticProps } from "next";
import { dbQueries } from "@/repository/queries";
import { seedDatabase } from "@/repository/seed";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["invoices"],
      queryFn: async (): Promise<{ data: InvoiceEntry[] }> => {
        console.log("invoices SSR");

        // Seed database on first run (safe to call multiple times)
        seedDatabase();

        // Get data directly from database instead of API call
        const data = dbQueries.getInvoiceHistory.all();

        const invoices: InvoiceEntry[] = data.map((o: unknown) => {
          if (!isInvoiceEntry(o)) {
            throw new Error("Invalid invoice entry");
          }

          // return {
          //   ...o,
          //   progress: Math.round(o.progress * 100), // Convert to percentage
          // };
          return o;
        });

        return { data: invoices };
      },
    });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
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

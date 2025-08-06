import { InvoiceEntry, isInvoiceEntry } from "@/types/invoices";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await fetch("http://localhost:3000/api/invoices");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();

    const invoices: InvoiceEntry[] = data.map((o: unknown) => {
      if (!isInvoiceEntry(o)) {
        throw new Error("Invalid invoice entry");
      }

      return {
        ...o,
        progress: Math.round(o.progress * 100), // Convert to percentage
      };
    });

    return {
      props: {
        invoices,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

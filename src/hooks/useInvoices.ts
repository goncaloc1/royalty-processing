import { InvoiceEntry } from "@/types/invoices";
import { useQuery } from "@tanstack/react-query";

const fetchInvoices = async (): Promise<{ data: InvoiceEntry[] }> => {
  const response = await fetch("/api/invoices");
  return await response.json();
};

export const useInvoices = () => {
  const { error, data: invoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
  });

  return {
    data: invoices?.data,
    error,
  } as const;
};

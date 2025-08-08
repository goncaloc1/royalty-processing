import { useInvoices } from "@/hooks/use-invoices";
import { Invoices } from "@/components/invoices";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function InvoicesPage() {
  const router = useRouter();
  const { error, data } = useInvoices();

  useEffect(() => {
    if (error) {
      router.push("/error");
    }
  }, [error, router]);

  if (data == null) {
    return <LoadingSkeleton columns={5} />;
  }

  return <Invoices data={data} />;
}

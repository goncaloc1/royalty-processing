import { useInvoices } from "@/hooks/useInvoices";
import { Invoices } from "@/components/invoices";

export default function InvoicesPage() {
  const { error, data } = useInvoices();

  if (error) {
    return <div>Error...</div>;
  }

  if (data == null) {
    return <div>loading</div>;
  }

  return (
    <div className="w-[70%]">
      <Invoices data={data} />
    </div>
  );
}

export { getStaticProps } from "../../ssr/invoices/get-server-side-props";

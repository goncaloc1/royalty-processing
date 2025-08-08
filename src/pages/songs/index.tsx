import { Songs } from "@/components/songs";
import { useSongs } from "@/hooks/useSongs";

export default function Home() {
  const { data, error, mutatingId, mutate } = useSongs();

  if (error) {
    return <div>Error... {error.message}</div>;
  }

  if (data == null) {
    return <div>loading</div>;
  }

  return (
    <div className="w-[70%]">
      <Songs data={data} onIssueInvoice={mutate} mutatingId={mutatingId} />
    </div>
  );
}

export { getStaticProps } from "../../ssr/songs/get-server-side-props";

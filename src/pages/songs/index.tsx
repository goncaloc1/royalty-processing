import { Songs } from "@/components/songs";
import { useSongs } from "@/hooks/useSongs";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data, error, mutatingId, mutate } = useSongs();

  useEffect(() => {
    if (error) {
      router.push("/error");
    }
  }, [error, router]);

  if (data == null) {
    return <LoadingSkeleton columns={7} />;
  }

  return <Songs data={data} onIssueInvoice={mutate} mutatingId={mutatingId} />;
}

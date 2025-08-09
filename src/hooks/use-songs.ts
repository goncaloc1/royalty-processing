import { SongEntry } from "@/types/songs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const fetchSongs = async (): Promise<{ data: SongEntry[] }> => {
  console.log("🔄 Fetching songs data...");
  const response = await fetch("/api/songs");
  const result = await response.json();
  console.log("✅ Songs data fetched:", result);
  return result;
};

const issueInvoice = async (payload: unknown) => {
  const response = await fetch("/api/invoices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to issue invoice");
  }

  const result = await response.json();

  return result.data;
};

const buildPayload = (row: SongEntry) => ({
  date: new Date().toISOString().split("T")[0], //  YYYY-MM-DD format
  author: row.author,
  songName: row.song,
  progress: row.progress,
});

export const useSongs = () => {
  const queryClient = useQueryClient();

  const { error, data: songs } = useQuery({
    queryKey: ["songs"],
    queryFn: fetchSongs,
  });

  const mutation = useMutation({
    mutationFn: async (row: SongEntry) => {
      setMutatingId(row.id);

      const payload = buildPayload(row);
      const result = await issueInvoice(payload);

      console.log(`Invoice issued successfully! ID: ${result.id}`);

      return {
        ...row,
        lastClickDate: payload.date,
        lastClickProgress: payload.progress,
      };
    },
    onSuccess: (hydratedEntry) => {
      const hydratedData = songs?.data.map((o) =>
        o.id === hydratedEntry?.id ? hydratedEntry : o
      );

      // Manually update cache to avoid stale data and wait for next server response
      queryClient.setQueryData(["songs"], { data: hydratedData });

      console.log("Cache manually updated");
    },
    onError: (error) => {
      console.error("Error during mutation:", error);
      alert("Failed to issue invoice. Please try again.");
    },
    onSettled: () => {
      // Always refetch after error or success
      // Invalidate queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });

      setMutatingId(null);
    },
  });

  const [mutatingId, setMutatingId] = useState<number | null>(null);

  return {
    data: songs?.data,
    error,
    mutate: mutation.mutate,
    mutatingId,
  } as const;
};

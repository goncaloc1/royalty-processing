import { NextApiRequest, NextApiResponse } from "next";
import { dbQueries } from "@/repository/queries";
import { seedDatabase } from "@/repository/seed";

export type Digested = {
  id: number;
  song: string;
  author: string;
  progress: number | null;
  lastClickDate: string | null;
  lastClickProgress: number | null;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Digested[]>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" } as any);
  }

  try {
    // Seed database on first run
    seedDatabase();

    // Get dashboard data from database
    const results = dbQueries.getDashboard.all() as any[];

    const digested: Digested[] = results.map((row) => ({
      id: row.id,
      song: row.song,
      author: row.author,
      progress: row.progress,
      lastClickDate: row.lastClickDate,
      lastClickProgress: row.lastClickProgress,
    }));

    res.status(200).json(digested);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error" } as any);
  }
}

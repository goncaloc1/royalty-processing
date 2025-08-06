import { NextApiRequest, NextApiResponse } from "next";
import { dbQueries } from "@/repository/queries";
import { seedDatabase } from "@/repository/seed";

export type InvoiceData = {
  id: number;
  date: string;
  author: string;
  songName: string;
  progress: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<InvoiceData[]>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" } as any);
  }

  try {
    // Seed database on first run
    seedDatabase();

    // Get invoice history from database
    const results = dbQueries.getInvoiceHistory.all() as any[];

    const invoices: InvoiceData[] = results.map((row) => ({
      id: row.id,
      date: row.date,
      author: row.author,
      songName: row.songName,
      progress: Math.round(row.progress * 100), // Convert to percentage
    }));

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error" } as any);
  }
}

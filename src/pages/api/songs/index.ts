import { NextApiRequest, NextApiResponse } from "next";
import { dbQueries } from "@/repository/queries";
import { seedDatabase } from "@/repository/seed";
import { Response } from "../types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Seed database on first run
    seedDatabase();

    const data = dbQueries.getSongList.all();

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error getting invoice from db:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

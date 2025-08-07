import { NextApiRequest, NextApiResponse } from "next";
import { dbQueries } from "@/repository/queries";
import { seedDatabase } from "@/repository/seed";
import { Response } from "../types";
import { generateGuid } from "../helpers";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  // Seed database on first run
  seedDatabase();

  if (req.method === "GET") {
    try {
      const data = dbQueries.getInvoiceHistory.all();
      res.status(200).json({ data });
    } catch (error) {
      console.error("Error getting invoice from db:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    try {
      const { date, author, songName, progress } = req.body;

      if (
        ["date", "author", "songName", "progress"].some(
          (prop) => req.body[prop] == null
        )
      ) {
        return res.status(400).json({
          error: "Missing required fields: date, author, songName, progress",
        });
      }

      // Get song GUID by songName and author
      const songResult = dbQueries.getSongGuid.get(songName, author) as
        | { guid: string }
        | undefined;

      if (!songResult) {
        return res
          .status(400)
          .json({ error: "Song not found with the provided name and author" });
      }

      // Generate new GUID for invoice
      const invoiceGuid = generateGuid();

      // Get next available ID
      const nextIdResult = dbQueries.getNextInvoiceId.get() as {
        nextId: number;
      };

      dbQueries.insertInvoice.run(
        invoiceGuid,
        nextIdResult.nextId,
        songResult.guid,
        date,
        progress
      );

      res.status(201).json({
        data: {
          message: "Invoice created successfully",
          id: nextIdResult.nextId,
        },
      });
    } catch (error) {
      console.error("Error inserting invoice in db:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

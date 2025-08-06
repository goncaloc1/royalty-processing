import type { NextApiRequest, NextApiResponse } from "next";

const songs: SongRow[] = [
  {
    id: 1,
    song: "Bohemian Rhapsody",
    author: "Queen",
  },
  {
    id: 2,
    song: "Hotel California",
    author: "Eagles",
  },
  {
    id: 3,
    song: "Stairway to Heaven",
    author: "Led Zeppelin",
  },
  {
    id: 4,
    song: "Sweet Child O' Mine",
    author: "Guns N' Roses",
  },
  {
    id: 5,
    song: "Imagine",
    author: "John Lennon",
  },
  {
    id: 6,
    song: "Camarillo Brillo",
    author: "Frank Zappa",
  },
];

const invoices: InvoiceRow[] = [
  {
    id: 1,
    songId: 1,
    date: "2024-08-01",
    progress: 0.75,
  },
  {
    id: 2,
    songId: 2,
    date: "2024-07-25",
    progress: 0.32,
  },
  {
    id: 3,
    songId: 4,
    date: "2024-07-30",
    progress: 0.6,
  },
  {
    id: 4,
    songId: 2,
    date: "2024-07-28",
    progress: 0.95,
  },
  {
    id: 5,
    songId: 3,
    date: "2024-08-03",
    progress: 0.45,
  },
  {
    id: 6,
    songId: 5,
    date: "2024-08-02",
    progress: 0.88,
  },
];

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

  const processedInvoices: InvoiceData[] = invoices.map((invoice) => {
    const song = songs.find((s) => s.id === invoice.songId);

    return {
      id: invoice.id,
      date: invoice.date,
      author: song?.author || "Unknown",
      songName: song?.song || "Unknown",
      progress: Math.round(invoice.progress * 100), // Convert to percentage
    };
  });

  res.status(200).json(processedInvoices);
}

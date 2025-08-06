import type { NextApiRequest, NextApiResponse } from "next";

type SongRow = {
  id: number;
  song: string;
  author: string;
};

type RoyaltyProgress = {
  id: number;
  songId: number;
  progress: number;
};

type InvoiceRow = {
  id: number;
  songId: number;
  date: string;
  progress: number;
};

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

const royaltyProgress: RoyaltyProgress[] = [
  {
    id: 1,
    songId: 1,
    progress: 0.85,
  },
  {
    id: 2,
    songId: 2,
    progress: 1,
  },
  {
    id: 3,
    songId: 3,
    progress: 0.42,
  },
  {
    id: 4,
    songId: 4,
    progress: 0.67,
  },
  {
    id: 5,
    songId: 5,
    progress: 0.23,
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

  const digested: Digested[] = songs.map((song) => {
    const progress =
      royaltyProgress.find((p) => p.songId === song.id)?.progress ?? null;

    // Get all invoices for this song and find the one with highest progress
    const songInvoices = invoices.filter((i) => i.songId === song.id);
    const lastInvoice =
      songInvoices.length > 0
        ? songInvoices.reduce((latest, current) =>
            current.progress > latest.progress ? current : latest
          )
        : null;

    return {
      id: song.id,
      song: song.song,
      author: song.author,
      progress: progress,
      lastClickDate: lastInvoice?.date ?? null,
      lastClickProgress: lastInvoice?.progress ?? null,
    };
  });

  res.status(200).json(digested);
}

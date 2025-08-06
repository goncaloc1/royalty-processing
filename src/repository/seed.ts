import { dbQueries } from "./queries";

// Helper function to generate GUID
function generateGuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Seed database with initial data
export function seedDatabase() {
  // Check if data already exists
  const existingSongs = dbQueries.getAllSongs.all();
  if (existingSongs.length > 0) {
    return;
  }

  console.log("Seeding database...");

  // Insert songs with GUIDs
  const songsData = [
    [1, "Upside Down", "Diana Ross"],
    [2, "Rusty Cage", "Johnny Cash"],
    [3, "The Lemon Song", "Led Zeppelin"],
    [4, "Come Together", "The Beatles"],
    [5, "Joe le Taxi", "Vanessa Paradis"],
    [6, "Camarillo Brillo", "Frank Zappa"],
    [7, "Gimme Shelter", "Rolling Stones"],
    [8, "Lilac Wine", "Jeff Buckley"],
    [9, "Down by the Water", "PJ Harvey"],
    [10, "Babooshka", "Kate Bush"],
  ];

  const songGuidMap = new Map<number, string>(); // Map UI ID to GUID

  for (const [id, song, author] of songsData) {
    const guid = generateGuid();
    songGuidMap.set(id as number, guid);
    dbQueries.insertSong.run(guid, id, song, author);
  }

  // Insert royalty progress with GUIDs
  const royaltyProgressData = [
    [1, 0.75], // [song_ui_id, progress]
    [2, 1],
    [3, 0.42],
    [4, 0.67],
    [5, 0.23],
    [6, 0.89],
    [8, 0.71],
    [9, 0.36],
  ];

  for (const [songId, progress] of royaltyProgressData) {
    const songGuid = songGuidMap.get(songId as number);
    if (songGuid) {
      dbQueries.insertRoyaltyProgress.run(songGuid, progress);
    }
  }

  // Insert invoices with GUIDs and sequential IDs
  const invoicesData = [
    [2, "2024-01-25", 0.32], // [song_ui_id, date, progress]
    [2, "2024-03-10", 0.98],
    [4, "2024-03-12", 0.09],
    [1, "2025-04-01", 0.71],
    [5, "2025-04-02", 0.23],
    [3, "2025-05-03", 0.39],
    [4, "2025-08-08", 0.67],
  ];

  let invoiceId = 1;
  for (const [songId, date, progress] of invoicesData) {
    const guid = generateGuid();
    const songGuid = songGuidMap.get(songId as number);
    if (songGuid) {
      dbQueries.insertInvoice.run(guid, invoiceId, songGuid, date, progress);
      invoiceId++;
    }
  }

  console.log("Database seeded successfully");
}

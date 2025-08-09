import db from "./database";

// Database query functions - the database is already initialized in database.ts
export const dbQueries = {
  // Song
  getAllSongs: db.prepare("SELECT id, song, author FROM song ORDER BY id"),
  getSongGuid: db.prepare(
    "SELECT guid FROM song WHERE song = ? AND author = ?"
  ),
  insertSong: db.prepare(
    "INSERT INTO song (guid, id, song, author) VALUES (?, ?, ?, ?)"
  ),

  // Royalty Progress
  insertRoyaltyProgress: db.prepare(
    "INSERT INTO royalty_progress (song_guid, progress) VALUES (?, ?)"
  ),

  // Invoice
  getNextInvoiceId: db.prepare(
    "SELECT COALESCE(MAX(id), 0) + 1 as nextId FROM invoice"
  ),
  insertInvoice: db.prepare(
    "INSERT INTO invoice (guid, id, song_guid, date, progress) VALUES (?, ?, ?, ?, ?)"
  ),

  // Complex queries
  getSongList: db.prepare(`
    SELECT
      s.id,
      s.song,
      s.author,
      rp.progress,
      MAX(i.date) as lastClickDate,
      MAX(i.progress) as lastClickProgress
    FROM song s
    LEFT JOIN royalty_progress rp ON s.guid = rp.song_guid
    LEFT JOIN invoice i ON s.guid = i.song_guid
    GROUP BY s.id, s.song, s.author, rp.progress
    ORDER BY s.id
  `),

  getInvoiceHistory: db.prepare(`
    SELECT
      i.id,
      i.date,
      s.author,
      s.song as songName,
      i.progress
    FROM invoice i
    JOIN song s ON i.song_guid = s.guid
    ORDER BY i.id
  `),
};

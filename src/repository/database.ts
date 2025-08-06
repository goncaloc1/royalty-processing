import Database from "better-sqlite3";
import path from "path";

// Create database file in the project root
const dbPath = path.join(process.cwd(), "royalty.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize database schema
export function initializeDatabase() {
  // Create song table
  db.exec(`
    CREATE TABLE IF NOT EXISTS song (
      guid TEXT PRIMARY KEY,
      id INTEGER NOT NULL UNIQUE,
      song TEXT NOT NULL,
      author TEXT NOT NULL
    )
  `);

  // Create royalty_progress table
  db.exec(`
    CREATE TABLE IF NOT EXISTS royalty_progress (
      song_guid TEXT NOT NULL,
      progress REAL NOT NULL,
      PRIMARY KEY (song_guid, progress),
      FOREIGN KEY (song_guid) REFERENCES song (guid)
    )
  `);

  // Create invoice table
  db.exec(`
    CREATE TABLE IF NOT EXISTS invoice (
      guid TEXT PRIMARY KEY,
      id INTEGER NOT NULL UNIQUE,
      song_guid TEXT NOT NULL,
      date TEXT NOT NULL,
      progress REAL NOT NULL,
      FOREIGN KEY (song_guid) REFERENCES song (guid)
    )
  `);
}

// Initialize database when this module is imported
initializeDatabase();

export default db;

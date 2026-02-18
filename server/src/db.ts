import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { CONFIG } from "./config.js";

const dataDir = path.dirname(CONFIG.dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(CONFIG.dbPath);

db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("foreign_keys = ON");

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'editor' CHECK(role IN ('admin', 'editor')),
      avatar TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL DEFAULT '',
      featured_image TEXT,
      category_id INTEGER REFERENCES categories(id),
      author_id INTEGER REFERENCES users(id),
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'scheduled')),
      published_at TEXT,
      scheduled_at TEXT,
      meta_title TEXT,
      meta_description TEXT,
      og_image TEXT,
      views INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      urgent INTEGER DEFAULT 0,
      breaking INTEGER DEFAULT 0,
      read_time TEXT DEFAULT '3 min lexim',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS article_tags (
      article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (article_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      author_name TEXT NOT NULL,
      author_email TEXT,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      likes INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      width INTEGER,
      height INTEGER,
      path TEXT NOT NULL,
      uploaded_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
    CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
    CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
    CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
    CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
    CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
    CREATE INDEX IF NOT EXISTS idx_media_uploaded ON media(uploaded_by);
  `);

  console.log("[DB] Schema initialized");
}

export function seedDatabase(): void {
  const userCount = db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number };
  if (userCount.c > 0) {
    console.log("[DB] Already seeded, skipping");
    return;
  }

  const adminHash = bcrypt.hashSync("admin123", 12);
  const editorHash = bcrypt.hashSync("editor123", 12);

  db.prepare("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)")
    .run("admin@alnn.al", adminHash, "Admin ALNN", "admin");
  db.prepare("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)")
    .run("editor@alnn.al", editorHash, "Redaktor ALNN", "editor");

  const categories = [
    ["Politikë", "politike", "Lajmet nga bota e politikës shqiptare dhe ndërkombëtare"],
    ["Ekonomi", "ekonomi", "Zhvillimet ekonomike, tregjet financiare dhe biznesi"],
    ["Sport", "sport", "Lajmet nga bota e sportit shqiptar dhe ndërkombëtar"],
    ["Teknologji", "teknologji", "Inovacione, teknologji dhe shkencë"],
    ["Botë", "bote", "Ngjarjet kryesore nga bota dhe gjeopolitika"],
    ["Kulturë", "kulture", "Art, kulturë, letërsi dhe tradita shqiptare"],
    ["Shëndetësi", "shendetesi", "Shëndetësia, mjekësia dhe mirëqenia"],
    ["Opinion", "opinion", "Editoriale, analiza dhe opinione nga ekspertët"],
  ];

  const insertCat = db.prepare("INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)");
  for (const [name, slug, desc] of categories) {
    insertCat.run(name, slug, desc);
  }

  console.log("[DB] Seed data inserted (users + categories only)");
}

export default db;

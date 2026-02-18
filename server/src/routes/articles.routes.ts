import { Router, Request, Response } from "express";
import { z } from "zod";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ëË]/g, "e").replace(/[çÇ]/g, "c").replace(/[ëË]/g, "e")
    .replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function ensureUniqueSlug(slug: string, excludeId?: number): string {
  let candidate = slug;
  let counter = 1;
  while (true) {
    const existing = db.prepare(
      excludeId
        ? "SELECT id FROM articles WHERE slug = ? AND id != ?"
        : "SELECT id FROM articles WHERE slug = ?"
    ).get(...(excludeId ? [candidate, excludeId] : [candidate]));
    if (!existing) return candidate;
    candidate = `${slug}-${counter++}`;
  }
}

interface ArticleRow {
  id: number; title: string; slug: string; excerpt: string; content: string;
  featured_image: string; category_id: number; author_id: number;
  status: string; published_at: string; scheduled_at: string;
  meta_title: string; meta_description: string; og_image: string;
  views: number; featured: number; urgent: number; breaking: number;
  read_time: string; created_at: string; updated_at: string;
  category_name?: string; category_slug?: string;
  author_name?: string; author_email?: string;
}

// Public: List published articles with pagination
router.get("/", (req: Request, res: Response): void => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12));
  const offset = (page - 1) * limit;
  const category = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;
  const featured = req.query.featured as string | undefined;

  let where = "WHERE a.status = 'published'";
  const params: unknown[] = [];

  if (category) {
    where += " AND c.slug = ?";
    params.push(category);
  }
  if (search) {
    where += " AND (a.title LIKE ? OR a.excerpt LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  if (featured === "true") {
    where += " AND a.featured = 1";
  }

  const countRow = db.prepare(`
    SELECT COUNT(*) as total FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    ${where}
  `).get(...params) as { total: number };

  const articles = db.prepare(`
    SELECT a.*, c.name as category_name, c.slug as category_slug,
           u.name as author_name
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.author_id = u.id
    ${where}
    ORDER BY a.published_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as ArticleRow[];

  const articlesWithTags = articles.map((a) => {
    const tags = db.prepare(`
      SELECT t.name, t.slug FROM tags t
      JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = ?
    `).all(a.id) as { name: string; slug: string }[];
    return { ...a, tags };
  });

  res.json({
    success: true,
    data: articlesWithTags,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(countRow.total / limit),
      totalItems: countRow.total,
      itemsPerPage: limit,
    },
  });
});

// Public: Get single article by slug
router.get("/slug/:slug", (req: Request, res: Response): void => {
  const article = db.prepare(`
    SELECT a.*, c.name as category_name, c.slug as category_slug,
           u.name as author_name
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.author_id = u.id
    WHERE a.slug = ? AND a.status = 'published'
  `).get(req.params.slug) as ArticleRow | undefined;

  if (!article) {
    res.status(404).json({ success: false, error: "Artikulli nuk u gjet" });
    return;
  }

  db.prepare("UPDATE articles SET views = views + 1 WHERE id = ?").run(article.id);

  const tags = db.prepare(`
    SELECT t.name, t.slug FROM tags t
    JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?
  `).all(article.id) as { name: string; slug: string }[];

  res.json({ success: true, data: { ...article, views: article.views + 1, tags } });
});

// Admin: List all articles (including drafts)
router.get("/admin", authenticate, (req: Request, res: Response): void => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
  const offset = (page - 1) * limit;
  const status = req.query.status as string | undefined;

  let where = "WHERE 1=1";
  const params: unknown[] = [];
  if (status) { where += " AND a.status = ?"; params.push(status); }

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM articles a ${where}`).get(...params) as { total: number };

  const articles = db.prepare(`
    SELECT a.*, c.name as category_name, c.slug as category_slug, u.name as author_name
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.author_id = u.id
    ${where}
    ORDER BY a.updated_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as ArticleRow[];

  const articlesWithTags = articles.map((a) => {
    const tags = db.prepare(`SELECT t.name, t.slug FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?`)
      .all(a.id) as { name: string; slug: string }[];
    return { ...a, tags };
  });

  res.json({
    success: true,
    data: articlesWithTags,
    meta: { currentPage: page, totalPages: Math.ceil(countRow.total / limit), totalItems: countRow.total, itemsPerPage: limit },
  });
});

// Admin: Get single article by ID (for editing)
router.get("/admin/:id", authenticate, (req: Request, res: Response): void => {
  const article = db.prepare(`
    SELECT a.*, c.name as category_name, c.slug as category_slug, u.name as author_name
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.author_id = u.id
    WHERE a.id = ?
  `).get(req.params.id) as ArticleRow | undefined;

  if (!article) { res.status(404).json({ success: false, error: "Artikulli nuk u gjet" }); return; }

  const tags = db.prepare(`SELECT t.name, t.slug FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?`)
    .all(article.id) as { name: string; slug: string }[];

  res.json({ success: true, data: { ...article, tags } });
});

const articleSchema = z.object({
  title: z.string().min(1, "Titulli kërkohet"),
  excerpt: z.string().optional().default(""),
  content: z.string().optional().default(""),
  featured_image: z.string().optional().default(""),
  category_id: z.number().int().positive().optional(),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  scheduled_at: z.string().optional(),
  meta_title: z.string().optional().default(""),
  meta_description: z.string().optional().default(""),
  og_image: z.string().optional().default(""),
  featured: z.boolean().default(false),
  urgent: z.boolean().default(false),
  breaking: z.boolean().default(false),
  read_time: z.string().optional().default("3 min lexim"),
  tags: z.array(z.string()).optional().default([]),
});

// Admin: Create article
router.post("/", authenticate, (req: Request, res: Response): void => {
  const parsed = articleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Të dhëna të pavlefshme", details: parsed.error.flatten() });
    return;
  }

  const data = parsed.data;
  const slug = ensureUniqueSlug(slugify(data.title));
  const publishedAt = data.status === "published" ? new Date().toISOString() : null;

  const result = db.prepare(`
    INSERT INTO articles (title, slug, excerpt, content, featured_image, category_id, author_id,
      status, published_at, scheduled_at, meta_title, meta_description, og_image,
      featured, urgent, breaking, read_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.title, slug, data.excerpt, data.content, data.featured_image,
    data.category_id || null, req.user!.id,
    data.status, publishedAt, data.scheduled_at || null,
    data.meta_title, data.meta_description, data.og_image,
    data.featured ? 1 : 0, data.urgent ? 1 : 0, data.breaking ? 1 : 0, data.read_time
  );

  const articleId = result.lastInsertRowid as number;

  if (data.tags.length > 0) {
    const insertTag = db.prepare("INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)");
    const getTagId = db.prepare("SELECT id FROM tags WHERE slug = ?");
    const linkTag = db.prepare("INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)");

    for (const tag of data.tags) {
      const tagSlug = slugify(tag);
      insertTag.run(tag, tagSlug);
      const tagRow = getTagId.get(tagSlug) as { id: number } | undefined;
      if (tagRow) linkTag.run(articleId, tagRow.id);
    }
  }

  res.status(201).json({ success: true, data: { id: articleId, slug } });
});

// Admin: Update article
router.put("/:id", authenticate, (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const existing = db.prepare("SELECT id FROM articles WHERE id = ?").get(id);
  if (!existing) { res.status(404).json({ success: false, error: "Artikulli nuk u gjet" }); return; }

  const parsed = articleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Të dhëna të pavlefshme", details: parsed.error.flatten() });
    return;
  }

  const data = parsed.data;
  const slug = ensureUniqueSlug(slugify(data.title), id);

  const oldStatus = (db.prepare("SELECT status FROM articles WHERE id = ?").get(id) as { status: string }).status;
  let publishedAt: string | null = null;
  if (data.status === "published" && oldStatus !== "published") {
    publishedAt = new Date().toISOString();
  } else if (data.status === "published") {
    publishedAt = (db.prepare("SELECT published_at FROM articles WHERE id = ?").get(id) as { published_at: string }).published_at;
  }

  db.prepare(`
    UPDATE articles SET title=?, slug=?, excerpt=?, content=?, featured_image=?,
      category_id=?, status=?, published_at=?, scheduled_at=?,
      meta_title=?, meta_description=?, og_image=?,
      featured=?, urgent=?, breaking=?, read_time=?, updated_at=datetime('now')
    WHERE id = ?
  `).run(
    data.title, slug, data.excerpt, data.content, data.featured_image,
    data.category_id || null, data.status, publishedAt, data.scheduled_at || null,
    data.meta_title, data.meta_description, data.og_image,
    data.featured ? 1 : 0, data.urgent ? 1 : 0, data.breaking ? 1 : 0, data.read_time, id
  );

  // Sync tags
  db.prepare("DELETE FROM article_tags WHERE article_id = ?").run(id);
  if (data.tags.length > 0) {
    const insertTag = db.prepare("INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)");
    const getTagId = db.prepare("SELECT id FROM tags WHERE slug = ?");
    const linkTag = db.prepare("INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)");
    for (const tag of data.tags) {
      const tagSlug = slugify(tag);
      insertTag.run(tag, tagSlug);
      const tagRow = getTagId.get(tagSlug) as { id: number } | undefined;
      if (tagRow) linkTag.run(id, tagRow.id);
    }
  }

  res.json({ success: true, data: { id, slug } });
});

// Admin: Delete article
router.delete("/:id", authenticate, (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const result = db.prepare("DELETE FROM articles WHERE id = ?").run(id);
  if (result.changes === 0) { res.status(404).json({ success: false, error: "Artikulli nuk u gjet" }); return; }
  res.json({ success: true });
});

// Admin: Update article status
router.patch("/:id/status", authenticate, (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  if (!["draft", "published", "scheduled"].includes(status)) {
    res.status(400).json({ success: false, error: "Statusi i pavlefshëm" });
    return;
  }

  const publishedAt = status === "published" ? new Date().toISOString() : null;
  db.prepare("UPDATE articles SET status = ?, published_at = COALESCE(?, published_at), updated_at = datetime('now') WHERE id = ?")
    .run(status, publishedAt, id);

  res.json({ success: true });
});

export default router;

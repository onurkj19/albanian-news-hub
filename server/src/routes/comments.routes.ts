import { Router, Request, Response } from "express";
import { z } from "zod";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

interface CommentRow {
  id: number; article_id: number; author_name: string; author_email: string;
  content: string; status: string; likes: number; created_at: string;
  article_title?: string;
}

// Public: Get approved comments for an article
router.get("/article/:articleId", (req: Request, res: Response): void => {
  const articleId = parseInt(req.params.articleId);
  const comments = db.prepare(
    "SELECT * FROM comments WHERE article_id = ? AND status = 'approved' ORDER BY created_at DESC"
  ).all(articleId) as CommentRow[];

  res.json({ success: true, data: comments });
});

const commentSchema = z.object({
  article_id: z.number().int().positive(),
  author_name: z.string().min(2, "Emri duhet të ketë të paktën 2 karaktere"),
  author_email: z.string().email().optional().default(""),
  content: z.string().min(3, "Komenti duhet të ketë të paktën 3 karaktere").max(2000),
});

// Public: Post a comment (goes to pending)
router.post("/", (req: Request, res: Response): void => {
  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Të dhëna të pavlefshme", details: parsed.error.flatten() });
    return;
  }

  const { article_id, author_name, author_email, content } = parsed.data;

  const article = db.prepare("SELECT id FROM articles WHERE id = ? AND status = 'published'").get(article_id);
  if (!article) {
    res.status(404).json({ success: false, error: "Artikulli nuk u gjet" });
    return;
  }

  const result = db.prepare(
    "INSERT INTO comments (article_id, author_name, author_email, content) VALUES (?, ?, ?, ?)"
  ).run(article_id, author_name, author_email, content);

  res.status(201).json({ success: true, data: { id: result.lastInsertRowid } });
});

// Admin: List all comments with filtering
router.get("/admin", authenticate, (req: Request, res: Response): void => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
  const offset = (page - 1) * limit;
  const status = req.query.status as string | undefined;

  let where = "WHERE 1=1";
  const params: unknown[] = [];
  if (status) { where += " AND c.status = ?"; params.push(status); }

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM comments c ${where}`).get(...params) as { total: number };

  const comments = db.prepare(`
    SELECT c.*, a.title as article_title
    FROM comments c
    LEFT JOIN articles a ON c.article_id = a.id
    ${where}
    ORDER BY c.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as CommentRow[];

  res.json({
    success: true,
    data: comments,
    meta: { currentPage: page, totalPages: Math.ceil(countRow.total / limit), totalItems: countRow.total, itemsPerPage: limit },
  });
});

// Admin: Update comment status
router.patch("/:id/status", authenticate, (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    res.status(400).json({ success: false, error: "Statusi i pavlefshëm" });
    return;
  }

  const result = db.prepare("UPDATE comments SET status = ? WHERE id = ?").run(status, id);
  if (result.changes === 0) {
    res.status(404).json({ success: false, error: "Komenti nuk u gjet" });
    return;
  }

  res.json({ success: true });
});

// Admin: Delete comment
router.delete("/:id", authenticate, (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const result = db.prepare("DELETE FROM comments WHERE id = ?").run(id);
  if (result.changes === 0) {
    res.status(404).json({ success: false, error: "Komenti nuk u gjet" });
    return;
  }
  res.json({ success: true });
});

// Public: Like a comment
router.post("/:id/like", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  db.prepare("UPDATE comments SET likes = likes + 1 WHERE id = ? AND status = 'approved'").run(id);
  res.json({ success: true });
});

export default router;

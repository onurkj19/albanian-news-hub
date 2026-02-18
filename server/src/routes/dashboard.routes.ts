import { Router, Request, Response } from "express";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/stats", authenticate, (_req: Request, res: Response): void => {
  const totalArticles = (db.prepare("SELECT COUNT(*) as c FROM articles").get() as { c: number }).c;
  const published = (db.prepare("SELECT COUNT(*) as c FROM articles WHERE status = 'published'").get() as { c: number }).c;
  const drafts = (db.prepare("SELECT COUNT(*) as c FROM articles WHERE status = 'draft'").get() as { c: number }).c;
  const scheduled = (db.prepare("SELECT COUNT(*) as c FROM articles WHERE status = 'scheduled'").get() as { c: number }).c;
  const totalViews = (db.prepare("SELECT COALESCE(SUM(views), 0) as v FROM articles").get() as { v: number }).v;
  const totalComments = (db.prepare("SELECT COUNT(*) as c FROM comments").get() as { c: number }).c;
  const pendingComments = (db.prepare("SELECT COUNT(*) as c FROM comments WHERE status = 'pending'").get() as { c: number }).c;
  const totalMedia = (db.prepare("SELECT COUNT(*) as c FROM media").get() as { c: number }).c;

  const categoryCounts = db.prepare(`
    SELECT c.name, c.slug, COUNT(a.id) as count
    FROM categories c
    LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
    GROUP BY c.id ORDER BY count DESC
  `).all();

  const recentArticles = db.prepare(`
    SELECT a.id, a.title, a.slug, a.status, a.views, a.created_at, a.updated_at,
           c.name as category_name, u.name as author_name
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.author_id = u.id
    ORDER BY a.updated_at DESC LIMIT 5
  `).all();

  const topArticles = db.prepare(`
    SELECT a.id, a.title, a.slug, a.views, c.name as category_name
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.status = 'published'
    ORDER BY a.views DESC LIMIT 5
  `).all();

  res.json({
    success: true,
    data: {
      stats: {
        totalArticles, published, drafts, scheduled,
        totalViews, totalComments, pendingComments, totalMedia,
      },
      categoryCounts,
      recentArticles,
      topArticles,
    },
  });
});

router.get("/categories", (_req: Request, res: Response): void => {
  const categories = db.prepare("SELECT * FROM categories ORDER BY name").all();
  res.json({ success: true, data: categories });
});

export default router;

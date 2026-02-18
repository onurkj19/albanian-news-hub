import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { CONFIG } from "./config.js";
import { initializeDatabase, seedDatabase } from "./db.js";
import db from "./db.js";

import authRoutes from "./routes/auth.routes.js";
import articlesRoutes from "./routes/articles.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: CONFIG.corsOrigin, credentials: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: "Shumë kërkesa. Provoni përsëri më vonë." },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: "Shumë tentativa kyçjeje. Provoni përsëri pas 15 minutash." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving for uploads
app.use("/uploads", express.static(CONFIG.uploadDir, {
  maxAge: "30d",
  immutable: true,
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, timestamp: new Date().toISOString() });
});

// Serve frontend in production
if (CONFIG.isProduction) {
  const frontendPath = path.resolve(__dirname, "..", "..", "dist");
  app.use(express.static(frontendPath, { maxAge: "7d" }));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Server Error]", err.message);
  res.status(500).json({
    success: false,
    error: CONFIG.isProduction ? "Gabim i brendshëm i serverit" : err.message,
  });
});

// Scheduled article publisher - checks every 60 seconds
function publishScheduledArticles(): void {
  const now = new Date().toISOString();
  const result = db.prepare(
    "UPDATE articles SET status = 'published', published_at = ? WHERE status = 'scheduled' AND scheduled_at <= ?"
  ).run(now, now);
  if (result.changes > 0) {
    console.log(`[Scheduler] Published ${result.changes} scheduled article(s)`);
  }
}

// Initialize DB and start
initializeDatabase();
seedDatabase();

app.listen(CONFIG.port, () => {
  console.log(`\n[ALNN API] Server running on http://localhost:${CONFIG.port}`);
  console.log(`[ALNN API] Environment: ${CONFIG.isProduction ? "production" : "development"}`);
  console.log(`[ALNN API] CORS origin: ${CONFIG.corsOrigin}\n`);

  // Run scheduler every 60 seconds
  setInterval(publishScheduledArticles, 60_000);
});

export default app;

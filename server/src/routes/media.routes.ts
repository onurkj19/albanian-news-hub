import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { CONFIG } from "../config.js";

const router = Router();

// Admin: Upload single image
router.post("/upload", authenticate, upload.single("file"), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ success: false, error: "Asnjë skedar nuk u ngarkua" });
    return;
  }

  try {
    const file = req.file;
    let finalPath = file.path;
    let width: number | undefined;
    let height: number | undefined;

    // Compress images (skip SVG/GIF)
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      const webpPath = file.path.replace(/\.\w+$/, ".webp");

      const metadata = await sharp(file.path).metadata();
      width = metadata.width;
      height = metadata.height;

      const maxWidth = 1600;
      const sharpInstance = sharp(file.path);
      if (width && width > maxWidth) {
        sharpInstance.resize(maxWidth, undefined, { withoutEnlargement: true });
        width = maxWidth;
        height = height ? Math.round(height * (maxWidth / (metadata.width || maxWidth))) : undefined;
      }

      await sharpInstance.webp({ quality: 82 }).toFile(webpPath);

      // Remove original, use webp
      fs.unlinkSync(file.path);
      finalPath = webpPath;
    }

    // Store relative path for serving
    const relativePath = path.relative(CONFIG.uploadDir, finalPath).replace(/\\/g, "/");
    const url = `/uploads/${relativePath}`;

    const result = db.prepare(`
      INSERT INTO media (filename, original_name, mime_type, size, width, height, path, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      path.basename(finalPath), file.originalname, "image/webp",
      fs.statSync(finalPath).size, width || null, height || null,
      url, req.user!.id
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        url,
        filename: path.basename(finalPath),
        originalName: file.originalname,
        width, height,
      },
    });
  } catch (err) {
    console.error("Upload processing error:", err);
    res.status(500).json({ success: false, error: "Gabim gjatë përpunimit të imazhit" });
  }
});

// Admin: Upload multiple images
router.post("/upload-multiple", authenticate, upload.array("files", 10), async (req: Request, res: Response): Promise<void> => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    res.status(400).json({ success: false, error: "Asnjë skedar nuk u ngarkua" });
    return;
  }

  const results = [];
  for (const file of files) {
    try {
      const ext = path.extname(file.originalname).toLowerCase();
      let finalPath = file.path;

      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        const webpPath = file.path.replace(/\.\w+$/, ".webp");
        await sharp(file.path)
          .resize(1600, undefined, { withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(webpPath);
        fs.unlinkSync(file.path);
        finalPath = webpPath;
      }

      const relativePath = path.relative(CONFIG.uploadDir, finalPath).replace(/\\/g, "/");
      const url = `/uploads/${relativePath}`;

      const result = db.prepare(`
        INSERT INTO media (filename, original_name, mime_type, size, path, uploaded_by)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(path.basename(finalPath), file.originalname, "image/webp", fs.statSync(finalPath).size, url, req.user!.id);

      results.push({ id: result.lastInsertRowid, url, filename: path.basename(finalPath) });
    } catch (err) {
      console.error("Upload error for file:", file.originalname, err);
    }
  }

  res.status(201).json({ success: true, data: results });
});

// Admin: List media
router.get("/", authenticate, (req: Request, res: Response): void => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = 24;
  const offset = (page - 1) * limit;

  const countRow = db.prepare("SELECT COUNT(*) as total FROM media").get() as { total: number };
  const media = db.prepare("SELECT * FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?").all(limit, offset);

  res.json({
    success: true,
    data: media,
    meta: { currentPage: page, totalPages: Math.ceil(countRow.total / limit), totalItems: countRow.total },
  });
});

// Admin: Delete media
router.delete("/:id", authenticate, (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const media = db.prepare("SELECT path FROM media WHERE id = ?").get(id) as { path: string } | undefined;

  if (!media) {
    res.status(404).json({ success: false, error: "Media nuk u gjet" });
    return;
  }

  const fullPath = path.join(CONFIG.uploadDir, media.path.replace("/uploads/", ""));
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

  db.prepare("DELETE FROM media WHERE id = ?").run(id);
  res.json({ success: true });
});

export default router;

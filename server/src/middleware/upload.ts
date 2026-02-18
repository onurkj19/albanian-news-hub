import multer from "multer";
import path from "path";
import fs from "fs";
import { CONFIG } from "../config.js";

function ensureUploadDir(): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const dir = path.join(CONFIG.uploadDir, year, month);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, ensureUploadDir());
  },
  filename(_req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

function fileFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void {
  const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Formati i skedarit nuk lejohet. Përdorni: JPG, PNG, GIF, WebP, SVG"));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: CONFIG.maxFileSize },
});

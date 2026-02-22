import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseCorsOrigins(raw: string | undefined): string | string[] {
  if (!raw) return "http://localhost:3000";
  const origins = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return origins.length === 1 ? origins[0] : origins;
}

export const CONFIG = {
  port: parseInt(process.env.PORT || "4000", 10),
  jwtSecret: process.env.JWT_SECRET || "fallback-dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: parseCorsOrigins(process.env.CORS_ORIGIN),
  uploadDir: path.resolve(__dirname, "..", process.env.UPLOAD_DIR || "uploads"),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
  dbPath: path.resolve(__dirname, "..", "data", "alnn.db"),
  isProduction: process.env.NODE_ENV === "production",
};

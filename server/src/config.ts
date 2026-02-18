import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const CONFIG = {
  port: parseInt(process.env.PORT || "4000", 10),
  jwtSecret: process.env.JWT_SECRET || "fallback-dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  uploadDir: path.resolve(__dirname, "..", process.env.UPLOAD_DIR || "uploads"),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
  dbPath: path.resolve(__dirname, "..", "data", "alnn.db"),
  isProduction: process.env.NODE_ENV === "production",
} as const;

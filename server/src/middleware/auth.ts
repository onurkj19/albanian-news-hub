import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config.js";
import db from "../db.js";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: "admin" | "editor";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Token mungon" });
    return;
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, CONFIG.jwtSecret) as { userId: number };

    const user = db.prepare(
      "SELECT id, email, name, role FROM users WHERE id = ?"
    ).get(payload.userId) as AuthUser | undefined;

    if (!user) {
      res.status(401).json({ success: false, error: "Përdoruesi nuk u gjet" });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Token i pavlefshëm" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ success: false, error: "Vetëm administratorët kanë akses" });
    return;
  }
  next();
}

import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import db from "../db.js";
import { CONFIG } from "../config.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email("Email i pavlefshëm"),
  password: z.string().min(1, "Fjalëkalimi kërkohet"),
});

const registerSchema = z.object({
  email: z.string().email("Email i pavlefshëm"),
  password: z.string().min(6, "Fjalëkalimi duhet të ketë të paktën 6 karaktere"),
  name: z.string().min(2, "Emri duhet të ketë të paktën 2 karaktere"),
  role: z.enum(["admin", "editor"]).default("editor"),
});

router.post("/login", (req: Request, res: Response): void => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Të dhëna të pavlefshme", details: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as {
    id: number; email: string; password_hash: string; name: string; role: string;
  } | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ success: false, error: "Email-i ose fjalëkalimi janë gabim" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, CONFIG.jwtSecret, {
    expiresIn: CONFIG.jwtExpiresIn,
  });

  res.json({
    success: true,
    data: {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    },
  });
});

router.post("/register", authenticate, requireAdmin, (req: Request, res: Response): void => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Të dhëna të pavlefshme", details: parsed.error.flatten() });
    return;
  }

  const { email, password, name, role } = parsed.data;
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    res.status(409).json({ success: false, error: "Ky email ekziston tashmë" });
    return;
  }

  const hash = bcrypt.hashSync(password, 12);
  const result = db.prepare("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)")
    .run(email, hash, name, role);

  res.status(201).json({
    success: true,
    data: { id: result.lastInsertRowid, email, name, role },
  });
});

router.get("/profile", authenticate, (req: Request, res: Response): void => {
  res.json({ success: true, data: req.user });
});

export default router;

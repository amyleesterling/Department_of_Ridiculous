import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------------------------------------------------------------ */
/*  Database – Turso (libSQL) for production, better-sqlite3 for local */
/* ------------------------------------------------------------------ */

const TURSO_URL = (process.env.TURSO_DATABASE_URL || "").trim();
const TURSO_TOKEN = (process.env.TURSO_AUTH_TOKEN || "").trim();

let db;

if (TURSO_URL) {
  // Production: use @libsql/client pointing at a Turso hosted database.
  const { createClient } = await import("@libsql/client");
  const client = createClient({
    url: TURSO_URL,
    authToken: TURSO_TOKEN || undefined,
  });

  await client.execute(`
    create table if not exists emergencies (
      id text primary key,
      title text not null,
      details text not null,
      created_at text not null,
      source_ip_hash text
    )
  `);

  db = {
    mode: "turso",
    async list(limit) {
      const result = await client.execute({
        sql: "select id, title, details, created_at as createdAt from emergencies order by datetime(created_at) desc limit ?",
        args: [limit],
      });
      return result.rows;
    },
    async insert(row) {
      await client.execute({
        sql: "insert into emergencies (id, title, details, created_at, source_ip_hash) values (?, ?, ?, ?, ?)",
        args: [row.id, row.title, row.details, row.created_at, row.source_ip_hash],
      });
    },
  };
} else {
  // Local development: use better-sqlite3 with a file on disk.
  const Database = (await import("better-sqlite3")).default;
  const dataDir = path.join(__dirname, "data");
  const dbPath = path.join(dataDir, "ridiculous-emergencies.db");

  fs.mkdirSync(dataDir, { recursive: true });

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.exec(`
    create table if not exists emergencies (
      id text primary key,
      title text not null,
      details text not null,
      created_at text not null,
      source_ip_hash text
    )
  `);

  const insertStmt = sqlite.prepare(
    "insert into emergencies (id, title, details, created_at, source_ip_hash) values (@id, @title, @details, @created_at, @source_ip_hash)"
  );
  const listStmt = sqlite.prepare(
    "select id, title, details, created_at as createdAt from emergencies order by datetime(created_at) desc limit ?"
  );

  db = {
    mode: "sqlite",
    async list(limit) {
      return listStmt.all(limit);
    },
    async insert(row) {
      insertStmt.run(row);
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Express app                                                        */
/* ------------------------------------------------------------------ */

const app = express();
const PORT = Number(process.env.PORT || 8787);
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";
const MAX_POSTS_PER_WINDOW = Number(process.env.RATE_LIMIT_MAX || 20);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const rateWindow = new Map();

function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}

function normalizeWhitespace(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function hashIp(ip) {
  return crypto.createHash("sha256").update(ip || "unknown").digest("hex");
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function allowCors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  return next();
}

function rateLimit(req, res, next) {
  const key = hashIp(getClientIp(req));
  const now = Date.now();
  const current = rateWindow.get(key);

  if (!current || now > current.resetAt) {
    rateWindow.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return next();
  }

  if (current.count >= MAX_POSTS_PER_WINDOW) {
    return jsonError(res, 429, "Too many emergencies filed from this source. Please try again later.");
  }

  current.count += 1;
  rateWindow.set(key, current);
  return next();
}

app.disable("x-powered-by");
app.use(express.json({ limit: "24kb" }));
app.use(allowCors);

app.get("/health", (_req, res) => {
  res.json({ ok: true, db: db.mode });
});

app.get("/api/emergencies", async (req, res) => {
  const requestedLimit = Number.parseInt(String(req.query.limit || "50"), 10);
  const safeLimit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 200)
    : 50;

  try {
    const emergencies = await db.list(safeLimit);
    res.json({ emergencies });
  } catch (err) {
    console.error("Failed to list emergencies:", err);
    jsonError(res, 500, "Failed to load emergencies.");
  }
});

app.post("/api/emergencies", rateLimit, async (req, res) => {
  const title = normalizeWhitespace(req.body?.title);
  const details = normalizeWhitespace(req.body?.details);

  if (!title || title.length < 3) {
    return jsonError(res, 400, "Emergency title must be at least 3 characters.");
  }

  if (title.length > 120) {
    return jsonError(res, 400, "Emergency title must be 120 characters or fewer.");
  }

  if (!details || details.length < 8) {
    return jsonError(res, 400, "Emergency bulletin must be at least 8 characters.");
  }

  if (details.length > 420) {
    return jsonError(res, 400, "Emergency bulletin must be 420 characters or fewer.");
  }

  const emergency = {
    id: crypto.randomUUID(),
    title,
    details,
    created_at: new Date().toISOString(),
    source_ip_hash: hashIp(getClientIp(req)),
  };

  try {
    await db.insert(emergency);
  } catch (err) {
    console.error("Failed to insert emergency:", err);
    return jsonError(res, 500, "Failed to file emergency.");
  }

  return res.status(201).json({
    emergency: {
      id: emergency.id,
      title: emergency.title,
      details: emergency.details,
      createdAt: emergency.created_at,
    },
  });
});

app.use((_req, res) => {
  jsonError(res, 404, "This endpoint does not exist.");
});

app.listen(PORT, () => {
  console.log(`Department of Ridiculous API listening on http://localhost:${PORT} [db: ${db.mode}]`);
});

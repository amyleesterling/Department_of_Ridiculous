import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------------------------------------------------------------ */
/*  Database – PostgreSQL for production, SQLite for local dev          */
/* ------------------------------------------------------------------ */

const DATABASE_URL = (process.env.DATABASE_URL || "").trim();

let db;

if (DATABASE_URL) {
  // Production: use PostgreSQL via the standard pg driver.
  // Works with Supabase, Neon, Railway, Render, AWS RDS, etc.
  const pg = (await import("pg")).default;
  const pool = new pg.Pool({ connectionString: DATABASE_URL });

  await pool.query(`
    create table if not exists emergencies (
      id text primary key,
      title text not null,
      details text not null,
      created_at timestamptz not null,
      source_ip_hash text
    )
  `);

  db = {
    mode: "postgres",
    async list(limit) {
      const result = await pool.query(
        "select id, title, details, created_at as \"createdAt\" from emergencies order by created_at desc limit $1",
        [limit]
      );
      return result.rows;
    },
    async insert(row) {
      await pool.query(
        "insert into emergencies (id, title, details, created_at, source_ip_hash) values ($1, $2, $3, $4, $5)",
        [row.id, row.title, row.details, row.created_at, row.source_ip_hash]
      );
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
`);
db.exec(`
  create table if not exists emergency_bangs (
    emergency_id text not null,
    source_ip_hash text not null,
    created_at text not null,
    unique (emergency_id, source_ip_hash)
  );
`);

const emergencyColumns = db.prepare(`pragma table_info(emergencies)`).all();
if (!emergencyColumns.some((column) => column.name === "bangs")) {
  db.exec(`alter table emergencies add column bangs integer not null default 0;`);
}
if (!emergencyColumns.some((column) => column.name === "seeded")) {
  db.exec(`alter table emergencies add column seeded integer not null default 0;`);
}

const insertEmergency = db.prepare(`
  insert into emergencies (id, title, details, created_at, source_ip_hash, bangs, seeded)
  values (@id, @title, @details, @created_at, @source_ip_hash, @bangs, @seeded)
`);

const insertSeedEmergency = db.prepare(`
  insert or ignore into emergencies (id, title, details, created_at, source_ip_hash, bangs, seeded)
  values (@id, @title, @details, @created_at, @source_ip_hash, @bangs, @seeded)
`);

const listEmergencies = db.prepare(`
  select id, title, details, created_at as createdAt, bangs, seeded
  from emergencies
  order by bangs desc, datetime(created_at) desc
  limit ?
`);

const getEmergencyById = db.prepare(`
  select id, title, details, created_at as createdAt, bangs, seeded
  from emergencies
  where id = ?
`);

const insertBang = db.prepare(`
  insert or ignore into emergency_bangs (emergency_id, source_ip_hash, created_at)
  values (@emergency_id, @source_ip_hash, @created_at)
`);

const incrementBangCount = db.prepare(`
  update emergencies
  set bangs = bangs + 1
  where id = ?
`);

const seedEmergencies = [
  {
    id: "seed-sideways-shipping",
    title: "Strategic Sideways Shipping Event",
    details: "A single majestic vessel has once again discovered that global trade was overdependent on one narrow watery shortcut and several extremely worried spreadsheets.",
    created_at: "2026-03-20T13:00:00.000Z",
    source_ip_hash: "seeded",
    bangs: 42,
    seeded: 1,
  },
  {
    id: "seed-mysterious-balloon",
    title: "Unlicensed Sky Orb Diplomacy Incident",
    details: "Citizens are asked not to project either romance or espionage onto the suspiciously high balloon until the committee on dramatic silhouettes files its report.",
    created_at: "2026-03-21T18:20:00.000Z",
    source_ip_hash: "seeded",
    bangs: 31,
    seeded: 1,
  },
  {
    id: "seed-bank-run-opera",
    title: "Regional Bank Run at the Champagne Buffet",
    details: "A formerly confident financial institution has entered its chandelier era. Please collect your deposits in an orderly and emotionally literate fashion.",
    created_at: "2026-03-22T16:45:00.000Z",
    source_ip_hash: "seeded",
    bangs: 27,
    seeded: 1,
  },
  {
    id: "seed-palace-memoir",
    title: "Royal Memoir Weather System",
    details: "An entire news cycle has been consumed by one family dispute, six cashmere coats, and an aggressively quotable corridor confrontation.",
    created_at: "2026-03-23T11:15:00.000Z",
    source_ip_hash: "seeded",
    bangs: 18,
    seeded: 1,
  },
  {
    id: "seed-app-outage",
    title: "National Group Chat Infrastructure Meltdown",
    details: "Messaging platforms have faltered, forcing the public to experience thoughts in silence and, in several cases, speak directly to nearby humans.",
    created_at: "2026-03-24T08:05:00.000Z",
    source_ip_hash: "seeded",
    bangs: 25,
    seeded: 1,
  },
  {
    id: "seed-theatrical-fog",
    title: "Unsanctioned Fog Machine at Civic Function",
    details: "Visibility remains low, confidence remains high, and somebody important is absolutely about to enter from stage left with avoidable conviction.",
    created_at: "2026-03-24T21:30:00.000Z",
    source_ip_hash: "seeded",
    bangs: 15,
    seeded: 1,
  },
];

seedEmergencies.forEach((entry) => {
  insertSeedEmergency.run(entry);
});

const app = express();
const PORT = Number(process.env.PORT || 8787);
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";
const MAX_POSTS_PER_WINDOW = Number(process.env.RATE_LIMIT_MAX || 20);
const MAX_BANGS_PER_WINDOW = Number(process.env.BANG_RATE_LIMIT_MAX || 80);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const postRateWindow = new Map();
const bangRateWindow = new Map();

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

function rateLimit(windowStore, maxPerWindow, message) {
  return (req, res, next) => {
    const key = hashIp(getClientIp(req));
    const now = Date.now();
    const current = windowStore.get(key);

    if (!current || now > current.resetAt) {
      windowStore.set(key, {
        count: 1,
        resetAt: now + RATE_LIMIT_WINDOW_MS,
      });
      return next();
    }

    if (current.count >= maxPerWindow) {
      return jsonError(res, 429, message);
    }

    current.count += 1;
    windowStore.set(key, current);
    return next();
  };
}

const postRateLimit = rateLimit(
  postRateWindow,
  MAX_POSTS_PER_WINDOW,
  "Too many emergencies filed from this source. Please try again later.",
);
const bangRateLimit = rateLimit(
  bangRateWindow,
  MAX_BANGS_PER_WINDOW,
  "Too many public ! votes from this source. Please try again later.",
);

function serializeEmergency(id) {
  return getEmergencyById.get(id) || null;
}

function recordBang(emergencyId, sourceIpHash) {
  const now = new Date().toISOString();
  const inserted = insertBang.run({
    emergency_id: emergencyId,
    source_ip_hash: sourceIpHash,
    created_at: now,
  });

  if (inserted.changes === 0) {
    return false;
  }

  incrementBangCount.run(emergencyId);
  return true;
}

function normalizeEmergencyPayload(body) {
  return {
    title: normalizeWhitespace(body?.title),
    details: normalizeWhitespace(body?.details),
  };
}

function validateEmergencyPayload({ title, details }) {
  if (!title || title.length < 3) {
    return "Emergency title must be at least 3 characters.";
  }

  if (title.length > 120) {
    return "Emergency title must be 120 characters or fewer.";
  }

  if (!details || details.length < 8) {
    return "Emergency bulletin must be at least 8 characters.";
  }

  if (details.length > 420) {
    return "Emergency bulletin must be 420 characters or fewer.";
  }

  return null;
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

app.post("/api/emergencies", postRateLimit, (req, res) => {
  const { title, details } = normalizeEmergencyPayload(req.body);
  const validationError = validateEmergencyPayload({ title, details });

  if (validationError) {
    return jsonError(res, 400, validationError);
  }

  const emergency = {
    id: crypto.randomUUID(),
    title,
    details,
    created_at: new Date().toISOString(),
    source_ip_hash: hashIp(getClientIp(req)),
    bangs: 0,
    seeded: 0,
  };

  try {
    await db.insert(emergency);
  } catch (err) {
    console.error("Failed to insert emergency:", err);
    return jsonError(res, 500, "Failed to file emergency.");
  }

  return res.status(201).json({
    emergency: serializeEmergency(emergency.id),
  });
});

app.post("/api/emergencies/:id/bang", bangRateLimit, (req, res) => {
  const emergencyId = normalizeWhitespace(req.params.id);
  const emergency = serializeEmergency(emergencyId);

  if (!emergency) {
    return jsonError(res, 404, "Emergency not found.");
  }

  const sourceIpHash = hashIp(getClientIp(req));
  const inserted = recordBang(emergencyId, sourceIpHash);
  const updatedEmergency = serializeEmergency(emergencyId);

  if (!inserted) {
    return res.status(409).json({
      error: "This source has already applied its public ! to that emergency.",
      emergency: updatedEmergency,
    });
  }

  return res.status(201).json({
    emergency: updatedEmergency,
  });
});

app.use((_req, res) => {
  jsonError(res, 404, "This endpoint does not exist.");
});

app.listen(PORT, () => {
  console.log(`Department of Ridiculous API listening on http://localhost:${PORT} [db: ${db.mode}]`);
});

const CONFIG = {
  SHEET_ID: "1wkZgijNZ3CdVLwvSkp-wG_IWiUHyMZH3s3AdCX8_XnI",
  EMERGENCIES_SHEET: "Emergencies",
  BANGS_SHEET: "BangVotes",
  RATE_LIMIT_WINDOW_MS: 10 * 60 * 1000,
  MAX_POSTS_PER_WINDOW: 12,
  MAX_BANGS_PER_WINDOW: 40,
};

const SEED_EMERGENCIES = [
  {
    id: "seed-sideways-shipping",
    name: "Office of Retail Sentiment",
    title: "Strategic Sideways Shipping Event",
    details: "A single majestic vessel has once again discovered that global trade was overdependent on one narrow watery shortcut and several extremely worried spreadsheets.",
    createdAt: "2026-03-20T13:00:00.000Z",
    bangs: 42,
    seeded: true,
    sourceTokenHash: "seeded",
  },
  {
    id: "seed-mysterious-balloon",
    name: "Committee on Dramatic Silhouettes",
    title: "Unlicensed Sky Orb Diplomacy Incident",
    details: "Citizens are asked not to project either romance or espionage onto the suspiciously high balloon until the committee on dramatic silhouettes files its report.",
    createdAt: "2026-03-21T18:20:00.000Z",
    bangs: 31,
    seeded: true,
    sourceTokenHash: "seeded",
  },
  {
    id: "seed-bank-run-opera",
    name: "Bureau of Loud Carpets",
    title: "Regional Bank Run at the Champagne Buffet",
    details: "A formerly confident financial institution has entered its chandelier era. Please collect your deposits in an orderly and emotionally literate fashion.",
    createdAt: "2026-03-22T16:45:00.000Z",
    bangs: 27,
    seeded: true,
    sourceTokenHash: "seeded",
  },
];

function doGet(e) {
  return handleRequest_(e, "GET");
}

function doPost(e) {
  return handleRequest_(e, "POST");
}

function handleRequest_(e, method) {
  try {
    ensureSheets_();
    const route = getRoute_(e);

    if (method === "GET" && route === "health") {
      return json_({ ok: true, status: 200, healthy: true });
    }

    if (method === "GET" && route === "api/emergencies") {
      const limit = clamp_(1, Number((e && e.parameter && e.parameter.limit) || 50), 200);
      return respond_(e, { ok: true, status: 200, emergencies: listEmergencies_(limit) });
    }

    if (method === "POST" && route === "api/emergencies") {
      const body = normalizeEmergencyPayload_(parseJsonBody_(e));
      const validationError = validateEmergencyPayload_(body);
      if (validationError) {
        return respond_(e, { ok: false, status: 400, error: validationError });
      }

      const sourceTokenHash = hashToken_(body.sourceToken);
      enforceRateLimit_(getEmergencyRecords_(), sourceTokenHash, CONFIG.MAX_POSTS_PER_WINDOW, "Too many emergencies filed from this source. Please try again later.");

      return respond_(e, {
        ok: true,
        status: 201,
        emergency: createEmergency_(body.name, body.title, body.details, sourceTokenHash),
      });
    }

    const bangMatch = route.match(/^api\/emergencies\/([^/]+)\/bang$/);
    if (method === "POST" && bangMatch) {
      const body = parseJsonBody_(e);
      const sourceTokenHash = hashToken_(normalizeWhitespace_(body && body.sourceToken));
      if (!sourceTokenHash) {
        return respond_(e, { ok: false, status: 400, error: "Missing source token." });
      }

      enforceRateLimit_(getBangRecords_(), sourceTokenHash, CONFIG.MAX_BANGS_PER_WINDOW, "Too many public ! votes from this source. Please try again later.");
      const result = recordBang_(safeDecodeURIComponent_(bangMatch[1]), sourceTokenHash);
      if (!result.inserted) {
        return respond_(e, { ok: false, status: 409, error: "This source has already applied its public ! to that emergency.", emergency: result.emergency });
      }

      return respond_(e, { ok: true, status: 201, emergency: result.emergency });
    }

    return respond_(e, { ok: false, status: 404, error: "This endpoint does not exist." });
  } catch (error) {
    return respond_(e, { ok: false, status: Number(error && error.status) || 500, error: error && error.message ? error.message : "Unexpected server error." });
  }
}

function ensureSheets_() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let emergenciesSheet = spreadsheet.getSheetByName(CONFIG.EMERGENCIES_SHEET);
  if (!emergenciesSheet) {
    emergenciesSheet = spreadsheet.insertSheet(CONFIG.EMERGENCIES_SHEET);
  }
  ensureHeaderRow_(emergenciesSheet, ["id", "name", "title", "details", "createdAt", "bangs", "seeded", "sourceTokenHash"]);

  let bangsSheet = spreadsheet.getSheetByName(CONFIG.BANGS_SHEET);
  if (!bangsSheet) {
    bangsSheet = spreadsheet.insertSheet(CONFIG.BANGS_SHEET);
  }
  ensureHeaderRow_(bangsSheet, ["emergencyId", "sourceTokenHash", "createdAt", "dedupeKey"]);

  if (emergenciesSheet.getLastRow() === 1) {
    const rows = SEED_EMERGENCIES.map(function(entry) {
      return [entry.id, entry.name, entry.title, entry.details, entry.createdAt, entry.bangs, entry.seeded ? 1 : 0, entry.sourceTokenHash];
    });
    emergenciesSheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }
}

function ensureHeaderRow_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const isMatch = headers.every(function(header, index) {
    return currentHeaders[index] === header;
  });
  if (!isMatch) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function getRoute_(e) {
  const pathInfo = String((e && e.pathInfo) || "").replace(/^\/+|\/+$/g, "");
  if (pathInfo) {
    return pathInfo;
  }
  const action = normalizeWhitespace_(e && e.parameter && e.parameter.action);
  if (action === "health") return "health";
  if (action === "list") return "api/emergencies";
  if (action === "create") return "api/emergencies";
  if (action === "bang") return "api/emergencies/" + normalizeWhitespace_(e && e.parameter && e.parameter.id) + "/bang";
  return "";
}

function parseJsonBody_(e) {
  try {
    const contents = (e && e.postData && e.postData.contents) || "";
    if (contents) {
      return JSON.parse(contents);
    }
  } catch (_error) {}

  return {
    name: e && e.parameter && e.parameter.name,
    title: e && e.parameter && e.parameter.title,
    details: e && e.parameter && e.parameter.details,
    sourceToken: e && e.parameter && e.parameter.sourceToken,
    id: e && e.parameter && e.parameter.id,
    action: e && e.parameter && e.parameter.action,
  };
}

function respond_(e, payload) {
  const callback = normalizeWhitespace_(e && e.parameter && e.parameter.callback);
  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + JSON.stringify(payload) + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return json_(payload);
}

function normalizeEmergencyPayload_(body) {
  return {
    name: normalizeWhitespace_(body && body.name),
    title: normalizeWhitespace_(body && body.title),
    details: normalizeWhitespace_(body && body.details),
    sourceToken: normalizeWhitespace_(body && body.sourceToken),
  };
}

function validateEmergencyPayload_(payload) {
  if (!payload.name || payload.name.length < 2) return "Name must be at least 2 characters.";
  if (payload.name.length > 80) return "Name must be 80 characters or fewer.";
  if (!payload.title || payload.title.length < 3) return "Emergency title must be at least 3 characters.";
  if (payload.title.length > 120) return "Emergency title must be 120 characters or fewer.";
  if (!payload.details || payload.details.length < 8) return "Emergency bulletin must be at least 8 characters.";
  if (payload.details.length > 420) return "Emergency bulletin must be 420 characters or fewer.";
  if (!payload.sourceToken || payload.sourceToken.length < 12) return "Missing source token.";
  return null;
}

function createEmergency_(name, title, details, sourceTokenHash) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const emergency = {
      id: Utilities.getUuid(),
      name: name,
      title: title,
      details: details,
      createdAt: new Date().toISOString(),
      bangs: 0,
      seeded: false,
      sourceTokenHash: sourceTokenHash,
    };
    getSheet_(CONFIG.EMERGENCIES_SHEET).appendRow([
      emergency.id,
      emergency.name,
      emergency.title,
      emergency.details,
      emergency.createdAt,
      emergency.bangs,
      emergency.seeded ? 1 : 0,
      emergency.sourceTokenHash,
    ]);
    return serializeEmergency_(emergency);
  } finally {
    lock.releaseLock();
  }
}

function listEmergencies_(limit) {
  return getEmergencyRecords_()
    .map(serializeEmergency_)
    .sort(function(a, b) {
      const bangDelta = Number(b.bangs || 0) - Number(a.bangs || 0);
      if (bangDelta !== 0) return bangDelta;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit);
}

function recordBang_(emergencyId, sourceTokenHash) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const emergencyRecord = getEmergencyRecordById_(emergencyId);
    if (!emergencyRecord) {
      throw createHttpError_(404, "Emergency not found.");
    }

    const dedupeKey = emergencyId + "|" + sourceTokenHash;
    const existingVote = getBangRecords_().filter(function(row) {
      return row.dedupeKey === dedupeKey;
    })[0];

    if (existingVote) {
      return { inserted: false, emergency: serializeEmergency_(emergencyRecord) };
    }

    getSheet_(CONFIG.BANGS_SHEET).appendRow([emergencyId, sourceTokenHash, new Date().toISOString(), dedupeKey]);
    getSheet_(CONFIG.EMERGENCIES_SHEET).getRange(emergencyRecord._rowNumber, 6).setValue(Number(emergencyRecord.bangs || 0) + 1);

    return {
      inserted: true,
      emergency: serializeEmergency_(getEmergencyRecordById_(emergencyId)),
    };
  } finally {
    lock.releaseLock();
  }
}

function enforceRateLimit_(records, sourceTokenHash, maxPerWindow, message) {
  const cutoff = Date.now() - CONFIG.RATE_LIMIT_WINDOW_MS;
  const count = records.filter(function(row) {
    return row.sourceTokenHash === sourceTokenHash && new Date(row.createdAt).getTime() >= cutoff;
  }).length;
  if (count >= maxPerWindow) {
    throw createHttpError_(429, message);
  }
}

function getEmergencyRecords_() {
  return getSheetRecords_(CONFIG.EMERGENCIES_SHEET);
}

function getBangRecords_() {
  return getSheetRecords_(CONFIG.BANGS_SHEET);
}

function getEmergencyRecordById_(id) {
  const normalizedId = normalizeWhitespace_(id);
  return getEmergencyRecords_().filter(function(row) {
    return row.id === normalizedId;
  })[0] || null;
}

function getSheetRecords_(sheetName) {
  const sheet = getSheet_(sheetName);
  if (sheet.getLastRow() < 2) return [];
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  return rows.map(function(row, index) {
    const record = { _rowNumber: index + 2 };
    headers.forEach(function(header, columnIndex) {
      record[header] = row[columnIndex];
    });
    return record;
  }).filter(function(record) {
    return normalizeWhitespace_(record.id || record.emergencyId);
  });
}

function getSheet_(sheetName) {
  const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(sheetName);
  if (!sheet) throw createHttpError_(500, "Missing sheet: " + sheetName);
  return sheet;
}

function serializeEmergency_(record) {
  return {
    id: String(record.id),
    name: normalizeWhitespace_(record.name || "Anonymous Citizen"),
    title: String(record.title),
    details: String(record.details),
    createdAt: String(record.createdAt),
    bangs: Number(record.bangs || 0),
    seeded: String(record.seeded) === "1" || record.seeded === true,
  };
}

function normalizeWhitespace_(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function hashToken_(sourceToken) {
  const normalized = normalizeWhitespace_(sourceToken);
  if (!normalized) return "";
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, normalized, Utilities.Charset.UTF_8);
  return bytes.map(function(byte) {
    const value = byte < 0 ? byte + 256 : byte;
    return ("0" + value.toString(16)).slice(-2);
  }).join("");
}

function safeDecodeURIComponent_(value) {
  try {
    return decodeURIComponent(value);
  } catch (_error) {
    return value;
  }
}

function clamp_(min, value, max) {
  const numeric = Number(value);
  if (!isFinite(numeric)) return min;
  return Math.min(max, Math.max(min, numeric));
}

function createHttpError_(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

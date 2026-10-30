// scripts/migrate.js
const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

// Load .env.local if present
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("ERROR: DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function runMigration() {
  console.log("Connecting to PostgreSQL database...");
  const migrationFile = path.join(__dirname, "..", "src", "db", "migrations", "001_initial_schema.sql");
  const migrationSql = fs.readFileSync(migrationFile, "utf-8");

  // Remove SQL comments line by line
  const cleanedSql = migrationSql
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("--");
      return idx >= 0 ? line.slice(0, idx) : line;
    })
    .join("\n");

  // Split by statements
  const statements = cleanedSql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Executing ${statements.length} migration statements...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await sql.query(stmt);
    } catch (err) {
      console.error(`Error executing statement #${i + 1}:\n${stmt}\n`, err);
      process.exit(1);
    }
  }

  console.log("Migration executed successfully!");
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

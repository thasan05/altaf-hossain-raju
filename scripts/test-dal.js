// scripts/test-dal.js
const fs = require("fs");
const path = require("path");

// Load .env.local
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

const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);

async function test() {
  console.log("Testing database queries directly...");
  const metrics = await sql.query("SELECT * FROM impact_metrics ORDER BY sort_order ASC");
  console.log(`Fetched ${metrics.length} metrics from Neon PostgreSQL.`);
  console.log("Sample metric:", metrics[0].label, "=>", metrics[0].value);

  const roles = await sql.query("SELECT * FROM career_roles ORDER BY sort_order ASC");
  console.log(`Fetched ${roles.length} career roles.`);

  const ventures = await sql.query("SELECT * FROM ventures ORDER BY sort_order ASC");
  console.log(`Fetched ${ventures.length} ventures.`);

  const sections = await sql.query("SELECT * FROM section_settings ORDER BY sort_order ASC");
  console.log(`Fetched ${sections.length} section settings.`);

  console.log("ALL DAL QUERIES VERIFIED SUCCESSFULLY!");
}

test().catch(console.error);

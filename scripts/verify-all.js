// scripts/verify-all.js
// Comprehensive Verification Suite for Altaf Hossain Raju CMS & Portfolio
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { SignJWT, jwtVerify } = require("jose");

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

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`  [FAIL] ${testName} - ${details}`);
    testsFailed++;
  }
}

async function runVerification() {
  console.log("===============================================================");
  console.log(" STARTING FULL END-TO-END VERIFICATION & AUDIT SUITE");
  console.log("===============================================================\n");

  // TEST SUITE 1: Database Schema & Relational Tables
  console.log("1. DATABASE SCHEMA & TABLE INTEGRITY:");
  const tables = [
    "admin_users",
    "site_profile",
    "site_contact",
    "impact_metrics",
    "career_roles",
    "ventures",
    "areas_of_expertise",
    "speaking_events",
    "credentials",
    "corporate_awards",
    "leadership_roles",
    "media_features",
    "testimonials",
    "section_settings",
    "site_customization",
    "media_assets",
    "activity_logs",
  ];

  for (const table of tables) {
    try {
      const countRes = await sql.query(`SELECT count(*)::int as count FROM ${table}`);
      const count = countRes[0].count;
      assert(count >= 0, `Table '${table}' exists and is queryable`, `Count: ${count}`);
    } catch (err) {
      assert(false, `Table '${table}' check`, err.message);
    }
  }

  // TEST SUITE 2: Core Data Content Verification
  console.log("\n2. CONTENT VERIFICATION:");
  const profileRes = await sql.query("SELECT * FROM site_profile WHERE id = 'default' LIMIT 1");
  assert(profileRes.length === 1, "Default site profile exists");
  assert(profileRes[0].full_name === "Md. Altaf Hossain Raju", "Profile full_name matches Md. Altaf Hossain Raju");
  assert(profileRes[0].honorific_suffix === "PMP®", "Profile honorific_suffix is PMP®");

  const contactRes = await sql.query("SELECT * FROM site_contact WHERE id = 'default' LIMIT 1");
  assert(contactRes.length === 1, "Default site contact exists");
  assert(contactRes[0].email.includes("@"), "Valid contact email configured");

  const metricsRes = await sql.query("SELECT * FROM impact_metrics ORDER BY sort_order ASC");
  assert(metricsRes.length >= 4, "Impact metrics populated (found: " + metricsRes.length + ")");

  const careerRes = await sql.query("SELECT * FROM career_roles ORDER BY sort_order ASC");
  assert(careerRes.length >= 4, "Career roles populated (found: " + careerRes.length + ")");

  const venturesRes = await sql.query("SELECT * FROM ventures ORDER BY sort_order ASC");
  assert(venturesRes.length >= 1, "Ventures populated (found: " + venturesRes.length + ")");

  const sectionsRes = await sql.query("SELECT * FROM section_settings ORDER BY sort_order ASC");
  assert(sectionsRes.length === 11, "All 11 sections exist in layout settings (found: " + sectionsRes.length + ")");

  const mediaRes = await sql.query("SELECT * FROM media_assets ORDER BY created_at DESC");
  assert(mediaRes.length >= 10, "Media assets cataloged (found: " + mediaRes.length + ")");

  // TEST SUITE 3: Authentication & Cryptographic Session Security
  console.log("\n3. AUTHENTICATION & SECURITY VERIFICATION:");
  const adminUsers = await sql.query("SELECT * FROM admin_users WHERE email = $1 LIMIT 1", ["admin@altafhossainraju.com"]);
  assert(adminUsers.length === 1, "Primary admin user 'admin@altafhossainraju.com' exists in database");

  const admin = adminUsers[0];
  const validPassword = await bcrypt.compare("AdminRaju2026!Secure", admin.password_hash);
  assert(validPassword === true, "Admin password hash verifies against 'AdminRaju2026!Secure'");

  const invalidPassword = await bcrypt.compare("WrongPassword123!", admin.password_hash);
  assert(invalidPassword === false, "Invalid password fails bcrypt verification");

  // JWT Token creation and verification
  const secretKey = new TextEncoder().encode(process.env.CMS_JWT_SECRET || process.env.ADMIN_JWT_SECRET || "default_super_secret_jwt_key_altaf_hossain_raju_2026_x1y2z3");
  const token = await new SignJWT({
    id: admin.id,
    email: admin.email,
    role: admin.role,
    name: admin.full_name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  assert(typeof token === "string" && token.length > 30, "Generated signed HS256 JWT session token");

  const { payload } = await jwtVerify(token, secretKey);
  assert(payload.email === "admin@altafhossainraju.com", "Decoded JWT payload contains correct admin email");
  assert(payload.role === "superadmin" || payload.role === "admin", "Decoded JWT payload contains valid admin role");

  // TEST SUITE 4: CMS CRUD Roundtrip Persistence Test
  console.log("\n4. CMS CRUD ROUNDTRIP TEST:");
  const testMetricKey = "test_metric_e2e_" + Date.now();
  await sql.query(
    `INSERT INTO impact_metrics (id, metric_key, value, number_value, suffix, label, description, verification_source, category, is_primary, sort_order, is_published)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      testMetricKey,
      testMetricKey,
      "99.9%",
      99.9,
      "%",
      "E2E Automated Verification Test Metric",
      "Inserted during automated verification to test CRUD roundtrip",
      "Verification Suite",
      "Operational",
      false,
      999,
      true,
    ]
  );

  const inserted = await sql.query("SELECT * FROM impact_metrics WHERE id = $1 LIMIT 1", [testMetricKey]);
  assert(inserted.length === 1 && inserted[0].value === "99.9%", "Created test metric record in database");

  // Update
  await sql.query("UPDATE impact_metrics SET value = $1 WHERE id = $2", ["100%", testMetricKey]);
  const updated = await sql.query("SELECT * FROM impact_metrics WHERE id = $1 LIMIT 1", [testMetricKey]);
  assert(updated.length === 1 && updated[0].value === "100%", "Updated test metric record (value -> 100%)");

  // Delete
  await sql.query("DELETE FROM impact_metrics WHERE id = $1", [testMetricKey]);
  const deleted = await sql.query("SELECT * FROM impact_metrics WHERE id = $1 LIMIT 1", [testMetricKey]);
  assert(deleted.length === 0, "Deleted test metric record successfully");

  // TEST SUITE 5: Audit Logging Persistence
  console.log("\n5. AUDIT LOGGING VERIFICATION:");
  await sql.query(
    `INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, details, ip_address, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
    [
      "audit_e2e_" + Date.now(),
      admin.id,
      "VERIFY",
      "SYSTEM",
      "all",
      "Automated verification test audit entry",
      "127.0.0.1",
    ]
  );
  const auditRes = await sql.query("SELECT * FROM activity_logs WHERE action = 'VERIFY' ORDER BY created_at DESC LIMIT 1");
  assert(auditRes.length === 1, "Activity logs capture forensic administrative activity");

  // Summary
  console.log("\n===============================================================");
  console.log(` VERIFICATION SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log("===============================================================\n");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error("FATAL ERROR IN VERIFICATION SUITE:", err);
  process.exit(1);
});

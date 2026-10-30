import { neon } from "@neondatabase/serverless";

// Helper to get database connection
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }
  return neon(databaseUrl);
}

export async function runQuery<T = any>(
  sqlStatement: string,
  params: any[] = []
): Promise<T[]> {
  const sql = getDb();
  if (!sql) {
    throw new Error("DATABASE_URL is not configured.");
  }
  try {
    const result = await sql.query(sqlStatement, params);
    return result as T[];
  } catch (error) {
    console.error("Database query failed:", error, { sqlStatement, params });
    throw error;
  }
}

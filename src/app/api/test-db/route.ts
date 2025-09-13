import { NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";

export async function GET() {
	try {
		if (!process.env.DATABASE_URL) {
			return NextResponse.json(
				{ error: "DATABASE_URL not configured" },
				{ status: 500 },
			);
		}

		const pool = new Pool({ connectionString: process.env.DATABASE_URL });

		// Test basic connection
		const client = await pool.connect();

		// First, see what tables actually exist
		const existingTablesQuery = `
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

		const existingTablesResult = await client.query(existingTablesQuery);

		// Check if NextAuth tables exist in all schemas
		const allTablesQuery = `
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_name IN ('users', 'accounts', 'sessions', 'verification_tokens')
      ORDER BY table_schema, table_name;
    `;

		const allTablesResult = await client.query(allTablesQuery);

		// Check current schema
		const currentSchemaResult = await client.query(
			"SELECT current_schema()",
		);
		const currentSchema = currentSchemaResult.rows[0]?.current_schema;

		// Check search path
		const searchPathResult = await client.query("SHOW search_path");
		const searchPath = searchPathResult.rows[0]?.search_path;

		// Try to count records in sessions table if it exists
		let sessionCount = null;
		try {
			const countResult = await client.query(
				"SELECT COUNT(*) FROM sessions",
			);
			sessionCount = countResult.rows[0]?.count;
		} catch (error) {
			sessionCount = `Error: ${error instanceof Error ? error.message : "Unknown"}`;
		}

		client.release();

		return NextResponse.json({
			success: true,
			message: "Database connection successful",
			currentSchema,
			searchPath,
			existingTables: existingTablesResult.rows,
			allTablesFound: allTablesResult.rows,
			sessionCount,
			databaseUrl: process.env.DATABASE_URL?.substring(0, 30) + "...",
		});
	} catch (error) {
		console.error("Database connection test failed:", error);

		return NextResponse.json(
			{
				error: "Database connection failed",
				message:
					error instanceof Error ? error.message : "Unknown error",
				databaseUrl: process.env.DATABASE_URL?.substring(0, 30) + "...",
			},
			{ status: 500 },
		);
	}
}

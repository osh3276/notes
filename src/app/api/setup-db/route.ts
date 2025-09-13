import { NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";

export async function POST() {
	try {
		if (!process.env.DATABASE_URL) {
			return NextResponse.json(
				{ error: "DATABASE_URL not configured" },
				{ status: 500 },
			);
		}

		const pool = new Pool({ connectionString: process.env.DATABASE_URL });
		const client = await pool.connect();

		// Create tables one by one
		await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        "emailVerified" TIMESTAMPTZ,
        image TEXT
      );
    `);

		await client.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        type VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        "providerAccountId" VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        id_token TEXT,
        scope TEXT,
        session_state TEXT,
        token_type TEXT
      );
    `);

		await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        "sessionToken" VARCHAR(255) NOT NULL UNIQUE
      );
    `);

		await client.query(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier VARCHAR(255) NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        token VARCHAR(255) NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `);

		// Verify tables were created
		const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'accounts', 'sessions', 'verification_tokens')
      ORDER BY table_name;
    `);

		const createdTables = result.rows.map((row) => row.table_name);

		client.release();

		return NextResponse.json({
			success: true,
			message: "NextAuth tables created successfully",
			createdTables,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Database setup failed:", error);

		return NextResponse.json(
			{
				error: "Database setup failed",
				message:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

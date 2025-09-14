import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
	try {
		// Create the song_feedback table if it doesn't exist
		await sql`
      CREATE TABLE IF NOT EXISTS song_feedback (
        id SERIAL PRIMARY KEY,
        song_id TEXT NOT NULL,
        reviewer_id VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(song_id, reviewer_id)
      )
    `;

		// Check if table was created successfully
		const tableCheck = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'song_feedback'
    `;

		if (tableCheck.length > 0) {
			return NextResponse.json({
				success: true,
				message: "Database table song_feedback is ready",
				table_exists: true,
			});
		} else {
			return NextResponse.json(
				{
					success: false,
					message: "Failed to create song_feedback table",
					table_exists: false,
				},
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error("Database setup error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to setup database table",
				details:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

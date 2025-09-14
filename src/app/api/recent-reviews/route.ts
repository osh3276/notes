import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "3");

		// Validate limit
		if (limit < 1 || limit > 50) {
			return NextResponse.json(
				{ error: "Limit must be between 1 and 50" },
				{ status: 400 },
			);
		}

		// Get recent reviews from the database
		const reviews = await sql`
			SELECT id, song_id, reviewer_id, rating, review, verified, created_at
			FROM song_feedback
			ORDER BY created_at DESC
			LIMIT ${limit}
		`;

		return NextResponse.json({
			success: true,
			reviews,
			count: reviews.length,
		});
	} catch (error) {
		console.error("Error fetching recent reviews:", error);
		return NextResponse.json(
			{ error: "Failed to fetch recent reviews" },
			{ status: 500 },
		);
	}
}

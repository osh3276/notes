import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
	try {
		// Check if user is authenticated
		const session = await auth();
		if (!session?.user?.email) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 },
			);
		}

		// Look up user ID from users table using email
		const userResult = await sql`
			SELECT id FROM users
			WHERE email = ${session.user.email}
		`;

		if (userResult.length === 0) {
			return NextResponse.json(
				{ error: "User not found in database" },
				{ status: 404 },
			);
		}

		const userId = userResult[0].id;

		// Get user statistics
		const reviewStats = await sql`
			SELECT COUNT(*) as review_count
			FROM song_feedback
			WHERE reviewer_id = ${userId}
		`;

		const favoritesStats = await sql`
			SELECT favorites FROM users
			WHERE id = ${userId}
		`;

		// Calculate total likes received on user's reviews
		const likesStats = await sql`
			SELECT COUNT(*) as total_likes
			FROM song_feedback
			WHERE reviewer_id = ${userId}
		`;

		const stats = {
			reviews: parseInt(reviewStats[0].review_count),
			favorites: (favoritesStats[0].favorites || []).length,
			following: 0, // Placeholder - implement when you have following system
			likes: parseInt(likesStats[0].total_likes), // Placeholder for actual likes on reviews
		};

		return NextResponse.json({
			success: true,
			stats,
		});
	} catch (error) {
		console.error("Error fetching user stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user statistics" },
			{ status: 500 },
		);
	}
}

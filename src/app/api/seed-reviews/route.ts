import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
	try {
		// Sample review data for testing
		const sampleReviews = [
			{
				song_id: "4iV5W9uYEdYUVa79Axb7Rh", // Sample Spotify track ID
				reviewer_id: "critic_1",
				rating: 5,
				review: "An absolutely stunning piece of work. The production quality is exceptional and the emotional depth is remarkable. This track showcases incredible artistic maturity.",
				verified: true,
			},
			{
				song_id: "4iV5W9uYEdYUVa79Axb7Rh",
				reviewer_id: "user_12345",
				rating: 4,
				review: "Really love this song! The beat is amazing and I can't stop listening to it. Definitely going on my playlist.",
				verified: false,
			},
			{
				song_id: "4iV5W9uYEdYUVa79Axb7Rh",
				reviewer_id: "critic_2",
				rating: 4,
				review: "A compelling entry that demonstrates technical proficiency without sacrificing emotional resonance. The songwriting shows genuine evolution.",
				verified: true,
			},
			{
				song_id: "4iV5W9uYEdYUVa79Axb7Rh",
				reviewer_id: "user_67890",
				rating: 5,
				review: "This track is fire! Been on repeat all week. The vocals are incredible.",
				verified: false,
			},
			{
				song_id: "4iV5W9uYEdYUVa79Axb7Rh",
				reviewer_id: "critic_3",
				rating: 3,
				review: "While the concept is interesting, the execution feels somewhat rushed. There's potential here but it doesn't quite reach its mark.",
				verified: true,
			},
		];

		// Insert sample reviews
		const insertedReviews = [];
		for (const review of sampleReviews) {
			try {
				const result = await sql`
					INSERT INTO song_feedback (song_id, reviewer_id, rating, review, verified)
					VALUES (${review.song_id}, ${review.reviewer_id}, ${review.rating}, ${review.review}, ${review.verified})
					ON CONFLICT (song_id, reviewer_id)
					DO UPDATE SET
						rating = EXCLUDED.rating,
						review = EXCLUDED.review,
						verified = EXCLUDED.verified,
						created_at = NOW()
					RETURNING id, song_id, reviewer_id, rating, review, verified, created_at
				`;
				insertedReviews.push(result[0]);
			} catch (reviewError) {
				console.error("Error inserting review:", reviewError);
			}
		}

		return NextResponse.json({
			success: true,
			message: `Successfully seeded ${insertedReviews.length} reviews`,
			reviews: insertedReviews,
		});
	} catch (error) {
		console.error("Error seeding reviews:", error);
		return NextResponse.json(
			{
				error: "Failed to seed reviews",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		// Clear all test reviews
		const result = await sql`
			DELETE FROM song_feedback
			WHERE reviewer_id LIKE 'critic_%' OR reviewer_id LIKE 'user_%'
			RETURNING id
		`;

		return NextResponse.json({
			success: true,
			message: `Deleted ${result.length} test reviews`,
			deleted_count: result.length,
		});
	} catch (error) {
		console.error("Error clearing test reviews:", error);
		return NextResponse.json(
			{
				error: "Failed to clear test reviews",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		// Get count of existing reviews
		const reviewCount = await sql`
			SELECT COUNT(*) as total_reviews,
				   COUNT(CASE WHEN verified = true THEN 1 END) as verified_reviews,
				   COUNT(CASE WHEN verified = false THEN 1 END) as community_reviews
			FROM song_feedback
		`;

		return NextResponse.json({
			success: true,
			stats: reviewCount[0],
		});
	} catch (error) {
		console.error("Error getting review stats:", error);
		return NextResponse.json(
			{
				error: "Failed to get review stats",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

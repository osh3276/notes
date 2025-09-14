import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
	try {
		// Check if user is authenticated
		const session = await auth();
		if (!session?.user?.email) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 },
			);
		}

		const body = await request.json();
		const { song_id, rating, review } = body;

		// Validate song_id format (Spotify track IDs are typically 22 characters)
		if (typeof song_id !== "string" || song_id.length < 10) {
			return NextResponse.json(
				{ error: "Invalid song_id format" },
				{ status: 400 },
			);
		}

		// Validate required fields
		if (!song_id || !rating) {
			return NextResponse.json(
				{ error: "song_id and rating are required" },
				{ status: 400 },
			);
		}

		// Validate rating is between 1 and 5
		if (
			typeof rating !== "number" ||
			rating < 1 ||
			rating > 5 ||
			!Number.isInteger(rating)
		) {
			return NextResponse.json(
				{ error: "Rating must be an integer between 1 and 5" },
				{ status: 400 },
			);
		}

		// Validate review text length if provided
		if (review && (typeof review !== "string" || review.length > 1000)) {
			return NextResponse.json(
				{
					error: "Review text must be a string with maximum 1000 characters",
				},
				{ status: 400 },
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

		const reviewer_id = userResult[0].id;

		// Check if user has already reviewed this song
		const existingReview = await sql`
      SELECT id FROM song_feedback
      WHERE song_id = ${song_id} AND reviewer_id = ${reviewer_id}
    `;

		if (existingReview.length > 0) {
			// User has already reviewed this song - don't allow duplicate
			return NextResponse.json(
				{
					error: "You have already reviewed this song. Only one review per song is allowed.",
				},
				{ status: 409 },
			);
		} else {
			// Insert new review
			const result = await sql`
        INSERT INTO song_feedback (song_id, reviewer_id, rating, review)
        VALUES (${song_id}, ${reviewer_id}, ${rating}, ${review || null})
        RETURNING id, song_id, reviewer_id, rating, review, verified, created_at
      `;

			return NextResponse.json(
				{
					success: true,
					message: "Review posted successfully",
					review: result[0],
				},
				{ status: 201 },
			);
		}
	} catch (error) {
		console.error("Error posting review:", error);

		// Handle specific database errors
		if (
			error instanceof Error &&
			error.message?.includes("duplicate key")
		) {
			return NextResponse.json(
				{
					error: "You have already reviewed this song. Your review has been updated.",
				},
				{ status: 409 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to post review. Please try again." },
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const song_id = searchParams.get("song_id");

		if (!song_id) {
			return NextResponse.json(
				{ error: "song_id parameter is required" },
				{ status: 400 },
			);
		}

		// Get all reviews for the song
		const reviews = await sql`
      SELECT id, song_id, reviewer_id, rating, review, verified, created_at
      FROM song_feedback
      WHERE song_id = ${song_id}
      ORDER BY created_at DESC
    `;

		// Calculate statistics
		const totalReviews = reviews.length;
		const averageRating =
			totalReviews > 0
				? reviews.reduce((sum, review) => sum + review.rating, 0) /
					totalReviews
				: 0;

		return NextResponse.json({
			success: true,
			reviews,
			statistics: {
				total_reviews: totalReviews,
				average_rating: Math.round(averageRating * 10) / 10,
			},
		});
	} catch (error) {
		console.error("Error fetching reviews:", error);
		return NextResponse.json(
			{ error: "Failed to fetch reviews" },
			{ status: 500 },
		);
	}
}

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

		// Get user's reviews
		const reviews = await sql`
			SELECT id, song_id, rating, review, verified, created_at
			FROM song_feedback
			WHERE reviewer_id = ${userId}
			ORDER BY created_at DESC
		`;

		// Transform reviews to include song details
		const transformedReviews = await Promise.all(
			reviews.map(async (review) => {
				try {
					// Fetch song details from Spotify API
					const baseUrl =
						process.env.NEXTAUTH_URL || "http://localhost:3000";
					const songResponse = await fetch(
						`${baseUrl}/api/track/${encodeURIComponent(review.song_id)}`,
						{
							headers: {
								"Content-Type": "application/json",
							},
						},
					);

					if (songResponse.ok) {
						const songData = await songResponse.json();
						return {
							...review,
							songTitle: songData?.name || "Unknown Song",
							artist:
								songData?.artists
									?.map((a: any) => a.name)
									.join(", ") || "Unknown Artist",
							albumArt: songData?.album?.images?.[0]?.url || null,
							album: songData?.album?.name || "Unknown Album",
							likes: 0, // Placeholder for when you implement likes system
						};
					}
				} catch (error) {
					console.error(
						`Error fetching song details for ${review.song_id}:`,
						error,
					);
				}

				return {
					...review,
					songTitle: "Unknown Song",
					artist: "Unknown Artist",
					albumArt: null,
					album: "Unknown Album",
					likes: 0,
				};
			}),
		);

		return NextResponse.json({
			success: true,
			reviews: transformedReviews,
			count: transformedReviews.length,
		});
	} catch (error) {
		console.error("Error fetching user reviews:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user reviews" },
			{ status: 500 },
		);
	}
}

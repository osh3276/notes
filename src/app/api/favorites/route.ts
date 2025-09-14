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
		const { song_id, action } = body;

		// Validate required fields
		if (!song_id || !action) {
			return NextResponse.json(
				{ error: "song_id and action are required" },
				{ status: 400 },
			);
		}

		// Validate action
		if (!["add", "remove"].includes(action)) {
			return NextResponse.json(
				{ error: "Action must be 'add' or 'remove'" },
				{ status: 400 },
			);
		}

		// Look up user ID from users table using email
		const userResult = await sql`
			SELECT id, favorites FROM users
			WHERE email = ${session.user.email}
		`;

		if (userResult.length === 0) {
			return NextResponse.json(
				{ error: "User not found in database" },
				{ status: 404 },
			);
		}

		const user = userResult[0];
		const currentFavorites = user.favorites || [];

		let updatedFavorites;
		let message;

		if (action === "add") {
			// Add song to favorites if not already present
			if (currentFavorites.includes(song_id)) {
				return NextResponse.json(
					{ error: "Song is already in favorites" },
					{ status: 409 },
				);
			}
			updatedFavorites = [...currentFavorites, song_id];
			message = "Song added to favorites";
		} else {
			// Remove song from favorites
			if (!currentFavorites.includes(song_id)) {
				return NextResponse.json(
					{ error: "Song is not in favorites" },
					{ status: 404 },
				);
			}
			updatedFavorites = currentFavorites.filter((id: string) => id !== song_id);
			message = "Song removed from favorites";
		}

		// Update user's favorites in database
		await sql`
			UPDATE users
			SET favorites = ${updatedFavorites}
			WHERE id = ${user.id}
		`;

		return NextResponse.json({
			success: true,
			message,
			favorites: updatedFavorites,
			count: updatedFavorites.length,
		});
	} catch (error) {
		console.error("Error managing favorites:", error);
		return NextResponse.json(
			{ error: "Failed to update favorites" },
			{ status: 500 },
		);
	}
}

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

		// Look up user's favorites from database
		const userResult = await sql`
			SELECT favorites FROM users
			WHERE email = ${session.user.email}
		`;

		if (userResult.length === 0) {
			return NextResponse.json(
				{ error: "User not found in database" },
				{ status: 404 },
			);
		}

		const favorites = userResult[0].favorites || [];

		return NextResponse.json({
			success: true,
			favorites,
			count: favorites.length,
		});
	} catch (error) {
		console.error("Error fetching favorites:", error);
		return NextResponse.json(
			{ error: "Failed to fetch favorites" },
			{ status: 500 },
		);
	}
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const user_id = searchParams.get("user_id");

		if (!user_id) {
			return NextResponse.json(
				{ error: "user_id parameter is required" },
				{ status: 400 },
			);
		}

		// Fetch user from the users table
		const result = await sql`
			SELECT id, name, email, image
			FROM users
			WHERE id = ${user_id}
		`;

		if (result.length === 0) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 },
			);
		}

		const userData = {
			id: result[0].id,
			name: result[0].name,
			email: result[0].email,
			image:
				result[0].image ||
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		};

		return NextResponse.json({
			success: true,
			user: userData,
		});
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		// Check if user is authenticated
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 },
			);
		}

		// Return current user's information
		return NextResponse.json({
			success: true,
			user: {
				id: session.user.id,
				name: session.user.name || "Unknown User",
				image: session.user.image || null,
			},
		});
	} catch (error) {
		console.error("Error getting current user:", error);
		return NextResponse.json(
			{ error: "Failed to get current user" },
			{ status: 500 },
		);
	}
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

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

		// For now, we'll return mock user data since we don't have a users table
		// In a real app, you'd fetch from a users table
		const mockUsers: Record<string, any> = {
			// Generate some sample users with Spotify-like IDs
			default: {
				id: user_id,
				name: "Music Lover",
				image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
			},
		};

		// Generate a consistent user based on the user_id hash
		const userHash = user_id.split("").reduce((a, b) => {
			a = (a << 5) - a + b.charCodeAt(0);
			return a & a;
		}, 0);

		const names = [
			"Alex Johnson",
			"Sarah Chen",
			"Mike Rodriguez",
			"Emma Thompson",
			"David Kim",
			"Lisa Wang",
			"James Wilson",
			"Maria Garcia",
			"Ryan O'Connor",
			"Priya Patel",
		];

		const avatars = [
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
			"https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
			"https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
		];

		const nameIndex = Math.abs(userHash) % names.length;
		const avatarIndex = Math.abs(userHash) % avatars.length;

		const userData = {
			id: user_id,
			name: names[nameIndex],
			image: avatars[avatarIndex],
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

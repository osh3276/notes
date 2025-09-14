import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

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

		// In a real app, you'd check if the user has admin privileges
		// For now, we'll allow any authenticated user to toggle verified status
		// You should implement proper role-based access control

		const body = await request.json();
		const { reviewer_id, verified } = body;

		// Validate required fields
		if (!reviewer_id || typeof verified !== "boolean") {
			return NextResponse.json(
				{ error: "reviewer_id and verified (boolean) are required" },
				{ status: 400 },
			);
		}

		// Update all reviews for this reviewer to set verified status
		const result = await sql`
			UPDATE song_feedback
			SET verified = ${verified}
			WHERE reviewer_id = ${reviewer_id}
			RETURNING id, song_id, reviewer_id, verified
		`;

		if (result.length === 0) {
			return NextResponse.json(
				{ error: "No reviews found for this reviewer" },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			message: `Verified status ${
				verified ? "enabled" : "disabled"
			} for reviewer`,
			updated_reviews: result.length,
			reviews: result,
		});
	} catch (error) {
		console.error("Error toggling verified status:", error);
		return NextResponse.json(
			{ error: "Failed to update verified status" },
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const reviewer_id = searchParams.get("reviewer_id");

		if (!reviewer_id) {
			// Return all verified reviewers
			const verifiedReviewers = await sql`
				SELECT DISTINCT reviewer_id, verified
				FROM song_feedback
				WHERE verified = true
				ORDER BY reviewer_id
			`;

			return NextResponse.json({
				success: true,
				verified_reviewers: verifiedReviewers,
			});
		} else {
			// Check specific reviewer's verified status
			const reviewerStatus = await sql`
				SELECT reviewer_id, verified, COUNT(*) as review_count
				FROM song_feedback
				WHERE reviewer_id = ${reviewer_id}
				GROUP BY reviewer_id, verified
			`;

			return NextResponse.json({
				success: true,
				reviewer_status: reviewerStatus,
			});
		}
	} catch (error) {
		console.error("Error fetching verified status:", error);
		return NextResponse.json(
			{ error: "Failed to fetch verified status" },
			{ status: 500 },
		);
	}
}

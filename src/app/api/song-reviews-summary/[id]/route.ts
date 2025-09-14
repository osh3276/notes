import { NextResponse } from "next/server";
import { getSongReviewsSummary } from "@/lib/db";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const resolvedParams = await params;
		const summary = await getSongReviewsSummary(resolvedParams.id);
		return NextResponse.json({ summary });
	} catch (error) {
		console.error("Error getting song reviews summary:", error);
		return NextResponse.json(
			{ error: "Failed to get song reviews summary" },
			{ status: 500 },
		);
	}
}

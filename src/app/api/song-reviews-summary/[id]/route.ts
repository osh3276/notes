import { NextResponse } from 'next/server';
import { getSongReviewsSummary } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const summary = await getSongReviewsSummary(params.id);
        return NextResponse.json({ summary });
    } catch (error) {
        console.error('Error getting song reviews summary:', error);
        return NextResponse.json(
            { error: 'Failed to get song reviews summary' },
            { status: 500 }
        );
    }
}
import { NextResponse } from 'next/server';
import { testConnections } from '@/lib/db';

export async function GET() {
  try {
    const result = await testConnections();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}
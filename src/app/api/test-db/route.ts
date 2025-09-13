import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'DATABASE_URL not configured' },
        { status: 500 }
      );
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // Test basic connection
    const client = await pool.connect();

    // Check if NextAuth tables exist
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'accounts', 'sessions', 'verification_tokens')
      ORDER BY table_name;
    `;

    const tablesResult = await client.query(tablesQuery);
    const existingTables = tablesResult.rows.map(row => row.table_name);

    client.release();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      existingTables,
      missingTables: ['users', 'accounts', 'sessions', 'verification_tokens']
        .filter(table => !existingTables.includes(table)),
      databaseUrl: process.env.DATABASE_URL?.substring(0, 30) + '...'
    });

  } catch (error) {
    console.error('Database connection test failed:', error);

    return NextResponse.json(
      {
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        databaseUrl: process.env.DATABASE_URL?.substring(0, 30) + '...'
      },
      { status: 500 }
    );
  }
}

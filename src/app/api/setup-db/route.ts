import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

export async function POST() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'DATABASE_URL not configured' },
        { status: 500 }
      );
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();

    // Create NextAuth tables
    const createTablesSQL = `
      -- Create users table
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        "emailVerified" TIMESTAMPTZ,
        image TEXT
      );

      -- Create accounts table
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        type VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        "providerAccountId" VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        id_token TEXT,
        scope TEXT,
        session_state TEXT,
        token_type TEXT,
        UNIQUE(provider, "providerAccountId")
      );

      -- Create sessions table
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        "sessionToken" VARCHAR(255) NOT NULL UNIQUE
      );

      -- Create verification_tokens table
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier VARCHAR(255) NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        token VARCHAR(255) NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `;

    await client.query(createTablesSQL);

    // Add foreign key constraints
    const constraintsSQL = `
      -- Add foreign key constraints if they don't exist
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'accounts_userid_fkey'
        ) THEN
          ALTER TABLE accounts ADD CONSTRAINT accounts_userid_fkey
            FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'sessions_userid_fkey'
        ) THEN
          ALTER TABLE sessions ADD CONSTRAINT sessions_userid_fkey
            FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `;

    await client.query(constraintsSQL);

    // Create indexes
    const indexesSQL = `
      CREATE INDEX IF NOT EXISTS accounts_userId_idx ON accounts("userId");
      CREATE INDEX IF NOT EXISTS sessions_userId_idx ON sessions("userId");
      CREATE INDEX IF NOT EXISTS sessions_sessionToken_idx ON sessions("sessionToken");
    `;

    await client.query(indexesSQL);

    // Verify tables were created
    const verifyQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'accounts', 'sessions', 'verification_tokens')
      ORDER BY table_name;
    `;

    const result = await client.query(verifyQuery);
    const createdTables = result.rows.map(row => row.table_name);

    client.release();

    return NextResponse.json({
      success: true,
      message: 'NextAuth tables created successfully',
      createdTables,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database setup failed:', error);

    return NextResponse.json(
      {
        error: 'Database setup failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

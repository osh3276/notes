-- NextAuth.js database schema for PostgreSQL
-- This creates all the necessary tables for NextAuth with the Neon adapter

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

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token VARCHAR(255) NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Add foreign key constraints
ALTER TABLE accounts ADD CONSTRAINT accounts_userId_fkey
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE sessions ADD CONSTRAINT sessions_userId_fkey
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS accounts_userId_idx ON accounts("userId");
CREATE INDEX IF NOT EXISTS sessions_userId_idx ON sessions("userId");
CREATE INDEX IF NOT EXISTS sessions_sessionToken_idx ON sessions("sessionToken");

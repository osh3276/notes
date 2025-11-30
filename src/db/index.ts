import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Create the database client
const client = postgres(process.env.DATABASE_URL!);

// Create and export the database instance with schema
export const db = drizzle(client, { schema });
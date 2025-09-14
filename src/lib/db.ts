import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';

neonConfig.fetchConnectionCache = true;

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}

// For one-off queries
export async function sql(strings: TemplateStringsArray, ...values: any[]) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not defined');
  return neon(connectionString)(strings, ...values);
}

// For transactions or when you need a client
export async function withClient<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    return await callback(client);
  } finally {
    client.release();
  }
}
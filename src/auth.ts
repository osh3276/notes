import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
	// Create a `Pool` inside the request handler.
	const pool = new Pool({ connectionString: process.env.DATABASE_URL });

	console.log("Database URL configured:", !!process.env.DATABASE_URL);
	console.log(
		"Database URL preview:",
		process.env.DATABASE_URL?.substring(0, 20) + "...",
	);

	return {
		adapter: NeonAdapter(pool as any),
		providers: [Spotify],
		debug: true,
	};
});

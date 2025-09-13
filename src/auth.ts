import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
	// Create a `Pool` inside the request handler.
	const pool = new Pool({ connectionString: process.env.DATABASE_URL });
	return {
		adapter: NeonAdapter(pool as any),
		providers: [Spotify],
	};
});

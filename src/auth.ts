import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Spotify({
			authorization: {
				params: {
					scope: "user-read-email user-library-read user-top-read playlist-read-private",
				},
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
			}
			return token;
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken as string;
			return session;
		},
	},
});

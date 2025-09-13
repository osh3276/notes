import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [Spotify],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, account, user }) {
			if (account) {
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
			}
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.accessToken = token.accessToken;
				session.refreshToken = token.refreshToken;
				session.user.id = token.id;
			}
			return session;
		},
	},
});

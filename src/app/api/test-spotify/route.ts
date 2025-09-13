import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET(request: NextRequest) {
	try {
		console.log("Testing Spotify client credentials...");
		console.log("CLIENT_ID:", process.env.AUTH_SPOTIFY_ID ? "✓ Set" : "✗ Missing");
		console.log("CLIENT_SECRET:", process.env.AUTH_SPOTIFY_SECRET ? "✓ Set" : "✗ Missing");

		if (!process.env.AUTH_SPOTIFY_ID || !process.env.AUTH_SPOTIFY_SECRET) {
			return NextResponse.json(
				{
					error: "Missing Spotify credentials",
					details: {
						clientId: !!process.env.AUTH_SPOTIFY_ID,
						clientSecret: !!process.env.AUTH_SPOTIFY_SECRET
					}
				},
				{ status: 500 }
			);
		}

		const spotifyApi = new SpotifyWebApi({
			clientId: process.env.AUTH_SPOTIFY_ID,
			clientSecret: process.env.AUTH_SPOTIFY_SECRET,
		});

		console.log("Attempting client credentials grant...");
		const clientCredentials = await spotifyApi.clientCredentialsGrant();
		console.log("Client credentials successful!");

		spotifyApi.setAccessToken(clientCredentials.body.access_token);

		console.log("Testing search with client credentials...");
		const searchResults = await spotifyApi.searchTracks("test", { limit: 1 });
		console.log("Search successful!");

		return NextResponse.json({
			success: true,
			message: "Spotify API test successful",
			tokenType: "client_credentials",
			tracksFound: searchResults.body.tracks?.total || 0,
			sampleTrack: searchResults.body.tracks?.items[0]?.name || "None"
		});

	} catch (error) {
		console.error("Spotify test error:", error);

		return NextResponse.json(
			{
				error: "Spotify test failed",
				details: error instanceof Error ? error.message : "Unknown error",
				stack: error instanceof Error ? error.stack : undefined
			},
			{ status: 500 }
		);
	}
}

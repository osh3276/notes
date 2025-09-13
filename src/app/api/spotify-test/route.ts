import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET(request: NextRequest) {
	try {
		// Check if environment variables are set
		if (!process.env.AUTH_SPOTIFY_ID || !process.env.AUTH_SPOTIFY_SECRET) {
			console.error("Missing Spotify API credentials");
			return NextResponse.json(
				{
					error: "Spotify API credentials not configured",
					details: "AUTH_SPOTIFY_ID and AUTH_SPOTIFY_SECRET must be set"
				},
				{ status: 500 },
			);
		}

		console.log("Testing Spotify API credentials...");
		console.log("Client ID:", process.env.AUTH_SPOTIFY_ID?.substring(0, 8) + "...");

		// Initialize Spotify API with client credentials
		const spotifyApi = new SpotifyWebApi({
			clientId: process.env.AUTH_SPOTIFY_ID,
			clientSecret: process.env.AUTH_SPOTIFY_SECRET,
		});

		// Test authentication
		console.log("Attempting client credentials grant...");
		const clientCredentials = await spotifyApi.clientCredentialsGrant();

		console.log("Authentication successful!");
		console.log("Token type:", clientCredentials.body.token_type);
		console.log("Expires in:", clientCredentials.body.expires_in, "seconds");

		spotifyApi.setAccessToken(clientCredentials.body.access_token);

		// Test a simple API call - get a well-known track
		console.log("Testing API call with a known track...");
		const testTrackId = "4uLU6hMCjMI75M1A2tKUQC"; // Rick Astley - Never Gonna Give You Up

		try {
			const trackDetails = await spotifyApi.getTrack(testTrackId);
			console.log("Test track fetch successful!");

			return NextResponse.json({
				success: true,
				message: "Spotify API credentials are working correctly",
				test_track: {
					id: trackDetails.body.id,
					name: trackDetails.body.name,
					artist: trackDetails.body.artists[0]?.name,
				},
				token_info: {
					token_type: clientCredentials.body.token_type,
					expires_in: clientCredentials.body.expires_in,
				}
			});
		} catch (apiError: any) {
			console.error("API call failed:", {
				message: apiError.message,
				statusCode: apiError.statusCode,
				body: apiError.body,
			});

			return NextResponse.json({
				success: false,
				auth_success: true,
				api_error: true,
				message: "Authentication works but API call failed",
				error_details: {
					statusCode: apiError.statusCode,
					message: apiError.message,
				}
			}, { status: apiError.statusCode || 500 });
		}

	} catch (error: any) {
		console.error("Spotify API test failed:", {
			message: error.message,
			statusCode: error.statusCode,
			body: error.body,
		});

		if (error.statusCode === 400) {
			return NextResponse.json({
				success: false,
				message: "Invalid Spotify API credentials",
				error_details: {
					statusCode: error.statusCode,
					message: error.message,
					suggestion: "Check that your CLIENT_ID and CLIENT_SECRET are correct"
				}
			}, { status: 400 });
		}

		return NextResponse.json({
			success: false,
			message: "Spotify API test failed",
			error_details: {
				statusCode: error.statusCode || 500,
				message: error.message,
			}
		}, { status: error.statusCode || 500 });
	}
}

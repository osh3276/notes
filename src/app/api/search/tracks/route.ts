import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET(request: NextRequest) {
	try {
		// Get search query from URL parameters
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q");
		const limit = parseInt(searchParams.get("limit") || "20");

		if (!query) {
			return NextResponse.json(
				{ error: 'Query parameter "q" is required' },
				{ status: 400 },
			);
		}

		// Check if environment variables are set
		if (!process.env.AUTH_SPOTIFY_ID || !process.env.AUTH_SPOTIFY_SECRET) {
			return NextResponse.json(
				{ error: "Spotify API credentials not configured" },
				{ status: 500 },
			);
		}

		// Initialize Spotify API with client credentials
		const spotifyApi = new SpotifyWebApi({
			clientId: process.env.AUTH_SPOTIFY_ID,
			clientSecret: process.env.AUTH_SPOTIFY_SECRET,
		});

		// Get access token using client credentials flow
		const clientCredentials = await spotifyApi.clientCredentialsGrant();
		spotifyApi.setAccessToken(clientCredentials.body.access_token);

		// Search for tracks
		const searchResults = await spotifyApi.searchTracks(query, {
			limit: Math.min(limit, 50), // Spotify API limit is 50
			market: "US",
		});

		// Format the response
		const tracks =
			searchResults.body.tracks?.items.map((track) => ({
				id: track.id,
				name: track.name,
				artists: track.artists.map((artist) => ({
					id: artist.id,
					name: artist.name,
				})),
				album: {
					id: track.album.id,
					name: track.album.name,
					images: track.album.images,
				},
				duration_ms: track.duration_ms,
				popularity: track.popularity,
				preview_url: track.preview_url,
				external_urls: track.external_urls,
			})) || [];

		return NextResponse.json({
			tracks,
			total: searchResults.body.tracks?.total || 0,
			limit: searchResults.body.tracks?.limit || limit,
			offset: searchResults.body.tracks?.offset || 0,
		});
	} catch (error) {
		console.error("Spotify search error:", error);

		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		// Get search data from request body
		const body = await request.json();
		const { query, limit = 20 } = body;

		if (!query) {
			return NextResponse.json(
				{ error: "Query is required in request body" },
				{ status: 400 },
			);
		}

		// Check if environment variables are set
		if (!process.env.AUTH_SPOTIFY_ID || !process.env.AUTH_SPOTIFY_SECRET) {
			return NextResponse.json(
				{ error: "Spotify API credentials not configured" },
				{ status: 500 },
			);
		}

		// Initialize Spotify API with client credentials
		const spotifyApi = new SpotifyWebApi({
			clientId: process.env.AUTH_SPOTIFY_ID,
			clientSecret: process.env.AUTH_SPOTIFY_SECRET,
		});

		// Get access token using client credentials flow
		const clientCredentials = await spotifyApi.clientCredentialsGrant();
		spotifyApi.setAccessToken(clientCredentials.body.access_token);

		// Search for tracks
		const searchResults = await spotifyApi.searchTracks(query, {
			limit: Math.min(limit, 50), // Spotify API limit is 50
			market: "US",
		});

		// Format the response
		const tracks =
			searchResults.body.tracks?.items.map((track) => ({
				id: track.id,
				name: track.name,
				artists: track.artists.map((artist) => ({
					id: artist.id,
					name: artist.name,
				})),
				album: {
					id: track.album.id,
					name: track.album.name,
					images: track.album.images,
				},
				duration_ms: track.duration_ms,
				popularity: track.popularity,
				preview_url: track.preview_url,
				external_urls: track.external_urls,
			})) || [];

		return NextResponse.json({
			tracks,
			total: searchResults.body.tracks?.total || 0,
			limit: searchResults.body.tracks?.limit || limit,
			offset: searchResults.body.tracks?.offset || 0,
		});
	} catch (error) {
		console.error("Spotify search error:", error);

		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET(request: NextRequest) {
	try {
		// Get limit from URL parameters
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "20");

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

		// Get new releases
		const newReleases = await spotifyApi.getNewReleases({
			limit: Math.min(limit, 50), // Spotify API limit is 50
			offset: 0,
			country: "US",
		});

		// Format the response to include track information for each album
		const albums = newReleases.body.albums?.items || [];
		const formattedReleases = [];

		// For each album, get the first track to have track data
		for (const album of albums.slice(0, limit)) {
			try {
				// Get album tracks to get the first track
				const albumTracks = await spotifyApi.getAlbumTracks(album.id, {
					limit: 1,
					market: "US",
				});

				const firstTrack = albumTracks.body.items[0];

				if (firstTrack) {
					formattedReleases.push({
						id: firstTrack.id,
						name: firstTrack.name,
						artists: firstTrack.artists.map((artist) => ({
							id: artist.id,
							name: artist.name,
						})),
						album: {
							id: album.id,
							name: album.name,
							images: album.images,
							release_date: album.release_date,
							total_tracks: album.total_tracks,
						},
						duration_ms: firstTrack.duration_ms,
						popularity: 0, // New releases don't have popularity data yet
						preview_url: firstTrack.preview_url,
						external_urls: firstTrack.external_urls,
						track_number: firstTrack.track_number,
					});
				}
			} catch (trackError) {
				console.warn(`Error fetching tracks for album ${album.id}:`, trackError);
				// Continue with next album if this one fails
				continue;
			}
		}

		return NextResponse.json({
			releases: formattedReleases,
			total: newReleases.body.albums?.total || 0,
			limit: Math.min(limit, formattedReleases.length),
			offset: 0,
		});
	} catch (error) {
		console.error("Spotify new releases error:", error);

		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

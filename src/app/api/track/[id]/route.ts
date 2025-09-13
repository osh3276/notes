import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ error: "Track ID is required" },
				{ status: 400 },
			);
		}

		// Validate Spotify track ID format
		const spotifyIdRegex = /^[A-Za-z0-9]{22}$/;
		if (!spotifyIdRegex.test(id)) {
			return NextResponse.json(
				{ error: "Invalid Spotify track ID format" },
				{ status: 400 },
			);
		}

		// Check if environment variables are set
		if (!process.env.AUTH_SPOTIFY_ID || !process.env.AUTH_SPOTIFY_SECRET) {
			console.error("Missing Spotify API credentials");
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

		console.log(`Attempting to fetch track: ${id}`);

		// Get access token using client credentials flow
		let clientCredentials;
		try {
			clientCredentials = await spotifyApi.clientCredentialsGrant();
			console.log("Successfully obtained access token");
		} catch (authError: any) {
			console.error("Authentication failed:", {
				message: authError.message,
				statusCode: authError.statusCode,
				body: authError.body,
			});

			if (authError.statusCode === 400) {
				return NextResponse.json(
					{ error: "Invalid Spotify API credentials" },
					{ status: 500 },
				);
			}

			return NextResponse.json(
				{ error: "Failed to authenticate with Spotify API" },
				{ status: 500 },
			);
		}

		spotifyApi.setAccessToken(clientCredentials.body.access_token);

		// Get track details with detailed error handling
		let trackDetails;
		try {
			trackDetails = await spotifyApi.getTrack(id);
			console.log("Successfully fetched track details");
		} catch (trackError: any) {
			console.error("Track fetch error:", {
				message: trackError.message,
				statusCode: trackError.statusCode,
				body: trackError.body,
			});

			if (trackError.statusCode === 404) {
				return NextResponse.json(
					{ error: "Track not found" },
					{ status: 404 },
				);
			}

			if (trackError.statusCode === 403) {
				return NextResponse.json(
					{
						error: "Access denied - check API permissions and rate limits",
					},
					{ status: 403 },
				);
			}

			if (trackError.statusCode === 429) {
				return NextResponse.json(
					{ error: "Rate limit exceeded - please try again later" },
					{ status: 429 },
				);
			}

			throw trackError; // Re-throw for general error handling
		}

		const track = trackDetails.body;

		// Get additional track features with error handling
		let audioFeatures = null;
		try {
			const audioFeaturesResponse =
				await spotifyApi.getAudioFeaturesForTrack(id);
			audioFeatures = audioFeaturesResponse.body;
			console.log("Successfully fetched audio features");
		} catch (featuresError: any) {
			console.warn(
				"Failed to fetch audio features:",
				featuresError.message,
			);
			// Continue without audio features
		}

		// Get artist details for additional info with error handling
		let artistsDetails = null;
		try {
			const artistIds = track.artists.map((artist) => artist.id);
			if (artistIds.length > 0) {
				const artistsResponse = await spotifyApi.getArtists(artistIds);
				artistsDetails = artistsResponse.body;
				console.log("Successfully fetched artist details");
			}
		} catch (artistError: any) {
			console.warn(
				"Failed to fetch artist details:",
				artistError.message,
			);
			// Continue without detailed artist info
		}

		// Format the response
		const formattedTrack = {
			id: track.id,
			name: track.name,
			artists: track.artists.map((artist, index) => ({
				id: artist.id,
				name: artist.name,
				external_urls: artist.external_urls,
				genres: artistsDetails?.artists[index]?.genres || [],
				followers:
					artistsDetails?.artists[index]?.followers?.total || 0,
				popularity: artistsDetails?.artists[index]?.popularity || 0,
				images: artistsDetails?.artists[index]?.images || [],
			})),
			album: {
				id: track.album.id,
				name: track.album.name,
				images: track.album.images,
				release_date: track.album.release_date,
				total_tracks: track.album.total_tracks,
				external_urls: track.album.external_urls,
				genres: [],
				label: null,
				album_type: track.album.album_type,
			},
			duration_ms: track.duration_ms,
			explicit: track.explicit,
			popularity: track.popularity,
			preview_url: track.preview_url,
			track_number: track.track_number,
			disc_number: track.disc_number,
			external_urls: track.external_urls,
			external_ids: track.external_ids,
			available_markets: track.available_markets,
			is_local: track.is_local,
			audio_features: audioFeatures
				? {
						danceability: audioFeatures.danceability,
						energy: audioFeatures.energy,
						key: audioFeatures.key,
						loudness: audioFeatures.loudness,
						mode: audioFeatures.mode,
						speechiness: audioFeatures.speechiness,
						acousticness: audioFeatures.acousticness,
						instrumentalness: audioFeatures.instrumentalness,
						liveness: audioFeatures.liveness,
						valence: audioFeatures.valence,
						tempo: audioFeatures.tempo,
						time_signature: audioFeatures.time_signature,
					}
				: null,
		};

		console.log(
			`Successfully processed track: ${track.name} by ${track.artists[0]?.name}`,
		);
		return NextResponse.json(formattedTrack);
	} catch (error: any) {
		console.error("Spotify track fetch error:", {
			message: error.message,
			statusCode: error.statusCode,
			body: error.body,
			stack: error.stack,
		});

		// Handle specific Spotify API errors
		if (error.statusCode === 400) {
			return NextResponse.json(
				{ error: "Bad request - invalid parameters" },
				{ status: 400 },
			);
		}

		if (error.statusCode === 401) {
			return NextResponse.json(
				{ error: "Unauthorized - invalid access token" },
				{ status: 401 },
			);
		}

		if (error.statusCode === 403) {
			return NextResponse.json(
				{
					error: "Forbidden - insufficient permissions or rate limit exceeded",
					details:
						"Check your Spotify app settings and ensure you have the correct scopes",
				},
				{ status: 403 },
			);
		}

		if (error.statusCode === 404) {
			return NextResponse.json(
				{ error: "Track not found" },
				{ status: 404 },
			);
		}

		if (error.statusCode === 429) {
			return NextResponse.json(
				{ error: "Rate limit exceeded - please try again later" },
				{ status: 429 },
			);
		}

		if (error.statusCode >= 500) {
			return NextResponse.json(
				{ error: "Spotify API server error - please try again later" },
				{ status: 502 },
			);
		}

		// Generic error fallback
		return NextResponse.json(
			{
				error: "Internal server error",
				message: error.message || "Unknown error occurred",
			},
			{ status: 500 },
		);
	}
}

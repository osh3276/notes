"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SongDetail } from "@/components/SongDetail";
import { MiniHeader } from "@/components/MiniHeader";

interface AudioFeatures {
	danceability: number;
	energy: number;
	key: number;
	loudness: number;
	mode: number;
	speechiness: number;
	acousticness: number;
	instrumentalness: number;
	liveness: number;
	valence: number;
	tempo: number;
	time_signature: number;
}

interface Artist {
	external_urls: {
		spotify: string;
	};
	followers?: {
		href: string | null;
		total: number;
	};
	genres: string[];
	href: string;
	id: string;
	images: Array<{
		url: string;
		height: number;
		width: number;
	}>;
	name: string;
	popularity: number;
	type: string;
	uri: string;
}

interface Album {
	album_type: string;
	total_tracks: number;
	available_markets: string[];
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	images: Array<{
		url: string;
		height: number;
		width: number;
	}>;
	name: string;
	release_date: string;
	release_date_precision: string;
	restrictions?: {
		reason: string;
	};
	type: string;
	uri: string;
	artists: Artist[];
}

interface TrackDetails {
	album: Album;
	artists: Artist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: {
		isrc: string;
	};
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	is_playable: boolean;
	linked_from?: object;
	restrictions?: {
		reason: string;
	};
	name: string;
	popularity: number;
	preview_url: string | null;
	track_number: number;
	type: string;
	uri: string;
	is_local: boolean;
	audio_features: AudioFeatures;
}

interface Song {
	id: string;
	title: string;
	artist: string;
	albumArt: string;
	rating: number | string;
	reviewCount: number;
	genres: string[];
	album?: string;
	releaseDate?: string;
	duration?: string;
	spotifyUrl?: string;
	aiSummary?: string;
}

export default function SongDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const [track, setTrack] = useState<TrackDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [aiSummary, setAiSummary] = useState<string | null>(null);
	const [songRating, setSongRating] = useState<number | string>("N/A");
	const [reviewCount, setReviewCount] = useState<number>(0);

	const trackId = params.id as string;

	useEffect(() => {
		if (!trackId) return;

		const fetchTrackDetails = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch(`/api/track/${trackId}`);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(
						data.error || "Failed to fetch track details",
					);
				}

				setTrack(data);

				// Fetch reviews to calculate rating and count
				try {
					const reviewsResponse = await fetch(
						`/api/reviews?song_id=${encodeURIComponent(trackId)}`,
					);
					const reviewsData = await reviewsResponse.json();

					if (reviewsResponse.ok && reviewsData.statistics) {
						setReviewCount(reviewsData.statistics.total_reviews);
						if (reviewsData.statistics.total_reviews > 0) {
							setSongRating(
								reviewsData.statistics.average_rating,
							);
						} else {
							setSongRating("N/A");
						}
					} else {
						setSongRating("N/A");
						setReviewCount(0);
					}
				} catch (reviewsErr) {
					console.error("Error fetching reviews:", reviewsErr);
					setSongRating("N/A");
					setReviewCount(0);
				}

				// Fetch AI summary after getting track details
				try {
					const summaryResponse = await fetch(
						`/api/song-reviews-summary/${trackId}`,
					);
					const summaryData = await summaryResponse.json();
					setAiSummary(summaryData.summary);
				} catch (summaryErr) {
					console.error("Error fetching AI summary:", summaryErr);
					setAiSummary(null);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "An error occurred",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchTrackDetails();
	}, [trackId]);

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const handleBack = () => {
		router.back();
	};

	const handleProfileClick = () => {
		router.push("/profile");
	};

	const handleArtistClick = (artistName: string) => {
		// For now, just go back - you can implement artist routing later
		console.log("Artist clicked:", artistName);
	};

	const handleGenreClick = (genre: string) => {
		// For now, just go back - you can implement genre routing later
		console.log("Genre clicked:", genre);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#1A1A1A] dark">
				<MiniHeader
					onBack={handleBack}
					onProfileClick={handleProfileClick}
					onSongSelect={(songId) => router.push(`/song/${songId}`)}
				/>
				<div className="flex items-center justify-center pt-20">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
						<p className="text-muted-foreground">
							Loading track details...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-[#1A1A1A] dark">
				<MiniHeader
					onBack={handleBack}
					onProfileClick={handleProfileClick}
					onSongSelect={(songId) => router.push(`/song/${songId}`)}
				/>
				<div className="flex items-center justify-center pt-20">
					<div className="text-center max-w-md">
						<div className="mb-4">
							<svg
								className="w-16 h-16 text-red-500 mx-auto"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h1 className="text-2xl font-bold text-foreground mb-2">
							Error Loading Track
						</h1>
						<p className="text-muted-foreground mb-4">{error}</p>
						<button
							onClick={handleBack}
							className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!track) {
		return (
			<div className="min-h-screen bg-[#1A1A1A] dark">
				<MiniHeader
					onBack={handleBack}
					onProfileClick={handleProfileClick}
					onSongSelect={(songId) => router.push(`/song/${songId}`)}
				/>
				<div className="flex items-center justify-center pt-20">
					<div className="text-center">
						<p className="text-muted-foreground">Track not found</p>
						<button
							onClick={handleBack}
							className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Convert Spotify track data to Song format expected by SongDetail component
	const song: Song = {
		id: trackId, // Use actual Spotify track ID as string
		title: track.name,
		artist: track.artists.map((artist) => artist.name).join(", "),
		albumArt: track.album.images[0]?.url || "",
		rating: songRating, // Use real rating from database or "N/A"
		reviewCount: reviewCount, // Use real review count from database
		genres: track.artists[0]?.genres || [], // Use first artist's genres
		album: track.album.name,
		releaseDate: track.album.release_date,
		duration: formatDuration(track.duration_ms),
		spotifyUrl: track.external_urls.spotify,
		aiSummary:
			aiSummary || "AI Review Summary is not available for this song",
	};

	return (
		<div className="min-h-screen bg-[#1A1A1A] dark">
			<MiniHeader
				onBack={handleBack}
				onProfileClick={handleProfileClick}
				onSongSelect={(songId) => router.push(`/song/${songId}`)}
			/>
			<SongDetail
				song={song}
				onBack={handleBack}
				onArtistClick={handleArtistClick}
				onGenreClick={handleGenreClick}
			/>
		</div>
	);
}

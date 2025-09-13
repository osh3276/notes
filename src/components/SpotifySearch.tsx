"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Track {
	id: string;
	name: string;
	artists: Array<{
		id: string;
		name: string;
	}>;
	album: {
		id: string;
		name: string;
		images: Array<{
			url: string;
			height: number;
			width: number;
		}>;
	};
	duration_ms: number;
	popularity: number;
	preview_url: string | null;
	external_urls: {
		spotify: string;
	};
}

interface SearchResponse {
	tracks: Track[];
	total: number;
	limit: number;
	offset: number;
}

export default function SpotifySearch() {
	const { data: session, status } = useSession();
	const [query, setQuery] = useState("");
	const [tracks, setTracks] = useState<Track[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		setLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`/api/search/tracks?q=${encodeURIComponent(query)}&limit=20`,
			);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to search tracks");
			}

			setTracks(data.tracks);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	if (status === "loading") {
		return <div className="text-center p-4">Loading...</div>;
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					Spotify Track Search
				</h1>

				<form onSubmit={handleSearch} className="flex gap-4 mb-6">
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search for songs, artists, or albums..."
						className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
					/>
					<button
						type="submit"
						disabled={loading || !query.trim()}
						className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{loading ? "Searching..." : "Search"}
					</button>
				</form>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}
			</div>

			{tracks.length > 0 && (
				<div className="space-y-4">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Search Results ({tracks.length} tracks)
					</h2>

					<div className="grid gap-4">
						{tracks.map((track) => (
							<div
								key={track.id}
								className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
							>
								{track.album.images[0] && (
									<img
										src={track.album.images[0].url}
										alt={track.album.name}
										className="w-16 h-16 rounded-md object-cover"
									/>
								)}

								<div className="flex-1 min-w-0">
									<Link
										href={`/song/${track.id}`}
										className="block hover:text-green-600 transition-colors"
									>
										<h3 className="text-lg font-medium text-gray-900 truncate hover:text-green-600">
											{track.name}
										</h3>
									</Link>
									<p className="text-sm text-gray-600 truncate">
										by{" "}
										{track.artists
											.map((artist) => artist.name)
											.join(", ")}
									</p>
									<p className="text-sm text-gray-500 truncate">
										Album: {track.album.name}
									</p>
								</div>

								<div className="flex items-center space-x-4 text-sm text-gray-500">
									<span>
										{formatDuration(track.duration_ms)}
									</span>
									<div className="flex items-center space-x-2">
										<span className="text-xs bg-gray-100 px-2 py-1 rounded">
											{track.popularity}% popular
										</span>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									{track.preview_url && (
										<audio controls className="w-32">
											<source
												src={track.preview_url}
												type="audio/mpeg"
											/>
										</audio>
									)}

									<Link
										href={`/song/${track.id}`}
										className="text-blue-600 hover:text-blue-800 font-medium text-sm"
									>
										Details
									</Link>

									<a
										href={track.external_urls.spotify}
										target="_blank"
										rel="noopener noreferrer"
										className="text-green-600 hover:text-green-800 font-medium text-sm"
									>
										Spotify
									</a>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

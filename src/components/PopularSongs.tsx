import { Card, CardContent } from "./ui/card";
import { MessageSquare } from "lucide-react";
import { VinylRecordIcon } from "./VinylRecordIcon";
import { GenreTag } from "./GenreUtils";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface SpotifyRelease {
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
		release_date: string;
		total_tracks: number;
	};
	duration_ms: number;
	popularity: number;
	preview_url: string | null;
	external_urls: {
		spotify: string;
	};
	track_number: number;
}

interface Song {
	id: number;
	title: string;
	artist: string;
	albumArt: string;
	rating: number;
	reviewCount: number;
	genres: string[];
}

interface PopularSongsProps {
	onSongSelect?: (song: Song) => void;
	onGenreClick?: (genre: string) => void;
}

export function PopularSongs({
	onSongSelect,
	onGenreClick,
}: PopularSongsProps) {
	const router = useRouter();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [newReleases, setNewReleases] = useState<SpotifyRelease[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch new releases from Spotify
	useEffect(() => {
		const fetchNewReleases = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch("/api/new-releases?limit=20");
				const data = await response.json();

				if (!response.ok) {
					throw new Error(
						data.error || "Failed to fetch new releases",
					);
				}

				setNewReleases(data.releases || []);
			} catch (err) {
				console.error("Error fetching new releases:", err);
				setError(
					err instanceof Error ? err.message : "An error occurred",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchNewReleases();
	}, []);

	// Auto scroll functionality
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container || newReleases.length === 0) return;

		const scrollSpeed = 1; // pixels per frame
		let animationId: number;

		const autoScroll = () => {
			if (
				container.scrollLeft >=
				container.scrollWidth - container.clientWidth
			) {
				// Reset to beginning when we reach the end
				container.scrollLeft = 0;
			} else {
				container.scrollLeft += scrollSpeed;
			}
			animationId = requestAnimationFrame(autoScroll);
		};

		// Start auto scrolling
		animationId = requestAnimationFrame(autoScroll);

		// Pause on hover
		const handleMouseEnter = () => {
			cancelAnimationFrame(animationId);
		};

		const handleMouseLeave = () => {
			animationId = requestAnimationFrame(autoScroll);
		};

		container.addEventListener("mouseenter", handleMouseEnter);
		container.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			cancelAnimationFrame(animationId);
			container.removeEventListener("mouseenter", handleMouseEnter);
			container.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [newReleases]);

	// Convert Spotify release to Song format for legacy compatibility
	const convertToSong = (release: SpotifyRelease): Song => {
		// Generate some demo genres based on artist names (in a real app, you'd get this from Spotify)
		const demoGenres = [
			"Pop",
			"Rock",
			"Hip-Hop",
			"Electronic",
			"Indie",
			"R&B",
			"Alternative",
		];
		const randomGenres = demoGenres
			.sort(() => 0.5 - Math.random())
			.slice(0, Math.floor(Math.random() * 3) + 1);

		return {
			id:
				parseInt(release.id.slice(-6), 36) ||
				Math.floor(Math.random() * 1000000), // Convert Spotify ID to number
			title: release.name,
			artist: release.artists.map((a) => a.name).join(", "),
			albumArt: release.album.images[0]?.url || "",
			rating: 4.0 + Math.random() * 1.0, // Random rating between 4.0-5.0 for new releases
			reviewCount: Math.floor(Math.random() * 500) + 50, // Random review count for demo
			genres: randomGenres,
		};
	};

	const handleSongClick = (release: SpotifyRelease) => {
		// Navigate directly to the song page using Spotify ID
		router.push(`/song/${release.id}`);
	};

	const renderVinyls = (rating: number) => {
		const fullVinyls = Math.floor(rating);
		const hasHalfVinyl = rating % 1 !== 0;
		const emptyVinyls = 5 - fullVinyls - (hasHalfVinyl ? 1 : 0);

		return (
			<div className="flex items-center space-x-1">
				{[...Array(fullVinyls)].map((_, i) => (
					<VinylRecordIcon
						key={`full-${i}`}
						className="w-4 h-4"
						filled={true}
					/>
				))}
				{hasHalfVinyl && (
					<VinylRecordIcon
						className="w-4 h-4 opacity-50"
						filled={true}
					/>
				)}
				{[...Array(emptyVinyls)].map((_, i) => (
					<VinylRecordIcon
						key={`empty-${i}`}
						className="w-4 h-4"
						filled={false}
					/>
				))}
				<span className="text-sm text-gray-300 ml-2">
					{rating.toFixed(1)}
				</span>
			</div>
		);
	};

	if (loading) {
		return (
			<section className="py-12 px-4 bg-background/40">
				<div className="container mx-auto">
					<div className="mb-8">
						<h2 className="text-3xl text-foreground mb-2">
							New Releases
						</h2>
						<p className="text-muted-foreground">
							Latest releases from Spotify
						</p>
					</div>
					<div className="flex items-center justify-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="py-12 px-4 bg-background/40">
				<div className="container mx-auto">
					<div className="mb-8">
						<h2 className="text-3xl text-foreground mb-2">
							New Releases
						</h2>
						<p className="text-muted-foreground">
							Latest releases from Spotify
						</p>
					</div>
					<div className="text-center py-12">
						<p className="text-red-400">
							Error loading new releases: {error}
						</p>
					</div>
				</div>
			</section>
		);
	}

	if (newReleases.length === 0) {
		return (
			<section className="py-12 px-4 bg-background/40">
				<div className="container mx-auto">
					<div className="mb-8">
						<h2 className="text-3xl text-foreground mb-2">
							New Releases
						</h2>
						<p className="text-muted-foreground">
							Latest releases from Spotify
						</p>
					</div>
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							No new releases available
						</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-12 px-4 bg-background/40">
			<div className="container mx-auto">
				<div className="mb-8">
					<h2 className="text-3xl text-foreground mb-2">
						New Releases
					</h2>
					<p className="text-muted-foreground">
						Latest releases from Spotify
					</p>
				</div>

				{/* Auto-scrolling Borderless Gallery */}
				<div
					ref={scrollContainerRef}
					className="overflow-x-auto scrollbar-hide"
					style={{
						scrollbarWidth: "none",
						msOverflowStyle: "none",
						WebkitOverflowScrolling: "touch",
					}}
				>
					<div className="flex" style={{ width: "max-content" }}>
						{/* Duplicate the releases array to create seamless loop */}
						{[...newReleases, ...newReleases].map(
							(release, index) => {
								const song = convertToSong(release);
								return (
									<div
										key={`${release.id}-${index}`}
										className="flex-shrink-0 w-72"
									>
										<div
											className="bg-muted/60 hover:bg-muted/80 transition-all duration-300 cursor-pointer group h-full border-0"
											onClick={() =>
												handleSongClick(release)
											}
										>
											<div className="p-4">
												{/* Album Art - Square aspect ratio */}
												<div className="relative mb-4 overflow-hidden aspect-square">
													<img
														src={
															release.album
																.images[0]
																?.url || ""
														}
														alt={`${release.name} album art`}
														className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
													{/* New release badge */}
													<div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-semibold">
														NEW
													</div>
												</div>

												{/* Song Info */}
												<div className="space-y-2">
													<h3 className="text-foreground truncate">
														{release.name}
													</h3>
													<p className="text-muted-foreground text-sm truncate">
														{release.artists
															.map((a) => a.name)
															.join(", ")}
													</p>
													<p className="text-muted-foreground text-xs truncate">
														{release.album.name} •{" "}
														{new Date(
															release.album.release_date,
														).getFullYear()}
													</p>

													{/* Genre Tags */}
													<div className="flex flex-wrap gap-1 mb-2">
														{song.genres.map(
															(
																genre,
																genreIndex,
															) => (
																<GenreTag
																	key={
																		genreIndex
																	}
																	genre={
																		genre
																	}
																	className="text-xs px-2 py-1"
																	onClick={
																		onGenreClick
																	}
																/>
															),
														)}
													</div>

													{/* Rating */}
													<div className="flex items-center justify-between">
														{renderVinyls(
															song.rating,
														)}
													</div>

													{/* Review Count */}
													<div className="flex items-center space-x-1 text-muted-foreground text-sm">
														<MessageSquare className="w-4 h-4" />
														<span>
															{song.reviewCount.toLocaleString()}{" "}
															reviews
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							},
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

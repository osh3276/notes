import { useState, useMemo } from "react";
import {
	ArrowLeft,
	Heart,
	Filter,
	Clock,
	TrendingUp,
	PlayCircle,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

import { VinylRecordIcon } from "./VinylRecordIcon";
import { GenreTag, getGenreColor } from "./GenreUtils";

interface Song {
	id: number;
	title: string;
	artist: string;
	albumArt: string;
	rating: number;
	reviewCount: number;
	genres: string[];
	releaseDate: string;
	isLiked?: boolean;
	streams: string;
	duration: string;
}

interface GenrePageProps {
	genre: string;
	onBack: () => void;
	onSongSelect?: (song: Song) => void;
	onArtistClick?: (artistName: string) => void;
}

export function GenrePage({
	genre,
	onBack,
	onSongSelect,
	onArtistClick,
}: GenrePageProps) {
	const [sortBy, setSortBy] = useState<
		"recent" | "alltime" | "rating" | "popularity"
	>("recent");
	const [likedSongs, setLikedSongs] = useState<Set<number>>(
		new Set([2, 5, 8]),
	); // Mock liked songs

	const toggleLike = (songId: number) => {
		const newLikedSongs = new Set(likedSongs);
		if (newLikedSongs.has(songId)) {
			newLikedSongs.delete(songId);
		} else {
			newLikedSongs.add(songId);
		}
		setLikedSongs(newLikedSongs);
	};

	// Mock songs data organized by genre
	const allSongs: Song[] = [
		// Hip Hop songs
		{
			id: 1,
			title: "Golden Hour",
			artist: "DJ Supreme",
			albumArt:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
			rating: 4.8,
			reviewCount: 2341,
			genres: ["Hip Hop", "Trap"],
			releaseDate: "2024-01-15",
			streams: "15.2M",
			duration: "3:42",
		},
		{
			id: 2,
			title: "Urban Dreams",
			artist: "MC Flow",
			albumArt:
				"https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop",
			rating: 4.6,
			reviewCount: 1876,
			genres: ["Hip Hop", "Rap"],
			releaseDate: "2023-11-22",
			streams: "8.7M",
			duration: "4:01",
		},
		// Electronic songs
		{
			id: 3,
			title: "Neon Nights",
			artist: "Synth Master",
			albumArt:
				"https://images.unsplash.com/photo-1629573818825-649d1134c9ab?w=300&h=300&fit=crop",
			rating: 4.9,
			reviewCount: 3201,
			genres: ["Electronic", "Synthwave"],
			releaseDate: "2024-02-08",
			streams: "22.1M",
			duration: "5:17",
		},
		{
			id: 4,
			title: "Digital Pulse",
			artist: "Cyber Beats",
			albumArt:
				"https://images.unsplash.com/photo-1563198804-b144dfc1661c?w=300&h=300&fit=crop",
			rating: 4.7,
			reviewCount: 1567,
			genres: ["Electronic", "Techno"],
			releaseDate: "2023-09-14",
			streams: "12.4M",
			duration: "6:33",
		},
		// Pop songs
		{
			id: 5,
			title: "Summer Vibes",
			artist: "Pop Princess",
			albumArt:
				"https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
			rating: 4.5,
			reviewCount: 4567,
			genres: ["Pop", "Dance Pop"],
			releaseDate: "2024-03-01",
			streams: "45.7M",
			duration: "3:28",
		},
		{
			id: 6,
			title: "Heartbreak Hotel",
			artist: "Melody Star",
			albumArt:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
			rating: 4.3,
			reviewCount: 2890,
			genres: ["Pop", "Ballad"],
			releaseDate: "2023-12-05",
			streams: "31.2M",
			duration: "4:12",
		},
		// Rock songs
		{
			id: 7,
			title: "Thunder Road",
			artist: "Electric Storm",
			albumArt:
				"https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=300&fit=crop",
			rating: 4.8,
			reviewCount: 1234,
			genres: ["Rock", "Hard Rock"],
			releaseDate: "2024-01-20",
			streams: "9.8M",
			duration: "4:45",
		},
		{
			id: 8,
			title: "Rebel Heart",
			artist: "Punk Revival",
			albumArt:
				"https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop",
			rating: 4.6,
			reviewCount: 876,
			genres: ["Rock", "Punk Rock"],
			releaseDate: "2023-10-11",
			streams: "6.3M",
			duration: "3:19",
		},
		// Jazz songs
		{
			id: 9,
			title: "Midnight Jazz",
			artist: "Blue Note Quartet",
			albumArt:
				"https://images.unsplash.com/photo-1713771541849-7909c4a9431a?w=300&h=300&fit=crop",
			rating: 4.7,
			reviewCount: 1583,
			genres: ["Jazz", "Bebop"],
			releaseDate: "2023-08-30",
			streams: "3.2M",
			duration: "7:22",
		},
		{
			id: 10,
			title: "Smooth Operator",
			artist: "Jazz Collective",
			albumArt:
				"https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
			rating: 4.4,
			reviewCount: 967,
			genres: ["Jazz", "Smooth Jazz"],
			releaseDate: "2023-07-15",
			streams: "2.8M",
			duration: "5:41",
		},
	];

	// Filter songs by genre
	const genreSongs = useMemo(() => {
		return allSongs.filter((song) =>
			song.genres.some((g) => g.toLowerCase() === genre.toLowerCase()),
		);
	}, [genre]);

	// Sort songs based on selected criteria
	const sortedSongs = useMemo(() => {
		const songs = [...genreSongs];

		switch (sortBy) {
			case "recent":
				return songs.sort(
					(a, b) =>
						new Date(b.releaseDate).getTime() -
						new Date(a.releaseDate).getTime(),
				);
			case "alltime":
				return songs.sort((a, b) => b.reviewCount - a.reviewCount);
			case "rating":
				return songs.sort((a, b) => b.rating - a.rating);
			case "popularity":
				return songs.sort((a, b) => {
					const aStreams = parseFloat(a.streams.replace("M", ""));
					const bStreams = parseFloat(b.streams.replace("M", ""));
					return bStreams - aStreams;
				});
			default:
				return songs;
		}
	}, [genreSongs, sortBy]);

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
			</div>
		);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const getSortIcon = () => {
		switch (sortBy) {
			case "recent":
				return <Clock className="w-4 h-4" />;
			case "rating":
				return <VinylRecordIcon className="w-4 h-4" filled={true} />;
			case "popularity":
				return <TrendingUp className="w-4 h-4" />;
			default:
				return <Filter className="w-4 h-4" />;
		}
	};

	return (
		<div className="min-h-screen bg-gray-900">
			{/* Header */}
			<div className="bg-black/60 backdrop-blur-sm border-b border-gray-800">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Button
							variant="ghost"
							onClick={onBack}
							className="text-white hover:bg-white/10 flex items-center space-x-2"
						>
							<ArrowLeft className="w-4 h-4" />
							<span>Back</span>
						</Button>

						<div className="flex items-center space-x-4">
							<span className="text-gray-400 text-sm">
								Sort by:
							</span>
							<Select
								value={sortBy}
								onValueChange={(value: any) => setSortBy(value)}
							>
								<SelectTrigger className="w-40 bg-gray-800/50 border-gray-700 text-white">
									<div className="flex items-center space-x-2">
										{getSortIcon()}
										<SelectValue />
									</div>
								</SelectTrigger>
								<SelectContent className="bg-gray-800 border-gray-700">
									<SelectItem
										value="recent"
										className="text-white hover:bg-gray-700"
									>
										<div className="flex items-center space-x-2">
											<Clock className="w-4 h-4" />
											<span>Recent Releases</span>
										</div>
									</SelectItem>
									<SelectItem
										value="alltime"
										className="text-white hover:bg-gray-700"
									>
										<div className="flex items-center space-x-2">
											<Filter className="w-4 h-4" />
											<span>All Time Popular</span>
										</div>
									</SelectItem>
									<SelectItem
										value="rating"
										className="text-white hover:bg-gray-700"
									>
										<div className="flex items-center space-x-2">
											<VinylRecordIcon
												className="w-4 h-4"
												filled={true}
											/>
											<span>Highest Rated</span>
										</div>
									</SelectItem>
									<SelectItem
										value="popularity"
										className="text-white hover:bg-gray-700"
									>
										<div className="flex items-center space-x-2">
											<TrendingUp className="w-4 h-4" />
											<span>Most Streamed</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</div>

			{/* Genre Header */}
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center space-x-4 mb-2">
					<GenreTag genre={genre} className="text-lg px-4 py-2" />
					<Badge className="bg-gray-700 text-gray-300">
						{sortedSongs.length} songs
					</Badge>
				</div>
				<p className="text-gray-400">
					{sortBy === "recent"
						? "Latest releases"
						: sortBy === "alltime"
							? "Most reviewed songs"
							: sortBy === "rating"
								? "Highest rated tracks"
								: "Most streamed hits"}{" "}
					in {genre}
				</p>
			</div>

			{/* Songs List */}
			<div className="container mx-auto px-4 pb-8">
				{sortedSongs.length === 0 ? (
					<Card className="bg-gray-800/40 border-gray-700/50">
						<CardContent className="p-8 text-center">
							<div className="text-gray-500 mb-4">
								<svg
									className="w-16 h-16 mx-auto mb-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1}
										d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
									/>
								</svg>
							</div>
							<h3 className="text-white mb-2">No songs found</h3>
							<p className="text-gray-400">
								We couldn't find any songs in the {genre} genre.
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-4">
						{sortedSongs.map((song, index) => {
							const isLiked = likedSongs.has(song.id);
							return (
								<Card
									key={song.id}
									className={`
                    ${isLiked ? "bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-500/30" : "bg-gray-800/40 border-gray-700/50"}
                    hover:bg-gray-800/60 transition-all duration-300 cursor-pointer group
                  `}
								>
									<CardContent className="p-6">
										<div className="flex items-center space-x-4">
											{/* Rank/Play Button */}
											<div className="flex items-center justify-center w-8">
												<span className="text-gray-400 text-sm group-hover:hidden">
													{index + 1}
												</span>
												<Button
													variant="ghost"
													size="icon"
													className="hidden group-hover:flex text-gray-400 hover:text-white w-8 h-8"
													onClick={(e: any) => {
														e.stopPropagation();
														// Play functionality would go here
													}}
												>
													<PlayCircle className="w-5 h-5" />
												</Button>
											</div>

											{/* Album Art */}
											<div
												className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer"
												onClick={() =>
													onSongSelect?.(song)
												}
											>
												<img
													src={song.albumArt}
													alt={`${song.title} album art`}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											</div>

											{/* Song Info */}
											<div className="flex-1 min-w-0">
												<div className="flex items-center space-x-2 mb-1">
													<h4
														className="text-white hover:text-purple-300 transition-colors cursor-pointer truncate"
														onClick={() =>
															onSongSelect?.(song)
														}
													>
														{song.title}
													</h4>
													{isLiked && (
														<Heart className="w-4 h-4 text-pink-500 fill-current flex-shrink-0" />
													)}
												</div>
												<button
													onClick={() =>
														onArtistClick?.(
															song.artist,
														)
													}
													className="text-gray-400 hover:text-gray-300 text-sm transition-colors cursor-pointer truncate block"
												>
													{song.artist}
												</button>
											</div>

											{/* Genre Tags */}
											<div className="hidden md:flex flex-wrap gap-1 max-w-xs">
												{song.genres
													.slice(0, 2)
													.map((g, idx) => (
														<GenreTag
															key={idx}
															genre={g}
															className="text-xs px-2 py-1"
														/>
													))}
											</div>

											{/* Rating */}
											<div className="text-center min-w-0">
												<div className="flex items-center justify-center mb-1">
													{renderVinyls(song.rating)}
												</div>
												<span className="text-gray-400 text-xs">
													{song.rating}
												</span>
											</div>

											{/* Stats */}
											<div className="text-right min-w-0 hidden lg:block">
												<p className="text-gray-400 text-sm">
													{song.streams}
												</p>
												<p className="text-gray-500 text-xs">
													{formatDate(
														song.releaseDate,
													)}
												</p>
											</div>

											{/* Duration */}
											<div className="text-gray-400 text-sm min-w-0">
												{song.duration}
											</div>

											{/* Like Button */}
											<Button
												variant="ghost"
												size="icon"
												onClick={(e: any) => {
													e.stopPropagation();
													toggleLike(song.id);
												}}
												className={`
                          ${isLiked ? "text-pink-500 hover:text-pink-400" : "text-gray-400 hover:text-pink-500"}
                          transition-colors
                        `}
											>
												<Heart
													className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
												/>
											</Button>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

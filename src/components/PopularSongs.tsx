import { Card, CardContent } from "./ui/card";
import { MessageSquare } from "lucide-react";

import { VinylRecordIcon } from "./VinylRecordIcon";
import { GenreTag } from "./GenreUtils";
import { useEffect, useRef } from "react";

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
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Auto scroll functionality
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

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
	}, []);

	const popularSongs: Song[] = [
		{
			id: 1,
			title: "Midnight Reflections",
			artist: "Luna Eclipse",
			albumArt:
				"https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWwlMjByZWNvcmR8ZW58MXx8fHwxNzU3NzE2MDU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			rating: 4.8,
			reviewCount: 1247,
			genres: ["Ambient", "Indie"],
		},
		{
			id: 2,
			title: "Neon Dreams",
			artist: "Synth Wave",
			albumArt:
				"https://images.unsplash.com/photo-1562712558-ac2eaab4a3b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwYXJ0d29ya3xlbnwxfHx8fDE3NTc3Mzc2OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			rating: 4.6,
			reviewCount: 892,
			genres: ["Synthwave", "Electronic"],
		},
		{
			id: 3,
			title: "Vintage Vibes",
			artist: "Retro Collective",
			albumArt:
				"https://images.unsplash.com/photo-1622573502059-c20fd67aa5db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGNhc3NldHRlJTIwdGFwZXxlbnwxfHx8fDE3NTc3MTY1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			rating: 4.9,
			reviewCount: 2156,
			genres: ["Lo-Fi", "Chillhop"],
		},
		{
			id: 4,
			title: "Jazz at Midnight",
			artist: "Blue Note Quartet",
			albumArt:
				"https://images.unsplash.com/photo-1713771541849-7909c4a9431a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWMlMjBhbGJ1bXxlbnwxfHx8fDE3NTc3Mzc2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			rating: 4.7,
			reviewCount: 1583,
			genres: ["Jazz", "Bebop"],
		},
		{
			id: 5,
			title: "Electric Pulse",
			artist: "Digital Horizon",
			albumArt:
				"https://images.unsplash.com/photo-1629573818825-649d1134c9ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjB0dXJudGFibGV8ZW58MXx8fHwxNzU3NzM3NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			rating: 4.5,
			reviewCount: 734,
			genres: ["Techno", "House"],
		},
		{
			id: 6,
			title: "Rock Revolution",
			artist: "Thunder Strike",
			albumArt:
				"https://images.unsplash.com/photo-1631786170318-ef467b60ef9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzU3NzM3NzAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			rating: 4.4,
			reviewCount: 1092,
			genres: ["Alternative", "Rock"],
		},
		{
			id: 7,
			title: "Acoustic Soul",
			artist: "River Valley",
			albumArt:
				"https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWwlMjByZWNvcmR8ZW58MXx8fHwxNzU3NzE2MDU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			rating: 4.6,
			reviewCount: 956,
			genres: ["Folk", "Acoustic"],
		},
	];

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
				<span className="text-sm text-gray-300 ml-2">{rating}</span>
			</div>
		);
	};

	return (
		<section className="py-12 px-4 bg-background/40">
			<div className="container mx-auto">
				<div className="mb-8">
					<h2 className="text-3xl text-foreground mb-2">
						Popular This Week
					</h2>
					<p className="text-muted-foreground">
						Trending songs based on reviews and community engagement
					</p>
				</div>

				{/* Auto-scrolling Borderless Gallery */}
				<div
					ref={scrollContainerRef}
					className="overflow-x-auto scrollbar-hide"
				>
					<div className="flex" style={{ width: "max-content" }}>
						{/* Duplicate the songs array to create seamless loop */}
						{[...popularSongs, ...popularSongs].map(
							(song, index) => (
								<div
									key={`${song.id}-${index}`}
									className="flex-shrink-0 w-72"
								>
									<div
										className="bg-muted/60 hover:bg-muted/80 transition-all duration-300 cursor-pointer group h-full border-0"
										onClick={() => onSongSelect?.(song)}
									>
										<div className="p-4">
											{/* Album Art - Square aspect ratio */}
											<div className="relative mb-4 overflow-hidden aspect-square">
												<img
													src={song.albumArt}
													alt={`${song.title} album art`}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
											</div>

											{/* Song Info */}
											<div className="space-y-2">
												<h3 className="text-foreground truncate">
													{song.title}
												</h3>
												<p className="text-muted-foreground text-sm truncate">
													{song.artist}
												</p>

												{/* Genre Tags */}
												<div className="flex flex-wrap gap-1 mb-2">
													{song.genres.map(
														(genre, index) => (
															<GenreTag
																key={index}
																genre={genre}
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
													{renderVinyls(song.rating)}
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
							))}
					</div>
				</div>
			</div>
		</section>
	);
}

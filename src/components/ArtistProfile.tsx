import { useState } from "react";
import {
	ArrowLeft,
	Heart,
	MessageSquare,
	Share2,
	PlayCircle,
	Calendar,
	MapPin,
	Users,
	Music,
	Star,
	Award,
	Headphones,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

import { VinylRecordIcon } from "./VinylRecordIcon";
import { GenreTag } from "./GenreUtils";

interface ArtistProfileProps {
	artistName: string;
	onBack: () => void;
	onGenreClick?: (genre: string) => void;
}

export function ArtistProfile({
	artistName,
	onBack,
	onGenreClick,
}: ArtistProfileProps) {
	const [isFollowing, setIsFollowing] = useState(false);

	// Mock artist data
	const artistData = {
		name: artistName,
		realName: "Alexander James Rodriguez",
		avatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=face",
		coverImage:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=300&fit=crop",
		bio: "Multi-platinum recording artist and producer known for blending electronic elements with organic instrumentation. Winner of 3 Grammy Awards and collaborator with some of the biggest names in music.",
		location: "Nashville, TN",
		founded: "2018",
		genres: ["Pop", "Electronic", "Indie Rock", "R&B"],
		stats: {
			monthlyListeners: 12500000,
			followers: 8240000,
			songs: 67,
			albums: 4,
		},
		socialStats: {
			instagram: "2.1M",
			twitter: "890K",
			youtube: "3.4M",
		},
		achievements: ["Grammy Winner", "Platinum Artist", "Chart Topper"],
		isVerified: true,
	};

	const topSongs = [
		{
			id: 1,
			title: "Watermelon Sugar",
			album: "Fine Line",
			streams: "1.2B",
			rating: 4.8,
			duration: "2:54",
		},
		{
			id: 2,
			title: "Golden",
			album: "Fine Line",
			streams: "890M",
			rating: 4.6,
			duration: "3:28",
		},
		{
			id: 3,
			title: "Adore You",
			album: "Fine Line",
			streams: "1.1B",
			rating: 4.7,
			duration: "3:27",
		},
		{
			id: 4,
			title: "Falling",
			album: "Fine Line",
			streams: "756M",
			rating: 4.9,
			duration: "4:00",
		},
	];

	const albums = [
		{
			id: 1,
			title: "Fine Line",
			year: "2019",
			cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
			rating: 4.7,
			tracks: 12,
		},
		{
			id: 2,
			title: "Harry Styles",
			year: "2017",
			cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop",
			rating: 4.5,
			tracks: 10,
		},
		{
			id: 3,
			title: "Harry's House",
			year: "2022",
			cover: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=300&fit=crop",
			rating: 4.8,
			tracks: 13,
		},
	];

	const renderVinyls = (rating: number) => {
		return (
			<div className="flex items-center space-x-1">
				{[...Array(5)].map((_, i) => (
					<VinylRecordIcon
						key={i}
						className="w-4 h-4"
						filled={i < Math.floor(rating)}
					/>
				))}
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-900">
			{/* Header with back button */}
			<div className="bg-black/60 backdrop-blur-sm border-b border-gray-800">
				<div className="container mx-auto px-4 py-4">
					<Button
						variant="ghost"
						onClick={onBack}
						className="text-white hover:bg-white/10 flex items-center space-x-2"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>Back</span>
					</Button>
				</div>
			</div>

			{/* Artist Header */}
			<div className="relative">
				{/* Cover Image */}
				<div className="h-64 md:h-80 bg-gradient-to-r from-purple-900/50 to-pink-900/50 relative overflow-hidden">
					<img
						src={artistData.coverImage}
						alt={`${artistData.name} cover`}
						className="w-full h-full object-cover opacity-60"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
				</div>

				{/* Artist Info */}
				<div className="container mx-auto px-4 relative -mt-20 md:-mt-24">
					<div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
						{/* Artist Picture */}
						<div className="relative">
							<div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800">
								<img
									src={artistData.avatar}
									alt={artistData.name}
									className="w-full h-full object-cover"
								/>
							</div>
							{artistData.isVerified && (
								<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
									<Badge className="bg-blue-600 text-white border-2 border-gray-900">
										<Award className="w-3 h-3 mr-1" />
										Verified Artist
									</Badge>
								</div>
							)}
						</div>

						{/* Artist Info */}
						<div className="flex-1 min-w-0">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between">
								<div>
									<h1 className="text-3xl md:text-4xl text-white mb-2">
										{artistData.name}
									</h1>
									<p className="text-gray-400 mb-4">
										{artistData.realName}
									</p>

									{/* Achievements */}
									<div className="flex flex-wrap gap-2 mb-4">
										{artistData.achievements.map(
											(achievement, index) => (
												<Badge
													key={index}
													className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
												>
													<Star className="w-3 h-3 mr-1 fill-current" />
													{achievement}
												</Badge>
											),
										)}
									</div>

									{/* Genres */}
									<div className="flex flex-wrap gap-2 mb-6">
										{artistData.genres.map(
											(genre, index) => (
												<GenreTag
													key={index}
													genre={genre}
													onClick={onGenreClick}
												/>
											),
										)}
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex items-center space-x-3">
									<Button
										onClick={() =>
											setIsFollowing(!isFollowing)
										}
										className={`${
											isFollowing
												? "bg-gray-600 hover:bg-gray-700 text-white"
												: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
										}`}
									>
										{isFollowing ? "Following" : "Follow"}
									</Button>
									<Button
										variant="outline"
										className="border-gray-600 text-gray-300 hover:bg-gray-800"
									>
										<Share2 className="w-4 h-4 mr-2" />
										Share
									</Button>
								</div>
							</div>

							<p className="text-gray-300 mb-6 max-w-3xl leading-relaxed">
								{artistData.bio}
							</p>

							{/* Stats Grid */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
								<div className="text-center">
									<p className="text-white text-xl">
										{artistData.stats.monthlyListeners.toLocaleString()}
									</p>
									<p className="text-gray-400 text-sm">
										Monthly Listeners
									</p>
								</div>
								<div className="text-center">
									<p className="text-white text-xl">
										{artistData.stats.followers.toLocaleString()}
									</p>
									<p className="text-gray-400 text-sm">
										Followers
									</p>
								</div>
								<div className="text-center">
									<p className="text-white text-xl">
										{artistData.stats.songs}
									</p>
									<p className="text-gray-400 text-sm">
										Songs
									</p>
								</div>
								<div className="text-center">
									<p className="text-white text-xl">
										{artistData.stats.albums}
									</p>
									<p className="text-gray-400 text-sm">
										Albums
									</p>
								</div>
							</div>

							{/* Meta Info */}
							<div className="flex items-center space-x-6 text-gray-400 text-sm">
								<div className="flex items-center space-x-1">
									<Calendar className="w-4 h-4" />
									<span>
										Active since {artistData.founded}
									</span>
								</div>
								<div className="flex items-center space-x-1">
									<MapPin className="w-4 h-4" />
									<span>{artistData.location}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Artist Content */}
			<div className="container mx-auto px-4 py-8">
				<Tabs defaultValue="songs" className="w-full">
					<TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
						<TabsTrigger
							value="songs"
							className="data-[state=active]:bg-purple-600"
						>
							Top Songs
						</TabsTrigger>
						<TabsTrigger
							value="albums"
							className="data-[state=active]:bg-purple-600"
						>
							Albums
						</TabsTrigger>
						<TabsTrigger
							value="about"
							className="data-[state=active]:bg-purple-600"
						>
							About
						</TabsTrigger>
						<TabsTrigger
							value="similar"
							className="data-[state=active]:bg-purple-600"
						>
							Similar Artists
						</TabsTrigger>
					</TabsList>

					<TabsContent value="songs" className="space-y-6 mt-6">
						<div className="flex items-center justify-between">
							<h3 className="text-white">Popular Songs</h3>
							<Button
								variant="outline"
								size="sm"
								className="border-purple-600/50 text-purple-300 hover:bg-purple-800/20"
							>
								<PlayCircle className="w-4 h-4 mr-2" />
								Play All
							</Button>
						</div>

						<div className="space-y-2">
							{topSongs.map((song, index) => (
								<Card
									key={song.id}
									className="bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300"
								>
									<CardContent className="p-4">
										<div className="flex items-center space-x-4">
											<span className="text-gray-400 text-sm w-6">
												{index + 1}
											</span>
											<Button
												variant="ghost"
												size="icon"
												className="text-gray-400 hover:text-white"
											>
												<PlayCircle className="w-5 h-5" />
											</Button>
											<div className="flex-1">
												<h4 className="text-white">
													{song.title}
												</h4>
												<p className="text-gray-400 text-sm">
													{song.album}
												</p>
											</div>
											<div className="text-right">
												<div className="flex items-center space-x-2 mb-1">
													{renderVinyls(song.rating)}
													<span className="text-gray-400 text-sm">
														{song.rating}
													</span>
												</div>
												<p className="text-gray-500 text-xs">
													{song.streams} streams
												</p>
											</div>
											<span className="text-gray-400 text-sm">
												{song.duration}
											</span>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="albums" className="space-y-6 mt-6">
						<div className="flex items-center justify-between">
							<h3 className="text-white">Discography</h3>
							<Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
								{artistData.stats.albums} Albums
							</Badge>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{albums.map((album) => (
								<Card
									key={album.id}
									className="bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 cursor-pointer"
								>
									<CardContent className="p-0">
										<div className="aspect-square relative group">
											<img
												src={album.cover}
												alt={`${album.title} cover`}
												className="w-full h-full object-cover rounded-t-lg"
											/>
											<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
												<PlayCircle className="w-12 h-12 text-white/80" />
											</div>
										</div>
										<div className="p-4">
											<h4 className="text-white mb-1">
												{album.title}
											</h4>
											<p className="text-gray-400 text-sm mb-2">
												{album.year} • {album.tracks}{" "}
												tracks
											</p>
											<div className="flex items-center space-x-2">
												{renderVinyls(album.rating)}
												<span className="text-gray-400 text-sm">
													{album.rating}
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="about" className="space-y-6 mt-6">
						<Card className="bg-gray-800/40 border-gray-700/50">
							<CardContent className="p-6">
								<h3 className="text-white mb-4">
									About {artistData.name}
								</h3>
								<p className="text-gray-300 leading-relaxed mb-6">
									{artistData.bio}
								</p>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<h4 className="text-white mb-3">
											Career Highlights
										</h4>
										<div className="space-y-2">
											{artistData.achievements.map(
												(achievement, index) => (
													<div
														key={index}
														className="flex items-center space-x-2"
													>
														<Star className="w-4 h-4 text-yellow-500 fill-current" />
														<span className="text-gray-300">
															{achievement}
														</span>
													</div>
												),
											)}
										</div>
									</div>

									<div>
										<h4 className="text-white mb-3">
											Social Media
										</h4>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-gray-400">
													Instagram
												</span>
												<span className="text-white">
													{
														artistData.socialStats
															.instagram
													}{" "}
													followers
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-400">
													Twitter
												</span>
												<span className="text-white">
													{
														artistData.socialStats
															.twitter
													}{" "}
													followers
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-400">
													YouTube
												</span>
												<span className="text-white">
													{
														artistData.socialStats
															.youtube
													}{" "}
													subscribers
												</span>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="similar" className="space-y-6 mt-6">
						<Card className="bg-gray-800/40 border-gray-700/50">
							<CardContent className="p-6 text-center">
								<Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
								<h4 className="text-white mb-2">
									Similar Artists
								</h4>
								<p className="text-gray-400">
									Discover artists with similar styles and
									sounds
								</p>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

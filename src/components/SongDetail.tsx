import { useState, useEffect } from "react";
import {
	ArrowLeft,
	MessageSquare,
	Heart,
	Share2,
	PlayCircle,
	CheckCircle,
	Sparkles,
	TrendingUp,
	Users,
	Star,
	Pause,
	SkipBack,
	SkipForward,
	Volume2,
	Plus,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

import { VinylRecordIcon } from "./VinylRecordIcon";
import { GenreTag } from "./GenreUtils";
import { Textarea } from "./ui/textarea";

interface Song {
	id: number;
	title: string;
	artist: string;
	albumArt: string;
	rating: number;
	reviewCount: number;
	genres: string[];
	album?: string;
	releaseDate?: string;
	duration?: string;
}

interface Review {
	id: number;
	userName: string;
	userAvatar?: string;
	rating: number;
	reviewText: string;
	timeAgo: string;
	likes: number;
	isLiked?: boolean;
	isCritic?: boolean;
	publication?: string;
	isSuperfan?: boolean;
}

interface SongDetailProps {
	song: Song;
	onBack: () => void;
	onArtistClick?: (artistName: string) => void;
	onGenreClick?: (genre: string) => void;
}

export function SongDetail({
	song,
	onBack,
	onArtistClick,
	onGenreClick,
}: SongDetailProps) {
	const [isFavorited, setIsFavorited] = useState(false);
	const [reviewText, setReviewText] = useState("");
	const [userRating, setUserRating] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration] = useState(263); // 4:23 in seconds
	const [nowPlayingComments, setNowPlayingComments] = useState([
		{
			id: 1,
			user: "MusicLover99",
			text: "This track is absolutely incredible! The production quality is top-notch.",
			time: "2 minutes ago",
			avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
			likes: 15,
		},
		{
			id: 2,
			user: "BeatHead",
			text: "Can't stop listening to this. The beat is so addictive!",
			time: "5 minutes ago",
			avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
			likes: 8,
		},
		{
			id: 3,
			user: "AudioPhile",
			text: "The mixing on this track is perfection. Every element has its place.",
			time: "10 minutes ago",
			avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
			likes: 23,
		},
		{
			id: 4,
			user: "SoundWave23",
			text: "This is going straight to my favorites playlist!",
			time: "15 minutes ago",
			avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
			likes: 12,
		},
		{
			id: 5,
			user: "VinylCollector",
			text: "Reminds me of the golden age of this genre. Fantastic work!",
			time: "20 minutes ago",
			avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
			likes: 19,
		},
	]);
	const [newComment, setNewComment] = useState("");

	const criticReviews: Review[] = [
		{
			id: 1,
			userName: "Anthony Fantano",
			userAvatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
			rating: 5,
			reviewText:
				"This track represents a significant evolution in the artist's sound palette. The production choices here are incredibly deliberate - every layer serves a purpose in building the song's emotional architecture. The way dynamics are employed throughout creates moments of genuine tension and release that feel earned rather than manufactured. The lyrical content demonstrates a maturity that wasn't present in earlier work, tackling complex themes with nuance and authenticity.",
			timeAgo: "1 day ago",
			likes: 234,
			isLiked: false,
			isCritic: true,
			publication: "The Needle Drop",
		},
		{
			id: 2,
			userName: "Pitchfork Staff",
			userAvatar:
				"https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
			rating: 4,
			reviewText:
				"A compelling entry that showcases technical proficiency without sacrificing emotional resonance. The artist demonstrates an understanding of contemporary production trends while maintaining their distinctive voice. The arrangement builds with purpose, creating space for each element to breathe. While some moments feel slightly overproduced, the overall composition succeeds in its ambitious scope.",
			timeAgo: "2 days ago",
			likes: 189,
			isLiked: true,
			isCritic: true,
			publication: "Pitchfork",
		},
		{
			id: 3,
			userName: "Rolling Stone",
			userAvatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
			rating: 5,
			reviewText:
				"This is the kind of track that reminds you why you fell in love with music in the first place. The songwriting is impeccable - every verse builds naturally into a chorus that feels both inevitable and surprising. The production values are pristine, with each instrument occupying its own sonic space while contributing to a cohesive whole. A standout piece that will likely define the artist's career trajectory.",
			timeAgo: "3 days ago",
			likes: 312,
			isLiked: false,
			isCritic: true,
			publication: "Rolling Stone",
		},
	];

	const communityReviews: Review[] = [
		// SUPERFAN Reviews
		{
			id: 4,
			userName: "MusicLover92",
			userAvatar:
				"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
			rating: 5,
			reviewText:
				"This track absolutely blew me away! The production quality is incredible and the emotional depth in the lyrics really resonates. The way the artist builds tension throughout the song and then releases it in that incredible bridge section is pure artistry. The instrumentation is layered perfectly, with each element serving a purpose without cluttering the mix. Been on repeat for days now and I discover something new with each listen. Definitely one of the best releases this year.",
			timeAgo: "2 hours ago",
			likes: 127,
			isLiked: false,
			isCritic: false,
			isSuperfan: true,
		},
		{
			id: 5,
			userName: "VinylCollector",
			userAvatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
			rating: 4,
			reviewText:
				"Great track with solid production values. The retro influences are clear but it doesn't feel derivative - the artist has put their own spin on classic sounds. The vocals are particularly strong, with great range and emotional delivery. My only minor critique is that the outro feels a bit rushed, could have used another 30 seconds to properly resolve. Still, a very enjoyable listen that I'll definitely be adding to my playlists.",
			timeAgo: "5 hours ago",
			likes: 89,
			isLiked: true,
			isCritic: false,
			isSuperfan: true,
		},
		// Regular Reviews
		{
			id: 6,
			userName: "AudioFan23",
			rating: 5,
			reviewText:
				"Incredible song! The production is clean and the melody is so catchy. Can't stop listening to it.",
			timeAgo: "1 day ago",
			likes: 34,
			isLiked: false,
			isCritic: false,
			isSuperfan: false,
		},
		{
			id: 7,
			userName: "GenreExplorer",
			rating: 4,
			reviewText:
				"Really solid track with great genre fusion. Love how they blend different styles seamlessly.",
			timeAgo: "2 days ago",
			likes: 18,
			isLiked: false,
			isCritic: false,
			isSuperfan: false,
		},
		{
			id: 8,
			userName: "MelodyMaven",
			userAvatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
			rating: 5,
			reviewText:
				"The melody in this song is absolutely infectious! It's been stuck in my head for days and I'm not complaining. The chord progressions are sophisticated without being pretentious, and the hook is perfectly crafted. You can tell the songwriter really understands how to create memorable musical moments. This is the kind of song that will still sound fresh years from now.",
			timeAgo: "3 days ago",
			likes: 156,
			isLiked: true,
			isCritic: false,
			isSuperfan: true,
		},
		{
			id: 9,
			userName: "CasualListener",
			rating: 4,
			reviewText:
				"Pretty good song. Nice beat and the vocals are smooth. Would recommend!",
			timeAgo: "4 days ago",
			likes: 12,
			isLiked: false,
			isCritic: false,
			isSuperfan: false,
		},
		{
			id: 10,
			userName: "MusicDiscovery",
			rating: 3,
			reviewText:
				"It's okay. Not bad but nothing too special. Decent for background music.",
			timeAgo: "5 days ago",
			likes: 7,
			isLiked: false,
			isCritic: false,
			isSuperfan: false,
		},
	];

	const renderVinyls = (rating: number) => {
		return (
			<div className="flex items-center space-x-1">
				{[...Array(5)].map((_, i) => (
					<VinylRecordIcon
						key={i}
						className="w-5 h-5"
						filled={i < rating}
					/>
				))}
			</div>
		);
	};

	const renderSmallVinyls = (rating: number) => {
		return (
			<div className="flex items-center space-x-1">
				{[...Array(5)].map((_, i) => (
					<VinylRecordIcon
						key={i}
						className="w-4 h-4"
						filled={i < rating}
					/>
				))}
			</div>
		);
	};

	// Generate waveform data to match SoundCloud style
	const generateWaveform = () => {
		const points = 800; // More points for detailed waveform
		return Array.from({ length: points }, (_, i) => {
			const progress = i / points;
			// Create more realistic audio waveform pattern
			const bass = Math.sin(progress * Math.PI * 4) * 0.3;
			const mid = Math.sin(progress * Math.PI * 12) * 0.4;
			const high = Math.sin(progress * Math.PI * 20) * 0.2;
			const randomVariation = (Math.random() - 0.5) * 0.6;
			const combined = bass + mid + high + randomVariation;
			return Math.max(0.1, Math.min(1, Math.abs(combined) + 0.2));
		});
	};

	const waveformData = generateWaveform();

	// Format time display
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Auto-advance playback simulation
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isPlaying) {
			interval = setInterval(() => {
				setCurrentTime((prev) => {
					if (prev >= duration) {
						setIsPlaying(false);
						return 0;
					}
					return prev + 1;
				});
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isPlaying, duration]);

	const handlePlayToggle = () => {
		setIsPlaying(!isPlaying);
	};

	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const newTime = (clickX / rect.width) * duration;
		setCurrentTime(newTime);
	};

	const formatTimeForWaveform = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header with back button */}
			<div className="bg-background/60 backdrop-blur-sm border-b border-border">
				<div className="container mx-auto px-4 py-4">
					<Button
						variant="ghost"
						onClick={onBack}
						className="text-foreground hover:bg-accent/10 flex items-center space-x-2"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>Back to Home</span>
					</Button>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				{/* Song Header Section */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
					{/* Album Art */}
					<div className="lg:col-span-1">
						<div className="relative group">
							<img
								src={song.albumArt}
								alt={`${song.title} album art`}
								className="w-full aspect-square object-cover shadow-2xl"
							/>
							<div
								className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
								onClick={handlePlayToggle}
							>
								<PlayCircle className="w-16 h-16 text-accent/80" />
							</div>
						</div>
					</div>

					{/* Song Information */}
					<div className="lg:col-span-2 space-y-6">
						<div>
							<h1 className="text-4xl lg:text-5xl text-foreground mb-2">
								{song.title}
							</h1>
							<div className="flex items-center space-x-3 mb-4">
								<span className="text-muted-foreground">
									by
								</span>
								<button
									onClick={() => onArtistClick?.(song.artist)}
									className="flex items-center space-x-3 hover:bg-muted/50 p-2 transition-all duration-300 group"
								>
									<div className="w-10 h-10 overflow-hidden border-2 border-muted-foreground group-hover:border-accent transition-colors">
										<img
											src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop&crop=face"
											alt={`${song.artist} headshot`}
											className="w-full h-full object-cover"
										/>
									</div>
									<span className="text-accent hover:text-accent/80 transition-colors">
										{song.artist}
									</span>
								</button>
							</div>

							{/* Genre Tags */}
							<div className="flex flex-wrap gap-2 mb-6">
								{song.genres.map((genre, index) => (
									<GenreTag
										key={index}
										genre={genre}
										onClick={onGenreClick}
									/>
								))}
							</div>

							{/* Rating and Stats */}
							<div className="bg-muted/60 p-6 mb-6">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="text-center">
										<div className="flex justify-center mb-2">
											{renderVinyls(
												Math.floor(song.rating),
											)}
										</div>
										<p className="text-2xl text-foreground mb-1">
											{song.rating}
										</p>
										<p className="text-muted-foreground text-sm">
											Overall Rating
										</p>
									</div>
									<div className="text-center">
										<p className="text-2xl text-foreground mb-1">
											{song.reviewCount.toLocaleString()}
										</p>
										<p className="text-muted-foreground text-sm">
											Total Reviews
										</p>
									</div>
									<div className="text-center">
										<p className="text-2xl text-foreground mb-1">
											4:23
										</p>
										<p className="text-muted-foreground text-sm">
											Duration
										</p>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-3">
								<Button
									onClick={() => setIsFavorited(!isFavorited)}
									variant="outline"
									size="icon"
									className={`border-border hover:bg-muted transition-all duration-300 ${
										isFavorited
											? "bg-accent border-transparent"
											: "text-muted-foreground hover:text-foreground"
									}`}
								>
									<Heart
										className={`w-5 h-5 ${isFavorited ? "fill-current text-accent-foreground" : ""}`}
									/>
								</Button>
								<Button
									variant="outline"
									className="border-border text-muted-foreground hover:bg-muted"
								>
									<Share2 className="w-4 h-4 mr-2" />
									Share
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* AI Summary Section */}
				<div className="space-y-6">
					<Card className="bg-muted/30 border-accent/30 relative overflow-hidden">
						<div className="absolute inset-0 bg-accent/5"></div>
						<CardContent className="p-6 relative">
							<div className="flex items-center space-x-3 mb-4">
								<div className="flex items-center justify-center w-10 h-10 bg-accent">
									<Sparkles className="w-5 h-5 text-accent-foreground" />
								</div>
								<div>
									<h3 className="text-foreground">
										AI Review Summary
									</h3>
									<p className="text-accent text-sm">
										Powered by MusicCritic Intelligence
									</p>
								</div>
								<Badge className="bg-accent/30 text-accent border-accent/50 ml-auto">
									Beta
								</Badge>
							</div>

							<div className="space-y-4">
								{/* Overall Sentiment */}
								<div className="bg-muted/50 p-4 border border-accent/20">
									<div className="flex items-center space-x-2 mb-3">
										<TrendingUp className="w-4 h-4 text-accent" />
										<span className="text-accent">
											Overall Sentiment: Highly Positive
										</span>
									</div>
									<p className="text-muted-foreground leading-relaxed">
										Critics and fans are unanimous in their
										praise for this track. The consensus
										highlights exceptional production
										quality, emotional depth, and
										sophisticated songwriting. Both
										professional reviewers and the community
										emphasize the artist's growth and
										technical mastery, with particular
										acclaim for the dynamic arrangement and
										memorable melodic hooks.
									</p>
								</div>

								{/* Key Themes */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="bg-muted/50 p-4 border border-accent/20">
										<div className="flex items-center space-x-2 mb-2">
											<div className="w-2 h-2 bg-accent"></div>
											<span className="text-accent">
												Production Quality
											</span>
										</div>
										<p className="text-muted-foreground text-sm">
											Consistently praised for pristine
											mixing, clear instrumentation, and
											dynamic range preservation.
										</p>
									</div>

									<div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
										<div className="flex items-center space-x-2 mb-2">
											<div className="w-2 h-2 bg-pink-400 rounded-full"></div>
											<span className="text-pink-300">
												Emotional Impact
											</span>
										</div>
										<p className="text-gray-400 text-sm">
											Noted for its ability to create
											genuine emotional resonance and
											memorable musical moments.
										</p>
									</div>

									<div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
										<div className="flex items-center space-x-2 mb-2">
											<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
											<span className="text-blue-300">
												Artistic Growth
											</span>
										</div>
										<p className="text-gray-400 text-sm">
											Critics highlight significant
											evolution in the artist's sound and
											songwriting maturity.
										</p>
									</div>
								</div>

								{/* Quick Stats */}
								<div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
									<div className="flex items-center space-x-6">
										<div className="flex items-center space-x-2">
											<CheckCircle className="w-4 h-4 text-green-400" />
											<span className="text-gray-300 text-sm">
												3 Critic Reviews
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<Users className="w-4 h-4 text-purple-400" />
											<span className="text-gray-300 text-sm">
												5 Community Reviews
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<VinylRecordIcon
												className="w-4 h-4"
												filled={true}
											/>
											<span className="text-gray-300 text-sm">
												Avg. 4.6/5
											</span>
										</div>
									</div>
									<Button
										variant="outline"
										size="sm"
										className="border-purple-500/50 text-purple-300 hover:bg-purple-800/20"
									>
										View Analysis Details
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Reviews Section */}
				<div className="space-y-6 pt-8">
					<div className="border-b border-gray-800 pb-4">
						<h2 className="text-white mb-2">Reviews</h2>
						<p className="text-gray-400">
							Professional critics and community feedback
						</p>
					</div>

					{/* Write Review Section */}
					<Card className="bg-gray-800/40 border-gray-700/50">
						<CardContent className="p-6">
							<div className="space-y-4">
								<Textarea
									value={reviewText}
									onChange={(e) =>
										setReviewText(e.target.value)
									}
									placeholder="Share your thoughts about this track... What did you love? What could be improved?"
									className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 resize-none min-h-[120px] focus:border-purple-500 focus:ring-purple-500/20"
								/>

								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<span className="text-gray-400 text-sm">
											{reviewText.length}/500 characters
										</span>
										{reviewText.length > 400 && (
											<span className="text-orange-400 text-sm">
												Character limit approaching
											</span>
										)}
									</div>

									<div className="flex items-center space-x-2">
										<Button
											variant="outline"
											size="sm"
											className="border-gray-600 text-gray-300 hover:bg-gray-700"
											onClick={() => {
												setReviewText("");
												setUserRating(0);
											}}
										>
											Clear
										</Button>
										<Button
											size="sm"
											disabled={
												!reviewText.trim() ||
												userRating === 0
											}
											className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Post Review
										</Button>
									</div>
								</div>

								{/* Rating Section - Centered */}
								<div className="flex justify-center mt-4 pt-4 border-t border-gray-600/50">
									<div className="flex items-center space-x-1">
										{[1, 2, 3, 4, 5].map((rating) => (
											<button
												key={rating}
												onClick={() =>
													setUserRating(rating)
												}
												className="p-1 hover:scale-110 transition-transform"
											>
												<VinylRecordIcon
													className="w-6 h-6"
													filled={
														rating <= userRating
													}
												/>
											</button>
										))}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Two Column Layout */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Verified Critics Column */}
						<div className="space-y-6">
							<div className="flex items-center space-x-3 mb-6">
								<CheckCircle className="w-5 h-5 text-green-400" />
								<h3 className="text-white">Verified Critics</h3>
								<Badge className="bg-green-600/20 text-green-400 border-green-500/30">
									{criticReviews.length} Reviews
								</Badge>
							</div>

							<div className="space-y-4">
								{criticReviews.map((review) => (
									<Card
										key={review.id}
										className="bg-green-900/20 border-green-700/30 hover:bg-green-900/30 transition-all duration-300 border-l-4 border-l-green-500"
									>
										<CardContent className="p-6">
											{/* Review Header */}
											<div className="flex items-start justify-between mb-4">
												<div className="flex items-center space-x-4">
													<div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500/40">
														<img
															src={
																review.userAvatar
															}
															alt={`${review.userName} avatar`}
															className="w-full h-full object-cover"
														/>
													</div>
													<div>
														<div className="flex items-center space-x-2 mb-1">
															<h4 className="text-white">
																{
																	review.userName
																}
															</h4>
															<CheckCircle className="w-4 h-4 text-green-400" />
														</div>
														<p className="text-green-300 text-sm mb-1">
															{review.publication}
														</p>
														<p className="text-gray-400 text-sm">
															{review.timeAgo}
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-4">
													{renderSmallVinyls(
														review.rating,
													)}
												</div>
											</div>

											{/* Review Text */}
											<div className="mb-4">
												<p className="text-gray-300 leading-relaxed">
													{review.reviewText}
												</p>
											</div>

											{/* Review Actions */}
											<div className="flex items-center justify-between pt-4 border-t border-green-700/30">
												<div className="flex items-center space-x-4">
													<button
														className={`flex items-center space-x-1 text-sm transition-colors ${
															review.isLiked
																? "text-green-400 hover:text-green-300"
																: "text-gray-400 hover:text-gray-300"
														}`}
													>
														<Heart
															className={`w-4 h-4 ${review.isLiked ? "fill-current" : ""}`}
														/>
														<span>
															{review.likes}
														</span>
													</button>
													<button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 text-sm transition-colors">
														<MessageSquare className="w-4 h-4" />
														<span>Reply</span>
													</button>
												</div>
												<button className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
													Report
												</button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>

							{/* Load More Critics */}
							<div className="text-center pt-4">
								<Button
									variant="outline"
									className="border-green-600/50 text-green-300 hover:bg-green-800/20"
								>
									Load More Critic Reviews
								</Button>
							</div>
						</div>

						{/* Community Reviews Column */}
						<div className="space-y-6">
							<div className="flex items-center space-x-3 mb-6">
								<Users className="w-5 h-5 text-purple-400" />
								<h3 className="text-white">
									Community Reviews
								</h3>
								<Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
									{communityReviews.length} Reviews
								</Badge>
							</div>

							<div className="space-y-4">
								{communityReviews.map((review) => (
									<Card
										key={review.id}
										className={`${
											review.isSuperfan
												? "bg-purple-900/20 border-purple-700/30 hover:bg-purple-900/30 border-l-4 border-l-purple-500"
												: "bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60"
										} transition-all duration-300`}
									>
										<CardContent className="p-6">
											{/* Review Header */}
											<div className="flex items-start justify-between mb-4">
												<div className="flex items-center space-x-4">
													<div
														className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
															review.isSuperfan
																? "border-purple-500/40"
																: "border-gray-600/40"
														}`}
													>
														<img
															src={
																review.userAvatar ||
																`https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face`
															}
															alt={`${review.userName} avatar`}
															className="w-full h-full object-cover"
														/>
													</div>
													<div>
														<div className="flex items-center space-x-2 mb-1">
															<h4 className="text-white">
																{
																	review.userName
																}
															</h4>
															{review.isSuperfan && (
																<Badge className="bg-purple-600/30 text-purple-300 border-purple-500/50 text-xs">
																	SUPERFAN
																</Badge>
															)}
														</div>
														<p className="text-gray-400 text-sm">
															{review.timeAgo}
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-4">
													{renderSmallVinyls(
														review.rating,
													)}
												</div>
											</div>

											{/* Review Text */}
											<div className="mb-4">
												<p className="text-gray-300 leading-relaxed">
													{review.reviewText}
												</p>
											</div>

											{/* Review Actions */}
											<div
												className={`flex items-center justify-between pt-4 border-t ${
													review.isSuperfan
														? "border-purple-700/30"
														: "border-gray-700/30"
												}`}
											>
												<div className="flex items-center space-x-4">
													<button
														className={`flex items-center space-x-1 text-sm transition-colors ${
															review.isLiked
																? "text-purple-400 hover:text-purple-300"
																: "text-gray-400 hover:text-gray-300"
														}`}
													>
														<Heart
															className={`w-4 h-4 ${review.isLiked ? "fill-current" : ""}`}
														/>
														<span>
															{review.likes}
														</span>
													</button>
													<button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 text-sm transition-colors">
														<MessageSquare className="w-4 h-4" />
														<span>Reply</span>
													</button>
												</div>
												<button className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
													Report
												</button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>

							{/* Load More Community */}
							<div className="text-center pt-4">
								<Button
									variant="outline"
									className="border-purple-600/50 text-purple-300 hover:bg-purple-800/20"
								>
									Load More Community Reviews
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Now Playing Media Player */}
			{isPlaying && (
				<div className="fixed inset-0 bg-gray-900 z-50 overflow-hidden">
					{/* Top section with close button */}
					<div className="flex justify-between items-center p-4 border-b border-gray-800">
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsPlaying(false)}
								className="text-gray-400 hover:text-white"
							>
								<ArrowLeft className="w-5 h-5" />
							</Button>
							<span className="text-white text-lg">
								Now Playing
							</span>
						</div>
					</div>

					{/* Main content area */}
					<div className="flex flex-1">
						{/* Sidebar with controls */}
						<div className="w-80 bg-gray-800/50 border-r border-gray-700 p-6 flex flex-col">
							{/* Album art */}
							<div className="mb-6">
								<img
									src={song.albumArt}
									alt={song.title}
									className="w-full aspect-square object-cover rounded-lg"
								/>
							</div>

							{/* Playback controls */}
							<div className="space-y-6 flex-1">
								<div className="space-y-2">
									<h3 className="text-white text-lg">
										{song.title}
									</h3>
									<p className="text-gray-400">
										{song.artist}
									</p>
								</div>

								{/* Controls */}
								<div className="flex items-center justify-center space-x-4">
									<Button
										variant="ghost"
										size="icon"
										className="text-gray-400 hover:text-white"
									>
										<SkipBack className="w-6 h-6" />
									</Button>
									<Button
										onClick={handlePlayToggle}
										className="w-16 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-full"
									>
										{isPlaying ? (
											<Pause className="w-8 h-8" />
										) : (
											<PlayCircle className="w-8 h-8" />
										)}
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="text-gray-400 hover:text-white"
									>
										<SkipForward className="w-6 h-6" />
									</Button>
								</div>

								{/* Time display */}
								<div className="text-center space-y-2">
									<div className="text-gray-400 text-sm">
										{formatTime(currentTime)} /{" "}
										{formatTime(duration)}
									</div>
								</div>

								{/* Volume control */}
								<div className="flex items-center space-x-2">
									<Volume2 className="w-4 h-4 text-gray-400" />
									<div className="flex-1 h-1 bg-gray-600 rounded-full">
										<div className="h-full w-3/4 bg-orange-500 rounded-full"></div>
									</div>
								</div>
							</div>
						</div>

						{/* Main waveform section */}
						<div className="flex-1 flex flex-col h-screen">
							{/* Waveform container */}
							<div className="relative flex-1 bg-gray-900 overflow-hidden">
								{/* Time markers */}
								<div className="absolute top-4 left-0 right-0 flex justify-between px-8 text-xs text-gray-500 z-10">
									{Array.from({ length: 9 }, (_, i) => (
										<span key={i}>
											{formatTimeForWaveform(
												(duration / 8) * i,
											)}
										</span>
									))}
								</div>

								{/* Waveform visualization */}
								<div className="absolute inset-0 flex items-center px-8 pt-12">
									<div className="relative w-full h-48 flex items-end justify-start">
										{/* Play button */}
										<div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20">
											<Button
												onClick={handlePlayToggle}
												className="w-16 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center"
											>
												{isPlaying ? (
													<Pause className="w-8 h-8" />
												) : (
													<PlayCircle className="w-8 h-8" />
												)}
											</Button>
										</div>

										{/* Waveform bars */}
										<div
											className="flex items-end h-full ml-20 flex-1 cursor-pointer"
											onClick={handleProgressClick}
										>
											{waveformData.map(
												(height, index) => {
													const progress =
														currentTime / duration;
													const barProgress =
														index /
														waveformData.length;
													const isPlayed =
														barProgress <= progress;

													return (
														<div
															key={index}
															className={`w-1 mx-px transition-colors duration-150 ${
																isPlayed
																	? "bg-orange-500"
																	: "bg-gray-600"
															} hover:bg-orange-400`}
															style={{
																height: `${height * 100}%`,
															}}
														/>
													);
												},
											)}
										</div>

										{/* Progress needle */}
										<div
											className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
											style={{
												left: `${(currentTime / duration) * (100 - 10)}%`,
												marginLeft: "80px",
											}}
										>
											<div className="w-4 h-4 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
										</div>
									</div>
								</div>

								{/* Song info at bottom */}
								<div className="absolute bottom-8 left-8 right-8">
									<div className="flex items-center justify-between">
										<div>
											<h2 className="text-white text-xl">
												{song.artist}
											</h2>
											<h1 className="text-white text-2xl font-medium">
												{song.title}
											</h1>
										</div>
										<div className="flex items-center space-x-4">
											<Button
												onClick={() =>
													setIsFavorited(!isFavorited)
												}
												variant="ghost"
												size="icon"
												className={`${
													isFavorited
														? "text-pink-500 hover:text-pink-600"
														: "text-gray-400 hover:text-gray-300"
												}`}
											>
												<Heart
													className={`w-6 h-6 ${isFavorited ? "fill-current" : ""}`}
												/>
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-gray-400 hover:text-gray-300"
											>
												<Share2 className="w-6 h-6" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-gray-400 hover:text-gray-300"
											>
												<MessageSquare className="w-6 h-6" />
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Comments Section */}
						<div className="w-96 bg-gray-800/30 border-l border-gray-700 flex flex-col">
							{/* Comments Header */}
							<div className="p-4 border-b border-gray-700">
								<div className="flex items-center justify-between">
									<h3 className="text-white">Comments</h3>
									<span className="text-gray-400 text-sm">
										{nowPlayingComments.length}
									</span>
								</div>
							</div>

							{/* Comment Input */}
							<div className="p-4 border-b border-gray-700">
								<div className="flex space-x-3">
									<div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600">
										<img
											src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=32&h=32&fit=crop&crop=face"
											alt="Your avatar"
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex-1">
										<Textarea
											value={newComment}
											onChange={(e) =>
												setNewComment(e.target.value)
											}
											placeholder="Add a comment..."
											className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 resize-none min-h-[60px] text-sm"
										/>
										<div className="flex justify-between items-center mt-2">
											<span className="text-gray-500 text-xs">
												{newComment.length}/280
											</span>
											<Button
												size="sm"
												disabled={!newComment.trim()}
												className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
											>
												Post
											</Button>
										</div>
									</div>
								</div>
							</div>

							{/* Comments List */}
							<div className="flex-1 overflow-y-auto p-4 space-y-4">
								{nowPlayingComments.map((comment) => (
									<div
										key={comment.id}
										className="flex space-x-3"
									>
										<div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
											<img
												src={comment.avatar}
												alt={comment.user}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center space-x-2 mb-1">
												<span className="text-white text-sm">
													{comment.user}
												</span>
												<span className="text-gray-500 text-xs">
													{comment.time}
												</span>
											</div>
											<p className="text-gray-300 text-sm leading-relaxed">
												{comment.text}
											</p>
											<div className="flex items-center space-x-3 mt-2">
												<button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 transition-colors">
													<Heart className="w-3 h-3" />
													<span className="text-xs">
														{comment.likes}
													</span>
												</button>
												<button className="text-gray-400 hover:text-gray-300 text-xs transition-colors">
													Reply
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

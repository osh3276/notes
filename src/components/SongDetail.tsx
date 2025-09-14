import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
	id: string;
	title: string;
	artist: string;
	albumArt: string;
	rating: number;
	reviewCount: number;
	genres: string[];
	album?: string;
	releaseDate?: string;
	duration?: string;
	spotifyUrl?: string;
	aiSummary?: string;
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
	verified?: boolean;
}

interface SongDetailProps {
	song: Song;
	onBack?: () => void;
	onArtistClick?: (artistName: string) => void;
	onGenreClick?: (genre: string) => void;
}

export function SongDetail({
	song,
	onBack,
	onArtistClick,
	onGenreClick,
}: SongDetailProps) {
	const { data: session, status } = useSession();
	const [isFavorited, setIsFavorited] = useState(false);
	const [reviewText, setReviewText] = useState("");
	const [userRating, setUserRating] = useState(0);
	const [isSubmittingReview, setIsSubmittingReview] = useState(false);
	const [reviewSubmissionMessage, setReviewSubmissionMessage] = useState("");
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loadingReviews, setLoadingReviews] = useState(true);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration] = useState(263); // 4:23 in seconds

	// Fetch reviews from database
	useEffect(() => {
		const fetchReviews = async () => {
			setLoadingReviews(true);
			try {
				const response = await fetch(
					`/api/reviews?song_id=${encodeURIComponent(song.id)}`,
				);
				const data = await response.json();

				if (response.ok && data.reviews) {
					// Transform database reviews to match component interface
					const transformedReviews = await Promise.all(
						data.reviews.map(async (dbReview: any) => {
							// Fetch user details
							const userResponse = await fetch(
								`/api/user?user_id=${encodeURIComponent(dbReview.reviewer_id)}`,
							);
							const userData = userResponse.ok
								? await userResponse.json()
								: null;

							// Calculate time ago
							const timeAgo = getTimeAgo(
								new Date(dbReview.created_at),
							);

							return {
								id: dbReview.id,
								userName:
									userData?.user?.name || "Anonymous User",
								userAvatar:
									userData?.user?.image ||
									"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
								rating: dbReview.rating,
								reviewText: dbReview.review || "",
								timeAgo,
								likes: Math.floor(Math.random() * 100), // Mock likes for now
								isLiked: false,
								verified: dbReview.verified || false,
							};
						}),
					);
					setReviews(transformedReviews);
				}
			} catch (error) {
				console.error("Error fetching reviews:", error);
			} finally {
				setLoadingReviews(false);
			}
		};

		fetchReviews();
	}, [song.id]);

	// Helper function to calculate time ago
	const getTimeAgo = (date: Date): string => {
		const now = new Date();
		const diffInSeconds = Math.floor(
			(now.getTime() - date.getTime()) / 1000,
		);

		if (diffInSeconds < 60) return "just now";
		if (diffInSeconds < 3600)
			return `${Math.floor(diffInSeconds / 60)} minutes ago`;
		if (diffInSeconds < 86400)
			return `${Math.floor(diffInSeconds / 3600)} hours ago`;
		if (diffInSeconds < 2592000)
			return `${Math.floor(diffInSeconds / 86400)} days ago`;
		return `${Math.floor(diffInSeconds / 2592000)} months ago`;
	};

	// Separate reviews into verified and community
	const verifiedReviews = reviews.filter((review) => review.verified);
	const nonVerifiedReviews = reviews.filter((review) => !review.verified);

	const renderVinyls = (rating: number) => {
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

	// Music player controls
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isPlaying && currentTime < duration) {
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

	const handleSubmitReview = async () => {
		if (!session?.user?.id) {
			setReviewSubmissionMessage("Please sign in to post a review");
			return;
		}

		if (userRating === 0) {
			setReviewSubmissionMessage("Please select a rating");
			return;
		}

		setIsSubmittingReview(true);
		setReviewSubmissionMessage("");

		try {
			const response = await fetch("/api/reviews", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					song_id: song.id,
					rating: userRating,
					review: reviewText.trim() || null,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setReviewSubmissionMessage(
					data.message || "Review posted successfully!",
				);
				setReviewText("");
				setUserRating(0);

				// Refresh reviews list
				const reviewsResponse = await fetch(
					`/api/reviews?song_id=${encodeURIComponent(song.id)}`,
				);
				const reviewsData = await reviewsResponse.json();

				if (reviewsResponse.ok && reviewsData.reviews) {
					const transformedReviews = await Promise.all(
						reviewsData.reviews.map(async (dbReview: any) => {
							const userResponse = await fetch(
								`/api/user?user_id=${encodeURIComponent(dbReview.reviewer_id)}`,
							);
							const userData = userResponse.ok
								? await userResponse.json()
								: null;
							const timeAgo = getTimeAgo(
								new Date(dbReview.created_at),
							);

							return {
								id: dbReview.id,
								userName:
									userData?.user?.name || "Anonymous User",
								userAvatar:
									userData?.user?.image ||
									"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
								rating: dbReview.rating,
								reviewText: dbReview.review || "",
								timeAgo,
								likes: Math.floor(Math.random() * 100),
								isLiked: false,
								verified: dbReview.verified || false,
							};
						}),
					);
					setReviews(transformedReviews);
				}
			} else {
				setReviewSubmissionMessage(
					data.error || "Failed to post review",
				);
			}
		} catch (error) {
			console.error("Error posting review:", error);
			setReviewSubmissionMessage(
				"Failed to post review. Please try again.",
			);
		} finally {
			setIsSubmittingReview(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#1A1A1A]">
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
								className="absolute inset-0 bg-[#1A1A1A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
								onClick={() => {
									if (song.spotifyUrl) {
										window.open(song.spotifyUrl, "_blank");
									}
								}}
							>
								<svg
									className="w-16 h-16 text-accent/80"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
								</svg>
							</div>
						</div>
					</div>

					{/* Song Information */}
					<div className="lg:col-span-2 space-y-8">
						{/* Title and Artist */}
						<div className="space-y-4">
							<div>
								<h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-3 leading-tight">
									{song.title}
								</h1>
								<div className="flex items-center space-x-3 mb-4">
									<span className="text-lg text-muted-foreground">
										by
									</span>
									<button
										onClick={() =>
											onArtistClick?.(song.artist)
										}
										className="flex items-center space-x-3 hover:bg-muted/50 px-3 py-2 rounded-lg transition-all duration-300 group"
									>
										<div className="w-12 h-12 overflow-hidden rounded-full border-2 border-muted-foreground group-hover:border-accent transition-colors">
											<img
												src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=48&h=48&fit=crop&crop=face"
												alt={`${song.artist} headshot`}
												className="w-full h-full object-cover"
											/>
										</div>
										<span className="text-xl text-accent hover:text-accent/80 transition-colors font-medium">
											{song.artist}
										</span>
									</button>
								</div>
							</div>

							{/* Album and Release Info */}
							{(song.album || song.releaseDate) && (
								<div className="bg-muted/30 rounded-lg p-4 space-y-2">
									{song.album && (
										<div className="flex items-center space-x-2">
											<span className="text-sm text-muted-foreground">
												Album:
											</span>
											<span className="text-foreground font-medium">
												{song.album}
											</span>
										</div>
									)}
									{song.releaseDate && (
										<div className="flex items-center space-x-2">
											<span className="text-sm text-muted-foreground">
												Released:
											</span>
											<span className="text-foreground">
												{new Date(
													song.releaseDate,
												).getFullYear()}
											</span>
										</div>
									)}
									{song.duration && (
										<div className="flex items-center space-x-2">
											<span className="text-sm text-muted-foreground">
												Duration:
											</span>
											<span className="text-foreground">
												{song.duration}
											</span>
										</div>
									)}
								</div>
							)}

							{/* Genre Tags */}
							{song.genres.length > 0 && (
								<div className="space-y-2">
									<span className="text-sm text-muted-foreground">
										Genres:
									</span>
									<div className="flex flex-wrap gap-2">
										{song.genres.map((genre, index) => (
											<GenreTag
												key={index}
												genre={genre}
												onClick={onGenreClick}
											/>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Rating and Stats */}
						<div className="bg-gradient-to-r from-muted/40 to-muted/20 rounded-xl p-6 border border-muted/30">
							<h3 className="text-lg font-semibold text-foreground mb-4">
								Song Statistics
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="text-center space-y-2">
									<div className="flex justify-center mb-2">
										{renderVinyls(Math.floor(song.rating))}
									</div>
									<p className="text-3xl font-bold text-foreground">
										{song.rating}
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										Overall Rating
									</p>
								</div>
								<div className="text-center space-y-2">
									<div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
										<MessageSquare className="w-6 h-6 text-accent" />
									</div>
									<p className="text-3xl font-bold text-foreground">
										{song.reviewCount.toLocaleString()}
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										Total Reviews
									</p>
								</div>
								<div className="text-center space-y-2">
									<div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
										<TrendingUp className="w-6 h-6 text-green-500" />
									</div>
									<p className="text-3xl font-bold text-foreground">
										{Math.round(song.rating * 20)}%
									</p>
									<p className="text-muted-foreground text-sm font-medium">
										Popularity Score
									</p>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-wrap gap-4">
							<Button
								onClick={() => setIsFavorited(!isFavorited)}
								variant="outline"
								size="lg"
								className={`border-border hover:bg-muted transition-all duration-300 ${
									isFavorited
										? "bg-accent border-accent text-accent-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<Heart
									className={`w-5 h-5 mr-2 ${isFavorited ? "fill-current" : ""}`}
								/>
								{isFavorited ? "Favorited" : "Add to Favorites"}
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
							>
								<Share2 className="w-4 h-4 mr-2" />
								Share Song
							</Button>
							{song.spotifyUrl && (
								<Button
									onClick={() =>
										window.open(song.spotifyUrl, "_blank")
									}
									className="bg-green-500 hover:bg-green-600 text-white"
									size="lg"
								>
									<svg
										className="w-5 h-5 mr-2"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
									</svg>
									Play on Spotify
								</Button>
							)}
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
								<div className="bg-muted/50 p-4 border border-accent/20">
									<div className="flex items-center space-x-2 mb-3">
										<Sparkles className="w-4 h-4 text-accent" />
										<span className="text-accent">
											AI Generated Review Summary
										</span>
									</div>
									<p className="text-muted-foreground leading-relaxed whitespace-pre-line">
										{song.aiSummary}
									</p>
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
							{status === "loading" ? (
								<div className="text-center py-4">
									<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
									<p className="text-gray-400">Loading...</p>
								</div>
							) : !session ? (
								<div className="text-center py-6">
									<h3 className="text-white mb-2">
										Sign in to write a review
									</h3>
									<p className="text-gray-400 mb-4">
										Share your thoughts about this track
										with the community
									</p>
									<Button
										onClick={() =>
											(window.location.href =
												"/api/auth/signin")
										}
										className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
									>
										Sign In with Spotify
									</Button>
								</div>
							) : (
								<div className="space-y-4">
									<Textarea
										value={reviewText}
										onChange={(e) =>
											setReviewText(e.target.value)
										}
										placeholder="Share your thoughts about this track... What did you love? What could be improved?"
										className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 resize-none min-h-[120px] focus:border-purple-500 focus:ring-purple-500/20"
									/>

									{/* Rating Section - Above text area */}
									<div className="flex flex-col items-center space-y-3 p-4 bg-gray-700/30 rounded-lg">
										<div className="flex items-center space-x-2">
											<span className="text-gray-300 text-sm">
												Rate this track:
											</span>
											<span className="text-purple-400 font-medium">
												{userRating > 0
													? `${userRating}/5`
													: "Select rating"}
											</span>
										</div>
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
														className="w-8 h-8"
														filled={
															rating <= userRating
														}
													/>
												</button>
											))}
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<span className="text-gray-400 text-sm">
												{reviewText.length}/1000
												characters
											</span>
											{reviewText.length > 800 && (
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
													setReviewSubmissionMessage(
														"",
													);
												}}
												disabled={isSubmittingReview}
											>
												Clear
											</Button>
											<Button
												size="sm"
												disabled={
													userRating === 0 ||
													isSubmittingReview
												}
												className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
												onClick={handleSubmitReview}
											>
												{isSubmittingReview ? (
													<>
														<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
														Posting...
													</>
												) : (
													"Post Review"
												)}
											</Button>
										</div>
									</div>

									{/* Success/Error Message */}
									{reviewSubmissionMessage && (
										<div
											className={`p-3 rounded-lg text-sm ${
												reviewSubmissionMessage.includes(
													"success",
												) ||
												reviewSubmissionMessage.includes(
													"posted",
												)
													? "bg-green-900/30 text-green-400 border border-green-500/30"
													: "bg-red-900/30 text-red-400 border border-red-500/30"
											}`}
										>
											{reviewSubmissionMessage}
										</div>
									)}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Reviews Loading State */}
					{loadingReviews ? (
						<div className="flex items-center justify-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
						</div>
					) : reviews.length === 0 ? (
						<div className="text-center py-12">
							<MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
							<h3 className="text-white mb-2">No reviews yet</h3>
							<p className="text-gray-400">
								Be the first to share your thoughts about this
								track!
							</p>
						</div>
					) : (
						/* Two Column Layout */
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Verified Reviews Column */}
							<div className="space-y-6">
								<div className="flex items-center space-x-3 mb-6">
									<CheckCircle className="w-5 h-5 text-green-400" />
									<h3 className="text-white">
										Verified Reviews
									</h3>
									<Badge className="bg-green-600/20 text-green-400 border-green-500/30">
										{verifiedReviews.length} Reviews
									</Badge>
								</div>

								{verifiedReviews.length === 0 ? (
									<div className="text-center py-8">
										<CheckCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
										<p className="text-gray-400">
											No verified reviews yet
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{verifiedReviews.map((review) => (
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
																	alt={
																		review.userName
																	}
																	className="w-full h-full object-cover"
																/>
															</div>
															<div>
																<div className="flex items-center space-x-2">
																	<h4 className="text-white font-medium">
																		{
																			review.userName
																		}
																	</h4>
																	<CheckCircle className="w-4 h-4 text-green-400" />
																</div>
																<p className="text-gray-400 text-sm">
																	{
																		review.timeAgo
																	}
																</p>
															</div>
														</div>
														<div className="flex items-center space-x-1">
															{renderVinyls(
																review.rating,
															)}
														</div>
													</div>

													{/* Review Content */}
													{review.reviewText && (
														<p className="text-gray-300 mb-4 leading-relaxed">
															{review.reviewText}
														</p>
													)}

													{/* Review Actions */}
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-4">
															<button
																className={`flex items-center space-x-1 text-sm transition-colors ${
																	review.isLiked
																		? "text-red-400"
																		: "text-gray-400 hover:text-red-400"
																}`}
															>
																<Heart
																	className={`w-4 h-4 ${
																		review.isLiked
																			? "fill-current"
																			: ""
																	}`}
																/>
																<span>
																	{
																		review.likes
																	}
																</span>
															</button>
															<button className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm transition-colors">
																<MessageSquare className="w-4 h-4" />
																<span>
																	Reply
																</span>
															</button>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								)}
							</div>

							{/* Community Reviews Column */}
							<div className="space-y-6">
								<div className="flex items-center space-x-3 mb-6">
									<Users className="w-5 h-5 text-purple-400" />
									<h3 className="text-white">
										Community Reviews
									</h3>
									<Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
										{nonVerifiedReviews.length} Reviews
									</Badge>
								</div>

								{nonVerifiedReviews.length === 0 ? (
									<div className="text-center py-8">
										<Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
										<p className="text-gray-400">
											No community reviews yet
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{nonVerifiedReviews.map((review) => (
											<Card
												key={review.id}
												className="bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300"
											>
												<CardContent className="p-6">
													{/* Review Header */}
													<div className="flex items-start justify-between mb-4">
														<div className="flex items-center space-x-4">
															<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600">
																<img
																	src={
																		review.userAvatar
																	}
																	alt={
																		review.userName
																	}
																	className="w-full h-full object-cover"
																/>
															</div>
															<div>
																<h4 className="text-white font-medium">
																	{
																		review.userName
																	}
																</h4>
																<p className="text-gray-400 text-sm">
																	{
																		review.timeAgo
																	}
																</p>
															</div>
														</div>
														<div className="flex items-center space-x-1">
															{renderVinyls(
																review.rating,
															)}
														</div>
													</div>

													{/* Review Content */}
													{review.reviewText && (
														<p className="text-gray-300 mb-4 leading-relaxed">
															{review.reviewText}
														</p>
													)}

													{/* Review Actions */}
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-4">
															<button
																className={`flex items-center space-x-1 text-sm transition-colors ${
																	review.isLiked
																		? "text-red-400"
																		: "text-gray-400 hover:text-red-400"
																}`}
															>
																<Heart
																	className={`w-4 h-4 ${
																		review.isLiked
																			? "fill-current"
																			: ""
																	}`}
																/>
																<span>
																	{
																		review.likes
																	}
																</span>
															</button>
															<button className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm transition-colors">
																<MessageSquare className="w-4 h-4" />
																<span>
																	Reply
																</span>
															</button>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

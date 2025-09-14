import { Card, CardContent } from "./ui/card";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { VinylRecordIcon } from "./VinylRecordIcon";

interface Review {
	id: number;
	song_id: string;
	reviewer_id: string;
	rating: number;
	review: string;
	created_at: string;
	verified: boolean;
	userName?: string;
	userAvatar?: string;
	songTitle?: string;
	artist?: string;
	albumArt?: string;
	timeAgo?: string;
	likes?: number;
}

export function RecentReviews() {
	const [recentReviews, setRecentReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch recent reviews from database
	useEffect(() => {
		const fetchRecentReviews = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/recent-reviews?limit=3");
				const data = await response.json();

				if (response.ok && data.reviews) {
					// Transform the data to include display properties
					const transformedReviews = await Promise.all(
						data.reviews.map(async (review: Review) => {
							// Fetch user details
							const userResponse = await fetch(
								`/api/user?user_id=${encodeURIComponent(review.reviewer_id)}`,
							);
							const userData = userResponse.ok
								? await userResponse.json()
								: null;

							// Fetch song details (you'll need to create this endpoint)
							const songResponse = await fetch(
								`/api/track/${encodeURIComponent(review.song_id)}`,
							);
							const songData = songResponse.ok
								? await songResponse.json()
								: null;

							return {
								...review,
								userName:
									userData?.user?.name || "Anonymous User",
								userAvatar:
									userData?.user?.image ||
									"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
								songTitle: songData?.name || "Unknown Song",
								artist:
									songData?.artists
										?.map((a: any) => a.name)
										.join(", ") || "Unknown Artist",
								albumArt:
									songData?.album?.images?.[0]?.url ||
									"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop",
								timeAgo: formatTimeAgo(
									new Date(review.created_at),
								),
								likes: Math.floor(Math.random() * 20), // Replace with actual likes data
								reviewText: review.review || "",
							};
						}),
					);
					setRecentReviews(transformedReviews);
				}
			} catch (error) {
				console.error("Failed to fetch recent reviews:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchRecentReviews();
	}, []);

	// Helper function to format time ago
	const formatTimeAgo = (date: Date): string => {
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

	return (
		<section className="py-16 px-4">
			<div className="container mx-auto max-w-7xl">
				<div className="mb-12 text-center">
					<h2 className="text-foreground mb-2 text-6xl">
						Recent Reviews
					</h2>
					<div className="w-32 h-0.5 bg-accent/50 mx-auto"></div>
				</div>

				{/* Review Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{recentReviews.map((review) => (
						<Card
							key={review.id}
							className="bg-muted/40 border-border hover:bg-muted/60 transition-all duration-300 cursor-pointer group relative overflow-hidden"
						>
							<CardContent className="p-6">
								{/* User Info */}
								<div className="flex items-start space-x-4 mb-4">
									<div className="w-12 h-12 overflow-hidden border-2 border-accent/30">
										<img
											src={review.userAvatar}
											alt={`${review.userName} avatar`}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<h4 className="text-foreground mb-1">
												{review.userName}
											</h4>
										</div>
										<p className="text-muted-foreground text-sm">
											{review.timeAgo}
										</p>
									</div>
								</div>

								{/* Rating */}
								<div className="mb-4">
									{renderVinyls(review.rating)}
								</div>

								{/* Review Text */}
								<div className="mb-4">
									<p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
										{review.review}
									</p>
								</div>

								{/* Song Info with Album Art on Left */}
								<div className="border-t border-border pt-4">
									<div className="flex items-center space-x-3 mb-3">
										{/* Album Art - now positioned to the left */}
										<div className="w-12 h-12 overflow-hidden border border-accent/30 flex-shrink-0">
											<img
												src={review.albumArt}
												alt={`${review.songTitle} album art`}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<h5 className="text-foreground text-sm mb-1 truncate">
												{review.songTitle}
											</h5>
											<p className="text-muted-foreground text-xs truncate">
												{review.artist}
											</p>
										</div>
									</div>

									{/* Likes */}
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-1 text-muted-foreground text-xs">
											<MessageSquare className="w-3 h-3" />
											<span>{review.likes} likes</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Loading State */}
				{loading && (
					<div className="flex items-center justify-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
					</div>
				)}

				{/* Empty State */}
				{!loading && recentReviews.length === 0 && (
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							No recent reviews available
						</p>
					</div>
				)}
			</div>
		</section>
	);
}

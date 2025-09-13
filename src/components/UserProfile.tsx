import { useState } from "react";
import {
	ArrowLeft,
	Settings,
	Heart,
	MessageSquare,
	Star,
	Users,
	Calendar,
	Zap,
	Music,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

import { VinylRecordIcon } from "./VinylRecordIcon";

interface UserProfileProps {
	onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
	const [isFollowing, setIsFollowing] = useState(false);

	// Mock user data
	const userData = {
		name: "Alex Johnson",
		username: "@alexmusic",
		avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face",
		coverImage:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=300&fit=crop",
		bio: "Music enthusiast, critic, and vinyl collector. Always discovering new sounds and sharing honest reviews. 🎵",
		location: "Los Angeles, CA",
		joinDate: "March 2022",
		stats: {
			reviews: 247,
			followers: 1834,
			following: 592,
			likes: 3921,
		},
		badges: ["Top Reviewer", "Early Adopter"],
	};

	const recentReviews = [
		{
			id: 1,
			songTitle: "Watermelon Sugar",
			artist: "Harry Styles",
			rating: 4,
			reviewText:
				"A perfect summer anthem with infectious melodies and production that sparkles...",
			timeAgo: "2 hours ago",
			likes: 23,
		},
		{
			id: 2,
			songTitle: "Good 4 U",
			artist: "Olivia Rodrigo",
			rating: 5,
			reviewText:
				"Raw emotion meets pop perfection. This track showcases incredible vocal range...",
			timeAgo: "1 day ago",
			likes: 41,
		},
		{
			id: 3,
			songTitle: "Levitating",
			artist: "Dua Lipa",
			rating: 4,
			reviewText:
				"Disco-pop at its finest. The production is crisp and the hooks are undeniable...",
			timeAgo: "3 days ago",
			likes: 67,
		},
	];

	const favoriteGenres = [
		"Indie Rock",
		"Electronic",
		"Jazz",
		"Hip-Hop",
		"Pop",
		"Alternative",
	];

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
						<span>Back to Home</span>
					</Button>
				</div>
			</div>

			{/* Profile Header */}
			<div className="relative">
				{/* Cover Image */}
				<div className="h-48 md:h-64 bg-gradient-to-r from-purple-900/50 to-pink-900/50 relative overflow-hidden">
					<img
						src={userData.coverImage}
						alt="Profile cover"
						className="w-full h-full object-cover opacity-60"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
				</div>

				{/* Profile Info */}
				<div className="container mx-auto px-4 relative -mt-16 md:-mt-20">
					<div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
						{/* Profile Picture */}
						<div className="relative">
							<div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800">
								<img
									src={userData.avatar}
									alt={userData.name}
									className="w-full h-full object-cover"
								/>
							</div>
						</div>

						{/* User Info */}
						<div className="flex-1 min-w-0">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between">
								<div>
									<h1 className="text-2xl md:text-3xl text-white mb-1">
										{userData.name}
									</h1>
									<p className="text-gray-400 mb-2">
										{userData.username}
									</p>
									<div className="flex items-center space-x-2 mb-4 flex-wrap">
										<Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-2 border-yellow-400/30 shadow-lg">
											<Star className="w-3 h-3 mr-1 fill-current" />
											SUPERFAN
										</Badge>
										{userData.badges.map((badge, index) => (
											<Badge
												key={index}
												variant="outline"
												className="border-purple-500/50 text-purple-300"
											>
												{badge}
											</Badge>
										))}
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
										<MessageSquare className="w-4 h-4 mr-2" />
										Message
									</Button>
									<Button
										variant="outline"
										size="icon"
										className="border-gray-600 text-gray-300 hover:bg-gray-800"
									>
										<Settings className="w-4 h-4" />
									</Button>
								</div>
							</div>

							<p className="text-gray-300 mb-4 max-w-2xl leading-relaxed">
								{userData.bio}
							</p>

							{/* Stats */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
								<div className="text-center">
									<p className="text-white text-xl">
										{userData.stats.reviews}
									</p>
									<p className="text-gray-400 text-sm">
										Reviews
									</p>
								</div>
								<div className="text-center">
									<p className="text-white text-xl">
										{userData.stats.followers.toLocaleString()}
									</p>
									<p className="text-gray-400 text-sm">
										Followers
									</p>
								</div>
								<div className="text-center">
									<p className="text-white text-xl">
										{userData.stats.following}
									</p>
									<p className="text-gray-400 text-sm">
										Following
									</p>
								</div>
								<div className="text-center">
									<p className="text-white text-xl">
										{userData.stats.likes.toLocaleString()}
									</p>
									<p className="text-gray-400 text-sm">
										Likes
									</p>
								</div>
							</div>

							{/* Meta Info */}
							<div className="flex items-center space-x-6 text-gray-400 text-sm">
								<div className="flex items-center space-x-1">
									<Calendar className="w-4 h-4" />
									<span>Joined {userData.joinDate}</span>
								</div>
								{userData.location && (
									<div className="flex items-center space-x-1">
										<span>📍 {userData.location}</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Profile Content */}
			<div className="container mx-auto px-4 py-8">
				<Tabs defaultValue="reviews" className="w-full">
					<TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
						<TabsTrigger
							value="reviews"
							className="data-[state=active]:bg-purple-600"
						>
							Reviews
						</TabsTrigger>
						<TabsTrigger
							value="favorites"
							className="data-[state=active]:bg-purple-600"
						>
							Favorites
						</TabsTrigger>
						<TabsTrigger
							value="following"
							className="data-[state=active]:bg-purple-600"
						>
							Following
						</TabsTrigger>
						<TabsTrigger
							value="activity"
							className="data-[state=active]:bg-purple-600"
						>
							Activity
						</TabsTrigger>
					</TabsList>

					<TabsContent value="reviews" className="space-y-6 mt-6">
						<div className="flex items-center justify-between">
							<h3 className="text-white">Recent Reviews</h3>
							<Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
								{userData.stats.reviews} Total
							</Badge>
						</div>

						<div className="grid gap-4">
							{recentReviews.map((review) => (
								<Card
									key={review.id}
									className="bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300"
								>
									<CardContent className="p-6">
										<div className="flex items-start justify-between mb-4">
											<div>
												<h4 className="text-white mb-1">
													{review.songTitle}
												</h4>
												<p className="text-gray-400 text-sm mb-2">
													by {review.artist}
												</p>
												<div className="flex items-center space-x-2">
													{renderVinyls(
														review.rating,
													)}
													<span className="text-gray-400 text-sm">
														• {review.timeAgo}
													</span>
												</div>
											</div>
										</div>

										<p className="text-gray-300 mb-4 leading-relaxed">
											{review.reviewText}
										</p>

										<div className="flex items-center space-x-4">
											<button className="flex items-center space-x-1 text-gray-400 hover:text-pink-400 text-sm transition-colors">
												<Heart className="w-4 h-4" />
												<span>{review.likes}</span>
											</button>
											<button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 text-sm transition-colors">
												<MessageSquare className="w-4 h-4" />
												<span>Reply</span>
											</button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="favorites" className="space-y-6 mt-6">
						<div className="flex items-center justify-between">
							<h3 className="text-white">Favorite Genres</h3>
						</div>

						<div className="flex flex-wrap gap-2">
							{favoriteGenres.map((genre, index) => (
								<Badge
									key={index}
									className="bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30 cursor-pointer"
								>
									<Music className="w-3 h-3 mr-1" />
									{genre}
								</Badge>
							))}
						</div>

						<Card className="bg-gray-800/40 border-gray-700/50">
							<CardContent className="p-6 text-center">
								<Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
								<h4 className="text-white mb-2">
									No Favorite Songs Yet
								</h4>
								<p className="text-gray-400">
									Start hearting songs to see them here!
								</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="following" className="space-y-6 mt-6">
						<div className="flex items-center justify-between">
							<h3 className="text-white">Following</h3>
							<Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
								{userData.stats.following} Users
							</Badge>
						</div>

						<Card className="bg-gray-800/40 border-gray-700/50">
							<CardContent className="p-6 text-center">
								<Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
								<h4 className="text-white mb-2">
									Following List
								</h4>
								<p className="text-gray-400">
									Users you follow will appear here
								</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="activity" className="space-y-6 mt-6">
						<div className="flex items-center justify-between">
							<h3 className="text-white">Recent Activity</h3>
						</div>

						<Card className="bg-gray-800/40 border-gray-700/50">
							<CardContent className="p-6 text-center">
								<Zap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
								<h4 className="text-white mb-2">
									Activity Feed
								</h4>
								<p className="text-gray-400">
									Your recent activity will appear here
								</p>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

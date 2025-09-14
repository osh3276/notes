"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
	ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VinylRecordIcon } from "@/components/VinylRecordIcon";
import { MiniHeader } from "@/components/MiniHeader";

export default function ProfilePage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (status !== "loading") {
			setIsLoading(false);
		}
	}, [status]);

	// Redirect to home if not authenticated
	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		}
	}, [status, router]);

	// Mock data for demo purposes - in a real app, this would come from your database
	const generateUserData = (session: any) => {
		if (!session?.user) return null;

		return {
			name: session.user.name || "Music Lover",
			username: `@${session.user.name?.toLowerCase().replace(/\s+/g, "") || "musiclover"}`,
			avatar: session.user.image || "/default-avatar.png",
			coverImage:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=300&fit=crop",
			bio: "Music enthusiast discovering new sounds and sharing honest reviews. 🎵",
			location: "Connected via Spotify",
			joinDate: "Recently joined",
			stats: {
				reviews: Math.floor(Math.random() * 50) + 10,
				followers: Math.floor(Math.random() * 500) + 100,
				following: Math.floor(Math.random() * 200) + 50,
				likes: Math.floor(Math.random() * 1000) + 200,
			},
			badges: ["Spotify Connected", "New Member"],
			spotifyProfile: session.user.spotifyProfile || null,
		};
	};

	const userData = generateUserData(session);

	const recentReviews = [
		{
			id: 1,
			songTitle: "As It Was",
			artist: "Harry Styles",
			rating: 5,
			reviewText:
				"An absolute masterpiece! The production is clean and the emotional depth is incredible. Harry's vocal performance here is some of his best work.",
			timeAgo: "2 hours ago",
			likes: 23,
		},
		{
			id: 2,
			songTitle: "Anti-Hero",
			artist: "Taylor Swift",
			rating: 4,
			reviewText:
				"Taylor's vulnerability shines through in this introspective track. The lyrics are relatable and the production perfectly complements the mood.",
			timeAgo: "1 day ago",
			likes: 41,
		},
		{
			id: 3,
			songTitle: "Flowers",
			artist: "Miley Cyrus",
			rating: 4,
			reviewText:
				"A powerful anthem of self-love and independence. Miley's vocals are strong and the message resonates deeply.",
			timeAgo: "3 days ago",
			likes: 67,
		},
	];

	const favoriteGenres = [
		"Pop",
		"Indie Rock",
		"Electronic",
		"Alternative",
		"R&B",
		"Hip-Hop",
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

	if (isLoading || status === "loading") {
		return (
			<div className="min-h-screen bg-[#1A1A1A] dark">
				<MiniHeader
					onProfileClick={() => {}}
					onSongSelect={(songId) => router.push(`/song/${songId}`)}
				/>
				<div className="flex items-center justify-center pt-20">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
						<p className="text-muted-foreground">
							Loading profile...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (!session || !userData) {
		return (
			<div className="min-h-screen bg-[#1A1A1A] dark">
				<MiniHeader
					onProfileClick={() => {}}
					onSongSelect={(songId) => router.push(`/song/${songId}`)}
				/>
				<div className="flex items-center justify-center pt-20">
					<div className="text-center">
						<p className="text-muted-foreground">
							Please sign in to view your profile.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#1A1A1A] dark">
			<MiniHeader
				onBack={() => router.push("/")}
				onProfileClick={() => {}}
				onSongSelect={(songId) => router.push(`/song/${songId}`)}
			/>

			{/* Profile Header */}
			<div className="relative">
				{/* Cover Image */}
				<div className="h-48 md:h-64 bg-gradient-to-r from-purple-900/50 to-pink-900/50 relative overflow-hidden">
					<img
						src={userData.coverImage}
						alt="Profile cover"
						className="w-full h-full object-cover opacity-60"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
				</div>

				{/* Profile Info */}
				<div className="container mx-auto px-4 relative -mt-16 md:-mt-20">
					<div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
						{/* Profile Picture */}
						<div className="relative">
							<div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background overflow-hidden bg-muted">
								<img
									src={userData.avatar}
									alt={userData.name}
									className="w-full h-full object-cover"
									onError={(e) => {
										const target =
											e.target as HTMLImageElement;
										target.src = "/default-avatar.png";
									}}
								/>
							</div>
						</div>

						{/* User Info */}
						<div className="flex-1 min-w-0">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between">
								<div>
									<h1 className="text-2xl md:text-3xl text-foreground mb-1">
										{userData.name}
									</h1>
									<p className="text-muted-foreground mb-2">
										{userData.username}
									</p>
									<div className="flex items-center space-x-2 mb-4 flex-wrap">
										<Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-green-400/30 shadow-lg">
											<Music className="w-3 h-3 mr-1 fill-current" />
											SPOTIFY USER
										</Badge>
										{userData.badges.map((badge, index) => (
											<Badge
												key={index}
												variant="outline"
												className="border-accent/50 text-accent"
											>
												{badge}
											</Badge>
										))}
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex items-center space-x-3">
									{userData.spotifyProfile && (
										<Button
											variant="outline"
											className="border-green-500/50 text-green-400 hover:bg-green-500/10"
											onClick={() =>
												window.open(
													userData.spotifyProfile,
													"_blank",
												)
											}
										>
											<ExternalLink className="w-4 h-4 mr-2" />
											Spotify Profile
										</Button>
									)}
									<Button
										variant="outline"
										size="icon"
										className="border-border text-muted-foreground hover:bg-muted"
									>
										<Settings className="w-4 h-4" />
									</Button>
								</div>
							</div>

							<p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed">
								{userData.bio}
							</p>

							{/* Stats */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
								<div className="text-center">
									<p className="text-foreground text-xl">
										{userData.stats.reviews}
									</p>
									<p className="text-muted-foreground text-sm">
										Reviews
									</p>
								</div>
								<div className="text-center">
									<p className="text-foreground text-xl">
										{userData.stats.followers.toLocaleString()}
									</p>
									<p className="text-muted-foreground text-sm">
										Followers
									</p>
								</div>
								<div className="text-center">
									<p className="text-foreground text-xl">
										{userData.stats.following}
									</p>
									<p className="text-muted-foreground text-sm">
										Following
									</p>
								</div>
								<div className="text-center">
									<p className="text-foreground text-xl">
										{userData.stats.likes.toLocaleString()}
									</p>
									<p className="text-muted-foreground text-sm">
										Likes
									</p>
								</div>
							</div>

							{/* Meta Info */}
							<div className="flex items-center space-x-6 text-muted-foreground text-sm">
								<div className="flex items-center space-x-1">
									<Calendar className="w-4 h-4" />
									<span>{userData.joinDate}</span>
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
					<TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border">
						<TabsTrigger
							value="reviews"
							className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
						>
							Reviews
						</TabsTrigger>
						<TabsTrigger
							value="favorites"
							className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
						>
							Favorites
						</TabsTrigger>
						<TabsTrigger
							value="following"
							className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
						>
							Following
						</TabsTrigger>
						<TabsTrigger
							value="activity"
							className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
						>
							Activity
						</TabsTrigger>
					</TabsList>

					<TabsContent value="reviews" className="space-y-6 mt-6">
						<div className="flex items-center justify-between">
							<h3 className="text-foreground text-lg">
								Recent Reviews
							</h3>
							<Badge className="bg-accent/20 text-accent border-accent/30">
								{userData.stats.reviews} Total
							</Badge>
						</div>

						<div className="grid gap-4">
							{recentReviews.map((review) => (
								<Card
									key={review.id}
									className="bg-card/60 border-border hover:bg-card transition-all duration-300"
								>
									<CardContent className="p-6">
										<div className="flex items-start justify-between mb-4">
											<div>
												<h4 className="text-foreground mb-1 font-medium">
													{review.songTitle}
												</h4>
												<p className="text-muted-foreground text-sm mb-2">
													by {review.artist}
												</p>
												<div className="flex items-center space-x-2">
													{renderVinyls(
														review.rating,
													)}
													<span className="text-muted-foreground text-sm">
														• {review.timeAgo}
													</span>
												</div>
											</div>
										</div>

										<p className="text-muted-foreground mb-4 leading-relaxed">
											{review.reviewText}
										</p>

										<div className="flex items-center space-x-4">
											<button className="flex items-center space-x-1 text-muted-foreground hover:text-red-400 text-sm transition-colors">
												<Heart className="w-4 h-4" />
												<span>{review.likes}</span>
											</button>
											<button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground text-sm transition-colors">
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
							<h3 className="text-foreground text-lg">
								Favorite Genres
							</h3>
						</div>

						<div className="flex flex-wrap gap-2">
							{favoriteGenres.map((genre, index) => (
								<Badge
									key={index}
									className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/30 cursor-pointer"
								>
									<Music className="w-3 h-3 mr-1" />
									{genre}
								</Badge>
							))}
						</div>

						<Card className="bg-card/60 border-border">
							<CardContent className="p-6 text-center">
								<Heart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
								<h4 className="text-foreground mb-2">
									No Favorite Songs Yet
								</h4>
								<p className="text-muted-foreground">
									Start hearting songs to see them here!
								</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="following" className="space-y-6 mt-6">
						<div className="flex items-center justify-between">
							<h3 className="text-foreground text-lg">
								Following
							</h3>
							<Badge className="bg-accent/20 text-accent border-accent/30">
								{userData.stats.following} Users
							</Badge>
						</div>

						<Card className="bg-card/60 border-border">
							<CardContent className="p-6 text-center">
								<Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
								<h4 className="text-foreground mb-2">
									Following List
								</h4>
								<p className="text-muted-foreground">
									Users you follow will appear here
								</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="activity" className="space-y-6 mt-6">
						<div className="flex items-center justify-between">
							<h3 className="text-foreground text-lg">
								Recent Activity
							</h3>
						</div>

						<Card className="bg-card/60 border-border">
							<CardContent className="p-6 text-center">
								<Zap className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
								<h4 className="text-foreground mb-2">
									Activity Feed
								</h4>
								<p className="text-muted-foreground">
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

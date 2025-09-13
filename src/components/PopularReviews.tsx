import { Card, CardContent } from "./ui/card";
import { MessageSquare } from "lucide-react";

import { VinylRecordIcon } from "./VinylRecordIcon";

interface Review {
	id: number;
	userName: string;
	userAvatar: string;
	rating: number;
	reviewText: string;
	songTitle: string;
	artist: string;
	albumArt: string;
	timeAgo: string;
	likes: number;
}

export function PopularReviews() {
	const popularReviews: Review[] = [
		{
			id: 1,
			userName: "MusicLover92",
			userAvatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
			rating: 5,
			reviewText:
				"This track absolutely blew me away! The production quality is incredible and the emotional depth in the lyrics really resonates. Been on repeat for days now.",
			songTitle: "Midnight Reflections",
			artist: "Luna Eclipse",
			albumArt:
				"https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWwlMjByZWNvcmR8ZW58MXx8fHwxNzU3NzE2MDU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			timeAgo: "2 hours ago",
			likes: 47,
		},
		{
			id: 2,
			userName: "VinylCollector",
			userAvatar:
				"https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
			rating: 4,
			reviewText:
				"Great synth work and nostalgic vibes throughout. Reminds me of the classic 80s sound but with a modern twist. Solid addition to any playlist.",
			songTitle: "Neon Dreams",
			artist: "Synth Wave",
			albumArt:
				"https://images.unsplash.com/photo-1562712558-ac2eaab4a3b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwYXJ0d29ya3xlbnwxfHx8fDE3NTc3Mzc2OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			timeAgo: "5 hours ago",
			likes: 23,
		},
		{
			id: 3,
			userName: "JazzFanatic",
			userAvatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
			rating: 5,
			reviewText:
				"Pure magic! The way they blend traditional jazz with contemporary elements is masterful. Every note feels intentional and the improvisation sections are breathtaking.",
			songTitle: "Jazz at Midnight",
			artist: "Blue Note Quartet",
			albumArt:
				"https://images.unsplash.com/photo-1713771541849-7909c4a9431a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWMlMjBhbGJ1bXxlbnwxfHx8fDE3NTc3Mzc2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			timeAgo: "1 day ago",
			likes: 89,
		},
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
		<section className="py-16 px-4 bg-background/20">
			<div className="container mx-auto max-w-7xl">
				<div className="mb-12 text-center">
					<h2 className="text-foreground mb-2">Recent Reviews</h2>
					<div className="w-32 h-0.5 bg-accent/50 mx-auto"></div>
				</div>

				{/* Review Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{popularReviews.map((review) => (
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
										{review.reviewText}
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
										<button className="text-accent hover:text-accent/80 text-xs transition-colors">
											Read full review →
										</button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

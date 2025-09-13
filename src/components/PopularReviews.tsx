import { Card, CardContent } from "./ui/card";
import { Star, MessageSquare } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      reviewText: "This track absolutely blew me away! The production quality is incredible and the emotional depth in the lyrics really resonates. Been on repeat for days now.",
      songTitle: "Midnight Reflections",
      artist: "Luna Eclipse",
      albumArt: "https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWwlMjByZWNvcmR8ZW58MXx8fHwxNzU3NzE2MDU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      timeAgo: "2 hours ago",
      likes: 47
    },
    {
      id: 2,
      userName: "VinylCollector",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      reviewText: "Great synth work and nostalgic vibes throughout. Reminds me of the classic 80s sound but with a modern twist. Solid addition to any playlist.",
      songTitle: "Neon Dreams",
      artist: "Synth Wave",
      albumArt: "https://images.unsplash.com/photo-1562712558-ac2eaab4a3b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwYXJ0d29ya3xlbnwxfHx8fDE3NTc3Mzc2OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      timeAgo: "5 hours ago",
      likes: 23
    },
    {
      id: 3,
      userName: "JazzFanatic",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      reviewText: "Pure magic! The way they blend traditional jazz with contemporary elements is masterful. Every note feels intentional and the improvisation sections are breathtaking.",
      songTitle: "Jazz at Midnight",
      artist: "Blue Note Quartet",
      albumArt: "https://images.unsplash.com/photo-1713771541849-7909c4a9431a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWMlMjBhbGJ1bXxlbnwxfHx8fDE3NTc3Mzc2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      timeAgo: "1 day ago",
      likes: 89
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 px-4 bg-black/20">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-white mb-2">
            Recent Reviews
          </h2>
          <div className="w-32 h-0.5 bg-white/30 mx-auto"></div>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularReviews.map((review) => (
            <Card 
              key={review.id} 
              className="bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 cursor-pointer group relative overflow-hidden"
            >
              <CardContent className="p-6">
                {/* Album Art - positioned in top right corner */}
                <div className="absolute top-4 right-4 w-16 h-16 rounded-lg overflow-hidden border-2 border-white/20">
                  <ImageWithFallback
                    src={review.albumArt}
                    alt={`${review.songTitle} album art`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/30">
                    <ImageWithFallback
                      src={review.userAvatar}
                      alt={`${review.userName} avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 pr-20">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white mb-1">{review.userName}</h4>
                    </div>
                    <p className="text-gray-400 text-sm">{review.timeAgo}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  {renderStars(review.rating)}
                </div>

                {/* Review Text */}
                <div className="mb-4">
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                    {review.reviewText}
                  </p>
                </div>

                {/* Song Info */}
                <div className="border-t border-gray-700/50 pt-4">
                  <h5 className="text-white text-sm mb-1">{review.songTitle}</h5>
                  <p className="text-gray-400 text-xs mb-3">{review.artist}</p>
                  
                  {/* Likes */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-400 text-xs">
                      <MessageSquare className="w-3 h-3" />
                      <span>{review.likes} likes</span>
                    </div>
                    <button className="text-purple-400 hover:text-purple-300 text-xs transition-colors">
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
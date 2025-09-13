'use client';

import { useEffect, useRef } from 'react';

// Hardcoded album data
const albums = [
  { id: 1, title: 'Blonde', artist: 'Frank Ocean', imageUrl: '/album1.jpg' },
  { id: 2, title: 'To Pimp a Butterfly', artist: 'Kendrick Lamar', imageUrl: '/album2.jpg' },
  { id: 3, title: 'Igor', artist: 'Tyler, The Creator', imageUrl: '/album3.jpg' },
  { id: 4, title: 'Flower Boy', artist: 'Tyler, The Creator', imageUrl: '/album4.jpg' },
  { id: 5, title: 'DAMN.', artist: 'Kendrick Lamar', imageUrl: '/album5.jpg' },
  { id: 6, title: 'Channel Orange', artist: 'Frank Ocean', imageUrl: '/album6.jpg' },
];

// Hardcoded recent reviews
const recentReviews = [
  {
    id: 1,
    album: 'Blonde',
    artist: 'Frank Ocean',
    rating: 5,
    reviewText: 'A masterpiece that showcases Frank Ocean\'s incredible vocal range and songwriting ability. Every track is perfectly crafted.',
    imageUrl: '/album1.jpg'
  },
  {
    id: 2,
    album: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    rating: 4,
    reviewText: 'Complex jazz-influenced hip-hop that tackles social issues with incredible lyrical depth. A modern classic.',
    imageUrl: '/album2.jpg'
  },
  {
    id: 3,
    album: 'Igor',
    artist: 'Tyler, The Creator',
    rating: 4,
    reviewText: 'Tyler\'s most cohesive and emotional work. The production is lush and the themes of love and heartbreak are handled beautifully.',
    imageUrl: '/album3.jpg'
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= rating ? 'text-yellow-400' : 'text-gray-600'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const AlbumCard = ({ album }: { album: typeof albums[0] }) => {
  return (
    <div className="flex-shrink-0 w-80 group cursor-pointer">
      <div className="relative">
        <div className="w-80 h-80 bg-gray-800 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-lg">
          <span className="text-gray-500 text-lg">album</span>
        </div>
      </div>
      <h3 className="font-semibold text-white truncate text-lg">{album.title}</h3>
      <p className="text-gray-400 truncate">{album.artist}</p>
    </div>
  );
};

const ReviewCard = ({ review }: { review: typeof recentReviews[0] }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
          <span className="text-gray-500 text-xs">album</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-white">{review.album}</h4>
              <p className="text-gray-400 text-sm">{review.artist}</p>
            </div>
            <StarRating rating={review.rating} />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{review.reviewText}</p>
        </div>
      </div>
    </div>
  );
};

export default function Homepage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationId: number;
    let isScrolling = true;
    const scrollSpeed = 0.5; // pixels per frame

    const autoScroll = () => {
      if (!isScrolling) return;
      
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      // Calculate one-third of the total scroll width (where we reset)
      const resetPoint = container.scrollWidth / 3;
      
      if (currentScroll >= resetPoint) {
        // Reset to beginning for seamless loop
        container.scrollLeft = 0;
      } else {
        // Continue scrolling
        container.scrollLeft = currentScroll + scrollSpeed;
      }
      
      animationId = requestAnimationFrame(autoScroll);
    };

    // Start autoscrolling
    animationId = requestAnimationFrame(autoScroll);

    // Pause on hover
    const handleMouseEnter = () => {
      isScrolling = false;
    };

    const handleMouseLeave = () => {
      isScrolling = true;
      if (!animationId) {
        animationId = requestAnimationFrame(autoScroll);
      }
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">text</h1>
          <p className="text-gray-400">popular trends?</p>
        </div>

        {/* Albums Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Albums</h2>
            <span className="text-gray-400 text-lg">→</span>
          </div>
          
          {/* Horizontal Scrolling Albums */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide px-2"
          >
            <div className="flex gap-8 pb-6 pr-8" style={{ width: 'max-content' }}>
              {/* Duplicate albums for seamless infinite scroll */}
              {[...albums, ...albums, ...albums].map((album, index) => (
                <AlbumCard key={`${album.id}-${index}`} album={album} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews Section */}
        <div>
          <h2 className="text-xl font-semibold mb-6">see recent reviews...</h2>
          <div className="max-w-4xl">
            {recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Star, Calendar, User, MessageSquare, Shield, Music } from 'lucide-react';

const SongDetailsPage = () => {
  const [activeTab, setActiveTab] = useState('reviews');

  // Sample song data
  const songData = {
    title: "Midnight Dreams",
    artist: "Aurora Waves",
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    overallRating: 4.3,
    releaseDate: "March 15, 2024",
    aiSummary: "Critics praise the ethereal production and haunting vocals, with many highlighting the song's emotional depth and innovative sound design. Community reviews emphasize the track's replay value and its ability to evoke strong emotional responses. Some note the unconventional structure as both ambitious and occasionally challenging.",
    verifiedCritic: {
      rating: 4.5,
      text: "A masterpiece of modern indie pop that showcases Aurora Waves' evolution as an artist. The layered harmonies and atmospheric production create an immersive listening experience that rewards repeated listening."
    },
    communityRating: {
      rating: 4.1,
      text: "Beautiful and haunting. This song has been on repeat for weeks - the way it builds from whisper to soaring chorus gives me chills every time."
    }
  };

  const criticReviews = [
    {
      id: 1,
      reviewer: "Music Weekly",
      rating: 4.5,
      text: "Aurora Waves delivers a stunning sonic journey that balances intimacy with grandeur. The production is meticulous without feeling sterile.",
      verified: true
    },
    {
      id: 2,
      reviewer: "Indie Pulse",
      rating: 4.0,
      text: "While not groundbreaking, 'Midnight Dreams' showcases solid songwriting and impressive vocal range. A worthy addition to any playlist.",
      verified: true
    },
    {
      id: 3,
      reviewer: "Sound & Vision",
      rating: 5.0,
      text: "Transcendent. This track represents everything that makes modern indie music exciting - innovation without pretension.",
      verified: true
    }
  ];

  const StarRating = ({ rating, size = 16 }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : star - 0.5 <= rating
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="flex flex-col lg:flex-row">
            {/* Album Art */}
            <div className="lg:w-1/3">
              <img
                src={songData.albumArt}
                alt={`${songData.title} album art`}
                className="w-full h-64 lg:h-full object-cover"
              />
            </div>
            
            {/* Song Info */}
            <div className="lg:w-2/3 p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{songData.title}</h1>
                  <h2 className="text-2xl text-gray-600 mb-4">{songData.artist}</h2>
                </div>
                <div className="text-right">
                  <StarRating rating={songData.overallRating} size={24} />
                  <p className="text-sm text-gray-500 mt-1">Overall Rating</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{songData.releaseDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music size={16} />
                  <span>Indie Pop</span>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  AI Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">{songData.aiSummary}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Verified Critic Rating */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-green-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">Verified Critic</h3>
            </div>
            <StarRating rating={songData.verifiedCritic.rating} size={20} />
            <p className="text-gray-700 mt-3 leading-relaxed">{songData.verifiedCritic.text}</p>
          </div>

          {/* Community Rating */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-blue-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">Community Favorite</h3>
            </div>
            <StarRating rating={songData.communityRating.rating} size={20} />
            <p className="text-gray-700 mt-3 leading-relaxed">{songData.communityRating.text}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'reviews'
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageSquare className="inline mr-2" size={16} />
                Critic Reviews
              </button>
              <button
                onClick={() => setActiveTab('lyrics')}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'lyrics'
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Music className="inline mr-2" size={16} />
                Lyrics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {criticReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900">{review.reviewer}</h4>
                        {review.verified && (
                          <Shield className="text-green-600" size={16} />
                        )}
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'lyrics' && (
              <div className="text-center py-12">
                <Music className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Lyrics Not Available</h3>
                <p className="text-gray-500">
                  Lyrics for this song are not currently available. Check back later or contact the artist for more information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetailsPage;
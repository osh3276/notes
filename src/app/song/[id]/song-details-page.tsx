'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface AudioFeatures {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  time_signature: number;
}

interface Artist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
  genres: string[];
  followers: number;
  popularity: number;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

interface Album {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date: string;
  total_tracks: number;
  external_urls: {
    spotify: string;
  };
  genres: string[];
  label: string | null;
  album_type: string;
}

interface TrackDetails {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  disc_number: number;
  external_urls: {
    spotify: string;
  };
  external_ids: {
    isrc?: string;
  };
  available_markets: string[];
  is_local: boolean;
  audio_features: AudioFeatures | null;
}

export default function SongDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [track, setTrack] = useState<TrackDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trackId = params.id as string;

  useEffect(() => {
    if (!trackId) return;

    const fetchTrackDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/track/${trackId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch track details');
        }

        setTrack(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackDetails();
  }, [trackId]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getKeyName = (key: number) => {
    const keys = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
    return keys[key] || 'Unknown';
  };

  const getModeName = (mode: number) => {
    return mode === 1 ? 'Major' : 'Minor';
  };

  const getAudioFeatureLabel = (feature: string, value: number) => {
    const percentage = Math.round(value * 100);

    const labels: { [key: string]: string[] } = {
      danceability: ['Not Danceable', 'Slightly Danceable', 'Moderately Danceable', 'Very Danceable', 'Extremely Danceable'],
      energy: ['Very Calm', 'Calm', 'Moderate Energy', 'High Energy', 'Very High Energy'],
      valence: ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'],
      acousticness: ['Not Acoustic', 'Slightly Acoustic', 'Moderately Acoustic', 'Very Acoustic', 'Completely Acoustic'],
      instrumentalness: ['Vocal', 'Mostly Vocal', 'Mixed', 'Mostly Instrumental', 'Instrumental'],
      liveness: ['Studio', 'Slightly Live', 'Moderately Live', 'Very Live', 'Live Recording'],
      speechiness: ['Musical', 'Slightly Spoken', 'Mixed', 'Very Spoken', 'Spoken Word']
    };

    const categoryLabels = labels[feature];
    if (!categoryLabels) return `${percentage}%`;

    const index = Math.min(Math.floor(value * 5), 4);
    return `${categoryLabels[index]} (${percentage}%)`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading track details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Track</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Track not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-green-600 hover:text-green-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </button>
        </div>

        {/* Main track info */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-64 w-full object-cover md:h-full md:w-64"
                src={track.album.images[0]?.url || '/placeholder-album.png'}
                alt={track.album.name}
              />
            </div>
            <div className="p-8 flex-1">
              <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">
                {track.album.album_type}
              </div>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">{track.name}</h1>
              <p className="mt-2 text-xl text-gray-600">
                by {track.artists.map(artist => artist.name).join(', ')}
              </p>
              <p className="mt-1 text-lg text-gray-500">
                from <span className="font-medium">{track.album.name}</span>
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">{formatDuration(track.duration_ms)}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-gray-600">{track.popularity}% popularity</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">{track.album.release_date}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {track.preview_url && (
                  <audio controls className="h-10">
                    <source src={track.preview_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Open in Spotify
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Track Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Track Number:</span>
                <span className="font-medium">{track.track_number} of {track.album.total_tracks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Disc Number:</span>
                <span className="font-medium">{track.disc_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Explicit:</span>
                <span className="font-medium">{track.explicit ? 'Yes' : 'No'}</span>
              </div>
              {track.external_ids.isrc && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ISRC:</span>
                  <span className="font-medium">{track.external_ids.isrc}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Available Markets:</span>
                <span className="font-medium">{track.available_markets.length} countries</span>
              </div>
            </div>
          </div>

          {/* Audio Features */}
          {track.audio_features && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Audio Features</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Danceability:</span>
                    <span className="text-sm font-medium">{getAudioFeatureLabel('danceability', track.audio_features.danceability)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${track.audio_features.danceability * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Energy:</span>
                    <span className="text-sm font-medium">{getAudioFeatureLabel('energy', track.audio_features.energy)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${track.audio_features.energy * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Valence (Mood):</span>
                    <span className="text-sm font-medium">{getAudioFeatureLabel('valence', track.audio_features.valence)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${track.audio_features.valence * 100}%` }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{Math.round(track.audio_features.tempo)}</div>
                    <div className="text-sm text-gray-600">BPM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{getKeyName(track.audio_features.key)} {getModeName(track.audio_features.mode)}</div>
                    <div className="text-sm text-gray-600">Key</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Artists */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Artists</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {track.artists.map((artist) => (
              <div key={artist.id} className="flex items-center space-x-4">
                {artist.images[0] && (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{artist.name}</h3>
                  <p className="text-sm text-gray-600">{formatNumber(artist.followers)} followers</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {artist.genres.slice(0, 2).map((genre, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {genre}
                      </span>
                    ))}
                  </div>
                  <a
                    href={artist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    View on Spotify →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Album Info */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Album Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{track.album.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Release Date:</span>
                  <span>{track.album.release_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tracks:</span>
                  <span>{track.album.total_tracks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="capitalize">{track.album.album_type}</span>
                </div>
                {track.album.label && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Label:</span>
                    <span>{track.album.label}</span>
                  </div>
                )}
              </div>
              <a
                href={track.album.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-green-600 hover:text-green-800 font-medium"
              >
                View Album on Spotify →
              </a>
            </div>
            <div>
              {track.album.genres.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {track.album.genres.map((genre, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

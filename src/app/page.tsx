"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { PopularSongs } from "@/components/PopularSongs";
import { PopularReviews } from "@/components/PopularReviews";
import { SongDetail } from "@/components/SongDetail";
import { UserProfile } from "@/components/UserProfile";
import { ArtistProfile } from "@/components/ArtistProfile";
import { GenrePage } from "@/components/GenrePage";

interface Song {
	id: number;
	title: string;
	artist: string;
	albumArt: string;
	rating: number;
	reviewCount: number;
	genres: string[];
}

export default function App() {
	const [currentPage, setCurrentPage] = useState<
		"home" | "song" | "profile" | "artist" | "genre"
	>("home");
	const [selectedSong, setSelectedSong] = useState<Song | null>(null);
	const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
	const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

	const handleSongSelect = (song: Song) => {
		setSelectedSong(song);
		setCurrentPage("song");
	};

	const handleBackToHome = () => {
		setCurrentPage("home");
		setSelectedSong(null);
		setSelectedArtist(null);
		setSelectedGenre(null);
	};

	const handleProfileClick = () => {
		setCurrentPage("profile");
	};

	const handleArtistClick = (artistName: string) => {
		setSelectedArtist(artistName);
		setCurrentPage("artist");
	};

	const handleGenreClick = (genre: string) => {
		setSelectedGenre(genre);
		setCurrentPage("genre");
	};

	if (currentPage === "song" && selectedSong) {
		return (
			<div className="min-h-screen bg-background dark">
				<SongDetail
					song={selectedSong}
					onBack={handleBackToHome}
					onArtistClick={handleArtistClick}
					onGenreClick={handleGenreClick}
				/>
			</div>
		);
	}

	if (currentPage === "profile") {
		return (
			<div className="min-h-screen bg-background dark">
				<UserProfile onBack={handleBackToHome} />
			</div>
		);
	}

	if (currentPage === "artist" && selectedArtist) {
		return (
			<div className="min-h-screen bg-background dark">
				<ArtistProfile
					artistName={selectedArtist}
					onBack={handleBackToHome}
					onGenreClick={handleGenreClick}
				/>
			</div>
		);
	}

	if (currentPage === "genre" && selectedGenre) {
		return (
			<div className="min-h-screen bg-background dark">
				<GenrePage
					genre={selectedGenre}
					onBack={handleBackToHome}
					onSongSelect={handleSongSelect}
					onArtistClick={handleArtistClick}
				/>
			</div>
		);
	}

	const handleSearchSongSelect = async (songId: string) => {
		try {
			const response = await fetch(`/api/track/${songId}`);
			const data = await response.json();
			
			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch song details');
			}

			// Convert Spotify track to your Song format
			const song: Song = {
				id: parseInt(data.id), // or use the Spotify ID directly if you update your Song interface
				title: data.name,
				artist: data.artists[0].name,
				albumArt: data.album.images[0]?.url || '',
				rating: data.popularity / 20, // Convert 0-100 popularity to 0-5 rating
				reviewCount: 0, // You might want to fetch this from your database
				genres: data.genres || []
			};

			handleSongSelect(song);
		} catch (error) {
			console.error('Error fetching song details:', error);
		}
	};

	return (
		<div className="min-h-screen bg-black dark">
			<Header 
				onProfileClick={handleProfileClick}
				onSongSelect={handleSearchSongSelect}
			/>
			<main className="relative">
				<PopularSongs
					onSongSelect={handleSongSelect}
					onGenreClick={handleGenreClick}
				/>
				<PopularReviews />
			</main>
		</div>
	);
}

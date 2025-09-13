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

	return (
		<div className="min-h-screen bg-background dark">
			<Header onProfileClick={handleProfileClick} />
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

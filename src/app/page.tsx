"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { PopularSongs } from "@/components/PopularSongs";
import { RecentReviews } from "@/components/RecentReviews";
import { SongDetail } from "@/components/SongDetail";
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
	spotifyUrl?: string;
}

export default function App() {
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState<
		"home" | "song" | "artist" | "genre"
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
		router.push("/profile");
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
			<div className="min-h-screen bg-[#1A1A1A] dark">
				<SongDetail
					song={{ ...selectedSong, id: String(selectedSong.id) }}
					onBack={handleBackToHome}
					onArtistClick={handleArtistClick}
					onGenreClick={handleGenreClick}
				/>
			</div>
		);
	}

	if (currentPage === "artist" && selectedArtist) {
		return (
			<div className="min-h-screen bg-[#1A1A1A] dark">
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
			<div className="min-h-screen bg-[#1A1A1A] dark">
				<GenrePage
					genre={selectedGenre}
					onBack={handleBackToHome}
					onSongSelect={handleSongSelect}
					onArtistClick={handleArtistClick}
				/>
			</div>
		);
	}

	const handleSearchSongSelect = (songId: string) => {
		router.push(`/song/${songId}`);
	};

	return (
		<div className="min-h-screen bg-[#1A1A1A] dark">
			<Header
				onProfileClick={handleProfileClick}
				onSongSelect={handleSearchSongSelect}
			/>
			<main className="relative">
				<PopularSongs
					onSongSelect={(songFromPopularSongs) => {
						const songForHandler = {
							...songFromPopularSongs,
							id: Number(songFromPopularSongs.id), // Convert id from string to number
						};
						handleSongSelect(songForHandler);
					}}
					onGenreClick={handleGenreClick}
				/>
				<RecentReviews />
			</main>
		</div>
	);
}

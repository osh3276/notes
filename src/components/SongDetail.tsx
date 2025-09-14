import { useState, useEffect } from "react";
import {
	ArrowLeft,
	MessageSquare,
	Heart,
	Share2,
	PlayCircle,
	CheckCircle,
	Sparkles,
	TrendingUp,
	Users,
	Star,
	Pause,
	SkipBack,
	SkipForward,
	Volume2,
	Plus,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

import { VinylRecordIcon } from "./VinylRecordIcon";
import { GenreTag } from "./GenreUtils";
import { Textarea } from "./ui/textarea";

interface Song {
	id: number;
	title: string;
	artist: string;
	albumArt: string;
	rating: number;
	reviewCount: number;
	genres: string[];
	album?: string;
	releaseDate?: string;
	duration?: string;
	spotifyUrl?: string;
	aiSummary?: string;
}

interface Review {
	id: number;
	userName: string;
	userAvatar?: string;
	rating: number;
	reviewText: string;
	timeAgo: string;
	likes: number;
	isLiked?: boolean;
	isCritic?: boolean;
	publication?: string;
	isSuperfan?: boolean;
}

interface SongDetailProps {
	song: Song;
	onBack: () => void;
	onArtistClick?: (artistName: string) => void;
	onGenreClick?: (genre: string) => void;
}

export function SongDetail({
	song,
	onBack,
	onArtistClick,
	onGenreClick,
}: SongDetailProps) {
	const [isFavorited, setIsFavorited] = useState(false);
	const [reviewText, setReviewText] = useState("");
	const [userRating, setUserRating] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration] = useState(263); // 4:23 in seconds
	const [nowPlayingComments, setNowPlayingComments] = useState([
		{
			id: 1,
			user: "MusicLover99",
			text: "This track is absolutely incredible! The production quality is top-notch.",
			time: "2 minutes ago",
			avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
			likes: 15,
		},
		{
			id: 2,
			user: "BeatHead",
			text: "Can't stop listening to this. The beat is so addictive!",
			time: "5 minutes ago",
			avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
			likes: 8,
		},
		{
			id: 3,
			user: "AudioPhile",
			text: "The mixing on this track is perfection. Every element has its place.",
			time: "10 minutes ago",
			avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
			likes: 23,
		},
		{
			id: 4,
			user: "SoundWave23",
			text: "This is going straight to my favorites playlist!",
			time: "15 minutes ago",
			avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
			likes: 12,
		},
		{
			id: 5,
			user: "VinylCollector",
			text: "Reminds me of the golden age of this genre. Fantastic work!",
			time: "20 minutes ago",
			avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
			likes: 19,
		},
	]);
	const [newComment, setNewComment] = useState("");

	// Function to generate critic reviews based on song ID
	const getCriticReviews = (songId: number): Review[] => {
		const criticDatabase: Record<number, Review[]> = {
			// Song 1: 4 reviews
			1: [
				{
					id: 1,
					userName: "Anthony Fantano",
					userAvatar:
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"This track represents a significant evolution in the artist's sound palette. The production choices here are incredibly deliberate - every layer serves a purpose in building the song's emotional architecture.",
					timeAgo: "1 day ago",
					likes: 234,
					isLiked: false,
					isCritic: true,
					publication: "The Needle Drop",
				},
				{
					id: 2,
					userName: "Pitchfork Staff",
					userAvatar:
						"https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"A compelling entry that showcases technical proficiency without sacrificing emotional resonance. The artist demonstrates an understanding of contemporary production trends while maintaining their distinctive voice.",
					timeAgo: "2 days ago",
					likes: 189,
					isLiked: true,
					isCritic: true,
					publication: "Pitchfork",
				},
				{
					id: 3,
					userName: "Rolling Stone",
					userAvatar:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"This is the kind of track that reminds you why you fell in love with music in the first place. The songwriting is impeccable - every verse builds naturally into a chorus.",
					timeAgo: "3 days ago",
					likes: 312,
					isLiked: false,
					isCritic: true,
					publication: "Rolling Stone",
				},
				{
					id: 4,
					userName: "AllMusic Guide",
					userAvatar:
						"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"This represents a quantum leap in artistic maturity. The compositional approach demonstrates deep understanding of both traditional songcraft and modern production techniques.",
					timeAgo: "4 days ago",
					likes: 167,
					isLiked: false,
					isCritic: true,
					publication: "AllMusic",
				},
			],
			// Song 2: 2 reviews
			2: [
				{
					id: 21,
					userName: "NME Magazine",
					userAvatar:
						"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"A bold experimental venture that showcases the artist's willingness to push boundaries. The unconventional song structure keeps listeners engaged throughout, though some transitions feel abrupt.",
					timeAgo: "12 hours ago",
					likes: 156,
					isLiked: false,
					isCritic: true,
					publication: "NME",
				},
				{
					id: 22,
					userName: "The Guardian",
					userAvatar:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"An intriguing departure that reveals new facets of the artist's creative identity. The risk-taking pays off more often than not, resulting in moments of genuine surprise.",
					timeAgo: "3 days ago",
					likes: 203,
					isLiked: false,
					isCritic: true,
					publication: "The Guardian",
				},
			],
			// Song 3: 5 reviews
			3: [
				{
					id: 31,
					userName: "Consequence of Sound",
					userAvatar:
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"A masterclass in contemporary songwriting. Every element - from the intricate harmonies to the dynamic percussion - works in perfect harmony to create something truly special.",
					timeAgo: "6 hours ago",
					likes: 278,
					isLiked: true,
					isCritic: true,
					publication: "Consequence of Sound",
				},
				{
					id: 32,
					userName: "Music Radar",
					userAvatar:
						"https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"The production quality here is absolutely pristine. The artist has clearly evolved their sound, incorporating influences from multiple genres while maintaining their unique voice.",
					timeAgo: "18 hours ago",
					likes: 145,
					isLiked: false,
					isCritic: true,
					publication: "Music Radar",
				},
				{
					id: 33,
					userName: "AllMusic Guide",
					userAvatar:
						"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"This represents a quantum leap in artistic maturity. Each section flows naturally into the next, creating a cohesive listening experience.",
					timeAgo: "1 day ago",
					likes: 298,
					isLiked: false,
					isCritic: true,
					publication: "AllMusic",
				},
				{
					id: 34,
					userName: "Pitchfork Staff",
					userAvatar:
						"https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"An ambitious work that largely succeeds in its scope. The sonic textures are rich and the emotional depth is genuine.",
					timeAgo: "2 days ago",
					likes: 187,
					isLiked: true,
					isCritic: true,
					publication: "Pitchfork",
				},
				{
					id: 35,
					userName: "Rolling Stone",
					userAvatar:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"A stunning achievement that showcases the full range of the artist's capabilities. This will be remembered as a defining moment.",
					timeAgo: "3 days ago",
					likes: 356,
					isLiked: false,
					isCritic: true,
					publication: "Rolling Stone",
				},
			],
			// Song 4: 3 reviews
			4: [
				{
					id: 41,
					userName: "Spin Magazine",
					userAvatar:
						"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					rating: 3,
					reviewText:
						"An interesting experiment that doesn't quite hit the mark. The concept is solid but the execution feels rushed. With more development, this could have been something special.",
					timeAgo: "2 hours ago",
					likes: 67,
					isLiked: false,
					isCritic: true,
					publication: "Spin",
				},
				{
					id: 42,
					userName: "Billboard Review",
					userAvatar:
						"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"A commercially savvy track that doesn't sacrifice artistic integrity. The hook is undeniably catchy while the deeper cuts reveal layers of complexity for attentive listeners.",
					timeAgo: "1 day ago",
					likes: 198,
					isLiked: true,
					isCritic: true,
					publication: "Billboard",
				},
				{
					id: 43,
					userName: "Stereogum",
					userAvatar:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"This track captures lightning in a bottle. The emotional authenticity combined with flawless technical execution creates a listening experience that feels both intimate and universal.",
					timeAgo: "2 days ago",
					likes: 312,
					isLiked: false,
					isCritic: true,
					publication: "Stereogum",
				},
			],
			// Song 5: 2 reviews
			5: [
				{
					id: 51,
					userName: "Complex Music",
					userAvatar:
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"A genre-defying piece that showcases remarkable artistic growth. The fusion of styles feels organic rather than forced, creating something genuinely innovative.",
					timeAgo: "4 hours ago",
					likes: 167,
					isLiked: true,
					isCritic: true,
					publication: "Complex",
				},
				{
					id: 52,
					userName: "Paste Magazine",
					userAvatar:
						"https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
					rating: 3,
					reviewText:
						"While the ambition is admirable, the track feels somewhat overproduced. The raw emotion that made earlier releases so compelling gets lost in the polish.",
					timeAgo: "8 hours ago",
					likes: 94,
					isLiked: false,
					isCritic: true,
					publication: "Paste",
				},
			],
			// Song 6: 4 reviews
			6: [
				{
					id: 61,
					userName: "Exclaim! Magazine",
					userAvatar:
						"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"Absolutely stunning. This is the sound of an artist hitting their creative stride. Every decision feels purposeful and the result is nothing short of mesmerizing.",
					timeAgo: "30 minutes ago",
					likes: 289,
					isLiked: false,
					isCritic: true,
					publication: "Exclaim!",
				},
				{
					id: 62,
					userName: "Under the Radar",
					userAvatar:
						"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"A beautifully crafted piece that balances accessibility with artistic depth. The songwriting demonstrates remarkable maturity and emotional intelligence.",
					timeAgo: "5 hours ago",
					likes: 134,
					isLiked: true,
					isCritic: true,
					publication: "Under the Radar",
				},
				{
					id: 63,
					userName: "Drowned in Sound",
					userAvatar:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"The attention to sonic detail here is remarkable. Each layer of the arrangement has been carefully considered, resulting in a rich, immersive listening experience.",
					timeAgo: "12 hours ago",
					likes: 176,
					isLiked: false,
					isCritic: true,
					publication: "Drowned in Sound",
				},
				{
					id: 64,
					userName: "The Quietus",
					userAvatar:
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"A transcendent piece of work that operates on multiple levels simultaneously. The creative vision here is both bold and deeply personal.",
					timeAgo: "1 day ago",
					likes: 203,
					isLiked: true,
					isCritic: true,
					publication: "The Quietus",
				},
			],
			// Song 7: 3 reviews
			7: [
				{
					id: 71,
					userName: "The Fader",
					userAvatar:
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"A career-defining moment. This track represents everything great about contemporary music - innovative production, emotionally resonant lyrics, and fearless creative vision.",
					timeAgo: "1 hour ago",
					likes: 356,
					isLiked: true,
					isCritic: true,
					publication: "The Fader",
				},
				{
					id: 72,
					userName: "Resident Advisor",
					userAvatar:
						"https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"The electronic elements are seamlessly integrated, creating textures that feel both futuristic and timeless. A sophisticated approach to genre blending.",
					timeAgo: "3 hours ago",
					likes: 187,
					isLiked: false,
					isCritic: true,
					publication: "Resident Advisor",
				},
				{
					id: 73,
					userName: "Mojo Magazine",
					userAvatar:
						"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"A powerful statement that showcases the artist's evolution. The production is crisp and the emotional weight is undeniable.",
					timeAgo: "6 hours ago",
					likes: 234,
					isLiked: false,
					isCritic: true,
					publication: "Mojo",
				},
			],
		};

		return criticDatabase[songId] || criticDatabase[1];
	};

	const criticReviews = getCriticReviews(song.id);

	// Function to generate community reviews based on song ID
	const getCommunityReviews = (songId: number): Review[] => {
		const communityDatabase: Record<number, Review[]> = {
			// Song 1: 6 reviews
			1: [
				{
					id: 104,
					userName: "MusicLover92",
					userAvatar:
						"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"This track absolutely blew me away! The production quality is incredible and the emotional depth in the lyrics really resonates. Been on repeat for days now!",
					timeAgo: "2 hours ago",
					likes: 127,
					isLiked: false,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 105,
					userName: "VinylCollector",
					userAvatar:
						"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"Great track with solid production values. The retro influences are clear but it doesn't feel derivative - the artist has put their own spin on classic sounds.",
					timeAgo: "5 hours ago",
					likes: 89,
					isLiked: true,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 106,
					userName: "AudioFan23",
					rating: 5,
					reviewText:
						"Incredible song! The production is clean and the melody is so catchy. Can't stop listening to it.",
					timeAgo: "1 day ago",
					likes: 34,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 107,
					userName: "GenreExplorer",
					rating: 4,
					reviewText:
						"Really solid track with great genre fusion. Love how they blend different styles seamlessly.",
					timeAgo: "2 days ago",
					likes: 18,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 108,
					userName: "MelodyMaven",
					userAvatar:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"The melody in this song is absolutely infectious! It's been stuck in my head for days and I'm not complaining. This is the kind of song that will still sound fresh years from now.",
					timeAgo: "3 days ago",
					likes: 156,
					isLiked: true,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 109,
					userName: "ConcertGoer",
					userAvatar:
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"Can't wait to hear this live! The energy would be incredible in a concert setting. Hope they tour soon!",
					timeAgo: "4 days ago",
					likes: 67,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
			],
			// Song 2: 4 reviews
			2: [
				{
					id: 204,
					userName: "BeatHunter",
					userAvatar:
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					rating: 3,
					reviewText:
						"Interesting direction but not sure it works for me. The experimental approach is cool but feels a bit disconnected from their usual style.",
					timeAgo: "1 hour ago",
					likes: 23,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 205,
					userName: "SoundScape99",
					userAvatar:
						"https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"Love the bold choices here! Not every experiment works but when it does, it's brilliant. The middle section is absolutely gorgeous.",
					timeAgo: "3 hours ago",
					likes: 67,
					isLiked: true,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 206,
					userName: "PlaylistCurator",
					rating: 4,
					reviewText:
						"Really unique sound. Definitely adding this to my 'Artists to Watch' playlist. Excited to see where they go next!",
					timeAgo: "8 hours ago",
					likes: 41,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 207,
					userName: "MusicTheoryNerd",
					userAvatar:
						"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"The harmonic progressions in this are fascinating! Love how they use unconventional chord changes to create tension. Really sophisticated songwriting.",
					timeAgo: "12 hours ago",
					likes: 92,
					isLiked: true,
					isCritic: false,
					isSuperfan: true,
				},
			],
			// Song 3: 8 reviews
			3: [
				{
					id: 304,
					userName: "VocalCoach_Sarah",
					userAvatar:
						"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"The vocal performance here is absolutely stunning! The range, the control, the emotion - everything is perfectly executed. This is a masterclass in singing.",
					timeAgo: "45 minutes ago",
					likes: 143,
					isLiked: true,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 305,
					userName: "StudioEngineer",
					userAvatar:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"From a technical standpoint, this is flawless. The mix is perfect, every element sits exactly where it should. You can tell this was crafted by professionals.",
					timeAgo: "2 hours ago",
					likes: 198,
					isLiked: false,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 306,
					userName: "EverydayListener",
					rating: 4,
					reviewText:
						"Really beautiful song. Makes me feel something, you know? That's all I need from music.",
					timeAgo: "6 hours ago",
					likes: 76,
					isLiked: true,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 307,
					userName: "ConcertGoer2024",
					rating: 5,
					reviewText:
						"Can't wait to hear this live! The energy in this track is incredible. This artist needs to tour ASAP.",
					timeAgo: "10 hours ago",
					likes: 89,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 308,
					userName: "SongwriterLife",
					userAvatar:
						"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"As a songwriter myself, I'm in awe of the craft here. Every line feels intentional, every chord change serves the story. This is how it's done.",
					timeAgo: "1 day ago",
					likes: 167,
					isLiked: true,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 309,
					userName: "IndieBlogger",
					userAvatar:
						"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"This is going straight to the top of my year-end list. Absolutely phenomenal work that deserves all the recognition it's getting.",
					timeAgo: "1 day ago",
					likes: 112,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 310,
					userName: "MoodPlaylist",
					rating: 5,
					reviewText:
						"Perfect for late night drives or rainy afternoons. This song has everything - emotion, technical skill, and pure artistry.",
					timeAgo: "2 days ago",
					likes: 143,
					isLiked: true,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 311,
					userName: "AudiogeekReviews",
					userAvatar:
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"Testing this on my reference monitors and it sounds incredible. The stereo imaging and depth are remarkable. True audiophile quality.",
					timeAgo: "3 days ago",
					likes: 87,
					isLiked: false,
					isCritic: false,
					isSuperfan: true,
				},
			],
			// Song 4: 5 reviews
			4: [
				{
					id: 404,
					userName: "RadioDJ_Mike",
					userAvatar:
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"This has serious radio potential. Catchy hook, great production, and just the right length. I'll be spinning this on my show for sure.",
					timeAgo: "3 hours ago",
					likes: 112,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 405,
					userName: "DanceFloorKing",
					userAvatar:
						"https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
					rating: 3,
					reviewText:
						"Good song but not really danceable. More of a listening track. Still enjoyable though!",
					timeAgo: "5 hours ago",
					likes: 34,
					isLiked: true,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 406,
					userName: "VibeChecker",
					rating: 4,
					reviewText:
						"The vibe is immaculate. Perfect for those late night drives or chill study sessions. Really hits different.",
					timeAgo: "8 hours ago",
					likes: 67,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 407,
					userName: "MusicMom",
					userAvatar:
						"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"My teenage daughter played this for me and I actually love it! Clean lyrics, great message, beautiful melody. Rare to find music that bridges generations like this.",
					timeAgo: "12 hours ago",
					likes: 203,
					isLiked: true,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 408,
					userName: "BasslineAppreciator",
					rating: 4,
					reviewText:
						"That bassline is absolutely groovy! Really holds the whole song together. Whoever played bass on this knows what they're doing.",
					timeAgo: "1 day ago",
					likes: 85,
					isLiked: false,
					isCritic: false,
					isSuperfan: true,
				},
			],
			// Song 5: 7 reviews
			5: [
				{
					id: 504,
					userName: "ArtisticSoul",
					userAvatar:
						"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"This song is pure art. The way it builds emotions and then releases them is like watching a master painter at work. Absolutely brilliant composition.",
					timeAgo: "1 hour ago",
					likes: 189,
					isLiked: true,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 505,
					userName: "GenZMusicFan",
					userAvatar:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"Okay this is actually fire 🔥 Not usually my genre but this hits different. Already shared it on my socials.",
					timeAgo: "4 hours ago",
					likes: 124,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 506,
					userName: "RetroVibes80s",
					rating: 3,
					reviewText:
						"Has some nice nostalgic elements but feels a bit overproduced for my taste. Still decent though.",
					timeAgo: "7 hours ago",
					likes: 45,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 507,
					userName: "LiveMusicLover",
					userAvatar:
						"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"I can already imagine how amazing this would sound at a live show. The dynamics and energy would translate so well to a concert setting. Hope they tour soon!",
					timeAgo: "10 hours ago",
					likes: 156,
					isLiked: true,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 508,
					userName: "CriticalEar",
					rating: 4,
					reviewText:
						"Solid songwriting with great attention to detail. A few minor production choices I'd question, but overall this is quality music.",
					timeAgo: "1 day ago",
					likes: 78,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 509,
					userName: "MusicalJourney",
					userAvatar:
						"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					rating: 4,
					reviewText:
						"This track takes you on a real journey. Love the progression and how it evolves throughout. Great storytelling through music.",
					timeAgo: "2 days ago",
					likes: 94,
					isLiked: true,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 510,
					userName: "HomestudioProducer",
					rating: 5,
					reviewText:
						"As someone who produces from home, I'm impressed by the production quality. Really shows what's possible with the right skills and creativity.",
					timeAgo: "3 days ago",
					likes: 67,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
			],
			// Song 6: 5 reviews
			6: [
				{
					id: 604,
					userName: "EmotionalConnection",
					userAvatar:
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"This song came into my life at exactly the right moment. The lyrics speak directly to my soul. Thank you for creating something so beautiful and meaningful.",
					timeAgo: "30 minutes ago",
					likes: 234,
					isLiked: true,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 605,
					userName: "ProducerInTraining",
					userAvatar:
						"https://images.unsplash.com/photo-1494790108755-2616c87d8ffe?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"Studying this track for my production class. The layering is incredible - so much depth but nothing feels cluttered. This is textbook quality.",
					timeAgo: "2 hours ago",
					likes: 178,
					isLiked: false,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 606,
					userName: "WorkoutPlaylist",
					rating: 4,
					reviewText:
						"Great energy for my morning runs! The build-up sections really motivate me to push harder. Perfect tempo too.",
					timeAgo: "5 hours ago",
					likes: 92,
					isLiked: true,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 607,
					userName: "LyricsAnalyst",
					userAvatar:
						"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"The wordplay and metaphors in this are next level. Every line has multiple layers of meaning. Poetry in motion.",
					timeAgo: "8 hours ago",
					likes: 145,
					isLiked: false,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 608,
					userName: "FirstTimeListen",
					rating: 4,
					reviewText:
						"Never heard of this artist before but wow! Instant fan. Going to check out their whole catalog now.",
					timeAgo: "12 hours ago",
					likes: 67,
					isLiked: false,
					isCritic: false,
					isSuperfan: false,
				},
			],
			// Song 7: 4 reviews
			7: [
				{
					id: 704,
					userName: "MagicalMoments",
					userAvatar:
						"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"This song gives me goosebumps every single time. There's something magical about it that I can't quite put into words. Absolutely transcendent.",
					timeAgo: "20 minutes ago",
					likes: 267,
					isLiked: true,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 705,
					userName: "MidnightListener",
					userAvatar:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"Perfect for late night contemplation. This song takes me on a journey every time I hear it. The atmosphere is incredibly immersive.",
					timeAgo: "1 hour ago",
					likes: 198,
					isLiked: false,
					isCritic: false,
					isSuperfan: true,
				},
				{
					id: 706,
					userName: "GenerationDefining",
					rating: 5,
					reviewText:
						"This is the song that will define this era of music. Mark my words - people will be talking about this track for years to come.",
					timeAgo: "3 hours ago",
					likes: 312,
					isLiked: true,
					isCritic: false,
					isSuperfan: false,
				},
				{
					id: 707,
					userName: "AudioPhileReviews",
					userAvatar:
						"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
					rating: 5,
					reviewText:
						"Testing this on my high-end audio setup and it's absolutely stunning. The spatial positioning, the frequency response - everything is perfect.",
					timeAgo: "6 hours ago",
					likes: 156,
					isLiked: false,
					isCritic: false,
					isSuperfan: true,
				},
			],
		};

		return communityDatabase[songId] || communityDatabase[1];
	};

	const communityReviews = getCommunityReviews(song.id);

	// Function to generate AI summary based on song ID
	const getAISummary = (songId: number) => {
		const aiSummaryDatabase: Record<
			number,
			{
				sentiment: string;
				description: string;
				themes: Array<{
					title: string;
					description: string;
					color: string;
				}>;
				avgRating: string;
			}
		> = {
			1: {
				sentiment: "Highly Positive",
				description:
					"Critics and fans are unanimous in their praise for this track. The consensus highlights exceptional production quality, emotional depth, and sophisticated songwriting. Both professional reviewers and the community emphasize the artist's growth and technical mastery, with particular acclaim for the dynamic arrangement and memorable melodic hooks.",
				themes: [
					{
						title: "Production Quality",
						description:
							"Consistently praised for pristine mixing, clear instrumentation, and dynamic range preservation.",
						color: "accent",
					},
					{
						title: "Emotional Impact",
						description:
							"Noted for its ability to create genuine emotional resonance and memorable musical moments.",
						color: "pink",
					},
					{
						title: "Artistic Growth",
						description:
							"Critics highlight significant evolution in the artist's sound and songwriting maturity.",
						color: "blue",
					},
				],
				avgRating: "4.6/5",
			},
			2: {
				sentiment: "Cautiously Optimistic",
				description:
					"Reviews reveal a divided but intrigued response to this experimental venture. Critics appreciate the bold creative choices and willingness to push boundaries, though some question the execution. The community shows enthusiasm for the artist's risk-taking approach, with particular praise for the unconventional harmonic progressions and innovative production techniques.",
				themes: [
					{
						title: "Experimental Approach",
						description:
							"Praised for bold creative choices and willingness to explore uncharted territory.",
						color: "accent",
					},
					{
						title: "Technical Innovation",
						description:
							"Sophisticated harmonic progressions and unconventional song structure create intrigue.",
						color: "purple",
					},
					{
						title: "Polarizing Reception",
						description:
							"Divides listeners between those who embrace the experimentation and those preferring familiarity.",
						color: "orange",
					},
				],
				avgRating: "3.8/5",
			},
			3: {
				sentiment: "Critically Acclaimed",
				description:
					"This track has achieved widespread critical acclaim and passionate fan devotion. Reviews consistently highlight the flawless vocal performance, pristine technical execution, and masterful songwriting. The overwhelming consensus positions this as a career-defining moment, with both critics and community members praising its emotional authenticity and professional craftsmanship.",
				themes: [
					{
						title: "Vocal Excellence",
						description:
							"Universally praised for exceptional vocal range, control, and emotional delivery.",
						color: "accent",
					},
					{
						title: "Technical Mastery",
						description:
							"Flawless mixing, perfect instrumentation placement, and audiophile-quality production.",
						color: "green",
					},
					{
						title: "Career Milestone",
						description:
							"Widely regarded as a defining moment showcasing the artist's full potential.",
						color: "gold",
					},
				],
				avgRating: "4.8/5",
			},
			4: {
				sentiment: "Commercially Promising",
				description:
					"Critics and listeners recognize strong commercial potential while appreciating artistic integrity. Reviews emphasize the track's radio-friendly appeal, cross-generational accessibility, and polished production. The consensus suggests effective balance between mainstream accessibility and creative depth, with particular praise for its universal appeal and groove-focused foundation.",
				themes: [
					{
						title: "Radio Potential",
						description:
							"Strong commercial viability with catchy hooks and optimal length for broadcasting.",
						color: "accent",
					},
					{
						title: "Universal Appeal",
						description:
							"Successfully bridges generational gaps and appeals to diverse listener demographics.",
						color: "teal",
					},
					{
						title: "Groove Foundation",
						description:
							"Solid rhythmic elements and bassline work provide strong musical foundation.",
						color: "amber",
					},
				],
				avgRating: "4.2/5",
			},
			5: {
				sentiment: "Artistically Profound",
				description:
					"This track is being hailed as a work of pure artistry that transcends genre boundaries. Critics and fans alike recognize its sophisticated emotional architecture and genre-defying innovation. Reviews consistently highlight the masterful composition, impressive production quality, and the artist's ability to create something both accessible and deeply artistic.",
				themes: [
					{
						title: "Artistic Vision",
						description:
							"Praised for sophisticated emotional building and release, resembling master craftsmanship.",
						color: "accent",
					},
					{
						title: "Genre Innovation",
						description:
							"Successfully blends multiple styles while maintaining organic coherence.",
						color: "violet",
					},
					{
						title: "Production Excellence",
						description:
							"Impressive technical quality that showcases modern production capabilities.",
						color: "cyan",
					},
				],
				avgRating: "4.4/5",
			},
			6: {
				sentiment: "Emotionally Resonant",
				description:
					"Reviews reveal deep emotional connection across all listener types. Critics praise the profound lyrical content and meaningful composition, while the community responds with personal testimonials about the track's impact. The consensus highlights exceptional songwriting craft, pristine production quality, and the rare ability to create universal emotional resonance.",
				themes: [
					{
						title: "Emotional Connection",
						description:
							"Creates profound personal impact and meaningful moments for diverse listeners.",
						color: "accent",
					},
					{
						title: "Lyrical Depth",
						description:
							"Sophisticated wordplay and metaphors create multiple layers of meaning.",
						color: "rose",
					},
					{
						title: "Educational Value",
						description:
							"Serves as textbook example of quality production and songwriting techniques.",
						color: "emerald",
					},
				],
				avgRating: "4.7/5",
			},
			7: {
				sentiment: "Transcendently Exceptional",
				description:
					"This track has achieved near-universal acclaim as a generational masterpiece. Critics describe it as career-defining work that represents the pinnacle of contemporary music creation. Reviews consistently use superlative language, with both professional critics and passionate fans positioning it as a transformative listening experience that showcases perfect fusion of innovation and accessibility.",
				themes: [
					{
						title: "Generational Impact",
						description:
							"Positioned as era-defining work that will influence future musical development.",
						color: "accent",
					},
					{
						title: "Technical Perfection",
						description:
							"Audiophile-quality production with perfect spatial positioning and frequency response.",
						color: "indigo",
					},
					{
						title: "Emotional Transcendence",
						description:
							"Creates magical, goosebump-inducing moments that defy easy description.",
						color: "gold",
					},
				],
				avgRating: "4.9/5",
			},
		};

		return aiSummaryDatabase[songId] || aiSummaryDatabase[1];
	};

	const aiSummary = getAISummary(song.id);

	const renderVinyls = (rating: number) => {
		return (
			<div className="flex items-center space-x-1">
				{[...Array(5)].map((_, i) => (
					<VinylRecordIcon
						key={i}
						className="w-5 h-5"
						filled={i < rating}
					/>
				))}
			</div>
		);
	};

	const renderSmallVinyls = (rating: number) => {
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

	// Generate waveform data to match SoundCloud style
	const generateWaveform = () => {
		const points = 800; // More points for detailed waveform
		return Array.from({ length: points }, (_, i) => {
			const progress = i / points;
			// Create more realistic audio waveform pattern
			const bass = Math.sin(progress * Math.PI * 4) * 0.3;
			const mid = Math.sin(progress * Math.PI * 12) * 0.4;
			const high = Math.sin(progress * Math.PI * 20) * 0.2;
			const randomVariation = (Math.random() - 0.5) * 0.6;
			const combined = bass + mid + high + randomVariation;
			return Math.max(0.1, Math.min(1, Math.abs(combined) + 0.2));
		});
	};

	const waveformData = generateWaveform();

	// Format time display
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Auto-advance playback simulation
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isPlaying) {
			interval = setInterval(() => {
				setCurrentTime((prev) => {
					if (prev >= duration) {
						setIsPlaying(false);
						return 0;
					}
					return prev + 1;
				});
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isPlaying, duration]);

	const handlePlayToggle = () => {
		setIsPlaying(!isPlaying);
	};

	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const newTime = (clickX / rect.width) * duration;
		setCurrentTime(newTime);
	};

	const formatTimeForWaveform = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="min-h-screen bg-[#1A1A1A]">
			<div className="container mx-auto px-4 py-8">
				{/* Song Header Section */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
					{/* Album Art */}
					<div className="lg:col-span-1">
						<div className="relative group">
							<img
								src={song.albumArt}
								alt={`${song.title} album art`}
								className="w-full aspect-square object-cover shadow-2xl"
							/>
							<div
								className="absolute inset-0 bg-[#1A1A1A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
								onClick={() => {
									if (song.spotifyUrl) {
										window.open(song.spotifyUrl, "_blank");
									}
								}}
							>
								<svg
									className="w-16 h-16 text-accent/80"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
								</svg>
							</div>
						</div>
					</div>

					{/* Song Information */}
					<div className="lg:col-span-2 space-y-6">
						<div>
							<h1 className="text-4xl lg:text-5xl text-foreground mb-2">
								{song.title}
							</h1>
							<div className="flex items-center space-x-3 mb-4">
								<span className="text-muted-foreground">
									by
								</span>
								<button
									onClick={() => onArtistClick?.(song.artist)}
									className="flex items-center space-x-3 hover:bg-muted/50 p-2 transition-all duration-300 group"
								>
									<div className="w-10 h-10 overflow-hidden border-2 border-muted-foreground group-hover:border-accent transition-colors">
										<img
											src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop&crop=face"
											alt={`${song.artist} headshot`}
											className="w-full h-full object-cover"
										/>
									</div>
									<span className="text-accent hover:text-accent/80 transition-colors">
										{song.artist}
									</span>
								</button>
							</div>

							{/* Genre Tags */}
							<div className="flex flex-wrap gap-2 mb-6">
								{song.genres.map((genre, index) => (
									<GenreTag
										key={index}
										genre={genre}
										onClick={onGenreClick}
									/>
								))}
							</div>

							{/* Rating and Stats */}
							<div className="bg-muted/60 p-6 mb-6">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="text-center">
										<div className="flex justify-center mb-2">
											{renderVinyls(
												Math.floor(song.rating),
											)}
										</div>
										<p className="text-2xl text-foreground mb-1">
											{song.rating}
										</p>
										<p className="text-muted-foreground text-sm">
											Overall Rating
										</p>
									</div>
									<div className="text-center">
										<p className="text-2xl text-foreground mb-1">
											{song.reviewCount.toLocaleString()}
										</p>
										<p className="text-muted-foreground text-sm">
											Total Reviews
										</p>
									</div>
									<div className="text-center">
										<p className="text-2xl text-foreground mb-1">
											4:23
										</p>
										<p className="text-muted-foreground text-sm">
											Duration
										</p>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-3">
								<Button
									onClick={() => setIsFavorited(!isFavorited)}
									variant="outline"
									size="icon"
									className={`border-border hover:bg-muted transition-all duration-300 ${
										isFavorited
											? "bg-accent border-transparent"
											: "text-muted-foreground hover:text-foreground"
									}`}
								>
									<Heart
										className={`w-5 h-5 ${isFavorited ? "fill-current text-accent-foreground" : ""}`}
									/>
								</Button>
								<Button
									variant="outline"
									className="border-border text-muted-foreground hover:bg-muted"
								>
									<Share2 className="w-4 h-4 mr-2" />
									Share
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* AI Summary Section */}
				<div className="space-y-6">
					<Card className="bg-muted/30 border-accent/30 relative overflow-hidden">
						<div className="absolute inset-0 bg-accent/5"></div>
						<CardContent className="p-6 relative">
							<div className="flex items-center space-x-3 mb-4">
								<div className="flex items-center justify-center w-10 h-10 bg-accent">
									<Sparkles className="w-5 h-5 text-accent-foreground" />
								</div>
								<div>
									<h3 className="text-foreground">
										AI Review Summary
									</h3>
									<p className="text-accent text-sm">
										Powered by MusicCritic Intelligence
									</p>
								</div>
								<Badge className="bg-accent/30 text-accent border-accent/50 ml-auto">
									Beta
								</Badge>
							</div>

							<div className="space-y-4">
								<div className="bg-muted/50 p-4 border border-accent/20">
									<div className="flex items-center space-x-2 mb-3">
										<Sparkles className="w-4 h-4 text-accent" />
										<span className="text-accent">
											AI Generated Review Summary
										</span>
									</div>
									<p className="text-muted-foreground leading-relaxed whitespace-pre-line">
										{song.aiSummary}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Reviews Section */}
				<div className="space-y-6 pt-8">
					<div className="border-b border-gray-800 pb-4">
						<h2 className="text-white mb-2">Reviews</h2>
						<p className="text-gray-400">
							Professional critics and community feedback
						</p>
					</div>

					{/* Write Review Section */}
					<Card className="bg-gray-800/40 border-gray-700/50">
						<CardContent className="p-6">
							<div className="space-y-4">
								<Textarea
									value={reviewText}
									onChange={(e) =>
										setReviewText(e.target.value)
									}
									placeholder="Share your thoughts about this track... What did you love? What could be improved?"
									className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 resize-none min-h-[120px] focus:border-purple-500 focus:ring-purple-500/20"
								/>

								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<span className="text-gray-400 text-sm">
											{reviewText.length}/500 characters
										</span>
										{reviewText.length > 400 && (
											<span className="text-orange-400 text-sm">
												Character limit approaching
											</span>
										)}
									</div>

									<div className="flex items-center space-x-2">
										<Button
											variant="outline"
											size="sm"
											className="border-gray-600 text-gray-300 hover:bg-gray-700"
											onClick={() => {
												setReviewText("");
												setUserRating(0);
											}}
										>
											Clear
										</Button>
										<Button
											size="sm"
											disabled={
												!reviewText.trim() ||
												userRating === 0
											}
											className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Post Review
										</Button>
									</div>
								</div>

								{/* Rating Section - Centered */}
								<div className="flex justify-center mt-4 pt-4 border-t border-gray-600/50">
									<div className="flex items-center space-x-1">
										{[1, 2, 3, 4, 5].map((rating) => (
											<button
												key={rating}
												onClick={() =>
													setUserRating(rating)
												}
												className="p-1 hover:scale-110 transition-transform"
											>
												<VinylRecordIcon
													className="w-6 h-6"
													filled={
														rating <= userRating
													}
												/>
											</button>
										))}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Two Column Layout */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Verified Critics Column */}
						<div className="space-y-6">
							<div className="flex items-center space-x-3 mb-6">
								<CheckCircle className="w-5 h-5 text-green-400" />
								<h3 className="text-white">Verified Critics</h3>
								<Badge className="bg-green-600/20 text-green-400 border-green-500/30">
									{criticReviews.length} Reviews
								</Badge>
							</div>

							<div className="space-y-4">
								{criticReviews.map((review) => (
									<Card
										key={review.id}
										className="bg-green-900/20 border-green-700/30 hover:bg-green-900/30 transition-all duration-300 border-l-4 border-l-green-500"
									>
										<CardContent className="p-6">
											{/* Review Header */}
											<div className="flex items-start justify-between mb-4">
												<div className="flex items-center space-x-4">
													<div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500/40">
														<img
															src={
																review.userAvatar
															}
															alt={`${review.userName} avatar`}
															className="w-full h-full object-cover"
														/>
													</div>
													<div>
														<div className="flex items-center space-x-2 mb-1">
															<h4 className="text-white">
																{
																	review.userName
																}
															</h4>
															<CheckCircle className="w-4 h-4 text-green-400" />
														</div>
														<p className="text-green-300 text-sm mb-1">
															{review.publication}
														</p>
														<p className="text-gray-400 text-sm">
															{review.timeAgo}
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-4">
													{renderSmallVinyls(
														review.rating,
													)}
												</div>
											</div>

											{/* Review Text */}
											<div className="mb-4">
												<p className="text-gray-300 leading-relaxed">
													{review.reviewText}
												</p>
											</div>

											{/* Review Actions */}
											<div className="flex items-center justify-between pt-4 border-t border-green-700/30">
												<div className="flex items-center space-x-4">
													<button
														className={`flex items-center space-x-1 text-sm transition-colors ${
															review.isLiked
																? "text-green-400 hover:text-green-300"
																: "text-gray-400 hover:text-gray-300"
														}`}
													>
														<Heart
															className={`w-4 h-4 ${review.isLiked ? "fill-current" : ""}`}
														/>
														<span>
															{review.likes}
														</span>
													</button>
													<button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 text-sm transition-colors">
														<MessageSquare className="w-4 h-4" />
														<span>Reply</span>
													</button>
												</div>
												<button className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
													Report
												</button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>

							{/* Load More Critics */}
							<div className="text-center pt-4">
								<Button
									variant="outline"
									className="border-green-600/50 text-green-300 hover:bg-green-800/20"
								>
									Load More Critic Reviews
								</Button>
							</div>
						</div>

						{/* Community Reviews Column */}
						<div className="space-y-6">
							<div className="flex items-center space-x-3 mb-6">
								<Users className="w-5 h-5 text-purple-400" />
								<h3 className="text-white">
									Community Reviews
								</h3>
								<Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
									{communityReviews.length} Reviews
								</Badge>
							</div>

							<div className="space-y-4">
								{communityReviews.map((review) => (
									<Card
										key={review.id}
										className={`${
											review.isSuperfan
												? "bg-purple-900/20 border-purple-700/30 hover:bg-purple-900/30 border-l-4 border-l-purple-500"
												: "bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60"
										} transition-all duration-300`}
									>
										<CardContent className="p-6">
											{/* Review Header */}
											<div className="flex items-start justify-between mb-4">
												<div className="flex items-center space-x-4">
													<div
														className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
															review.isSuperfan
																? "border-purple-500/40"
																: "border-gray-600/40"
														}`}
													>
														<img
															src={
																review.userAvatar ||
																`https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face`
															}
															alt={`${review.userName} avatar`}
															className="w-full h-full object-cover"
														/>
													</div>
													<div>
														<div className="flex items-center space-x-2 mb-1">
															<h4 className="text-white">
																{
																	review.userName
																}
															</h4>
															{review.isSuperfan && (
																<Badge className="bg-purple-600/30 text-purple-300 border-purple-500/50 text-xs">
																	SUPERFAN
																</Badge>
															)}
														</div>
														<p className="text-gray-400 text-sm">
															{review.timeAgo}
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-4">
													{renderSmallVinyls(
														review.rating,
													)}
												</div>
											</div>

											{/* Review Text */}
											<div className="mb-4">
												<p className="text-gray-300 leading-relaxed">
													{review.reviewText}
												</p>
											</div>

											{/* Review Actions */}
											<div
												className={`flex items-center justify-between pt-4 border-t ${
													review.isSuperfan
														? "border-purple-700/30"
														: "border-gray-700/30"
												}`}
											>
												<div className="flex items-center space-x-4">
													<button
														className={`flex items-center space-x-1 text-sm transition-colors ${
															review.isLiked
																? "text-purple-400 hover:text-purple-300"
																: "text-gray-400 hover:text-gray-300"
														}`}
													>
														<Heart
															className={`w-4 h-4 ${review.isLiked ? "fill-current" : ""}`}
														/>
														<span>
															{review.likes}
														</span>
													</button>
													<button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 text-sm transition-colors">
														<MessageSquare className="w-4 h-4" />
														<span>Reply</span>
													</button>
												</div>
												<button className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
													Report
												</button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>

							{/* Load More Community */}
							<div className="text-center pt-4">
								<Button
									variant="outline"
									className="border-purple-600/50 text-purple-300 hover:bg-purple-800/20"
								>
									Load More Community Reviews
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Now Playing Media Player */}
			{isPlaying && (
				<div className="fixed inset-0 bg-gray-900 z-50 overflow-hidden">
					{/* Top section with close button */}
					<div className="flex justify-between items-center p-4 border-b border-gray-800">
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsPlaying(false)}
								className="text-gray-400 hover:text-white"
							>
								<ArrowLeft className="w-5 h-5" />
							</Button>
							<span className="text-white text-lg">
								Now Playing
							</span>
						</div>
					</div>

					{/* Main content area */}
					<div className="flex flex-1">
						{/* Sidebar with controls */}
						<div className="w-80 bg-gray-800/50 border-r border-gray-700 p-6 flex flex-col">
							{/* Album art */}
							<div className="mb-6">
								<img
									src={song.albumArt}
									alt={song.title}
									className="w-full aspect-square object-cover rounded-lg"
								/>
							</div>

							{/* Playback controls */}
							<div className="space-y-6 flex-1">
								<div className="space-y-2">
									<h3 className="text-white text-lg">
										{song.title}
									</h3>
									<p className="text-gray-400">
										{song.artist}
									</p>
								</div>

								{/* Controls */}
								<div className="flex items-center justify-center space-x-4">
									<Button
										variant="ghost"
										size="icon"
										className="text-gray-400 hover:text-white"
									>
										<SkipBack className="w-6 h-6" />
									</Button>
									<Button
										onClick={handlePlayToggle}
										className="w-16 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-full"
									>
										{isPlaying ? (
											<Pause className="w-8 h-8" />
										) : (
											<PlayCircle className="w-8 h-8" />
										)}
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="text-gray-400 hover:text-white"
									>
										<SkipForward className="w-6 h-6" />
									</Button>
								</div>

								{/* Time display */}
								<div className="text-center space-y-2">
									<div className="text-gray-400 text-sm">
										{formatTime(currentTime)} /{" "}
										{formatTime(duration)}
									</div>
								</div>

								{/* Volume control */}
								<div className="flex items-center space-x-2">
									<Volume2 className="w-4 h-4 text-gray-400" />
									<div className="flex-1 h-1 bg-gray-600 rounded-full">
										<div className="h-full w-3/4 bg-orange-500 rounded-full"></div>
									</div>
								</div>
							</div>
						</div>

						{/* Main waveform section */}
						<div className="flex-1 flex flex-col h-screen">
							{/* Waveform container */}
							<div className="relative flex-1 bg-gray-900 overflow-hidden">
								{/* Time markers */}
								<div className="absolute top-4 left-0 right-0 flex justify-between px-8 text-xs text-gray-500 z-10">
									{Array.from({ length: 9 }, (_, i) => (
										<span key={i}>
											{formatTimeForWaveform(
												(duration / 8) * i,
											)}
										</span>
									))}
								</div>

								{/* Waveform visualization */}
								<div className="absolute inset-0 flex items-center px-8 pt-12">
									<div className="relative w-full h-48 flex items-end justify-start">
										{/* Play button */}
										<div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20">
											<Button
												onClick={handlePlayToggle}
												className="w-16 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center"
											>
												{isPlaying ? (
													<Pause className="w-8 h-8" />
												) : (
													<PlayCircle className="w-8 h-8" />
												)}
											</Button>
										</div>

										{/* Waveform bars */}
										<div
											className="flex items-end h-full ml-20 flex-1 cursor-pointer"
											onClick={handleProgressClick}
										>
											{waveformData.map(
												(height, index) => {
													const progress =
														currentTime / duration;
													const barProgress =
														index /
														waveformData.length;
													const isPlayed =
														barProgress <= progress;

													return (
														<div
															key={index}
															className={`w-1 mx-px transition-colors duration-150 ${
																isPlayed
																	? "bg-orange-500"
																	: "bg-gray-600"
															} hover:bg-orange-400`}
															style={{
																height: `${height * 100}%`,
															}}
														/>
													);
												},
											)}
										</div>

										{/* Progress needle */}
										<div
											className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
											style={{
												left: `${(currentTime / duration) * (100 - 10)}%`,
												marginLeft: "80px",
											}}
										>
											<div className="w-4 h-4 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
										</div>
									</div>
								</div>

								{/* Song info at bottom */}
								<div className="absolute bottom-8 left-8 right-8">
									<div className="flex items-center justify-between">
										<div>
											<h2 className="text-white text-xl">
												{song.artist}
											</h2>
											<h1 className="text-white text-2xl font-medium">
												{song.title}
											</h1>
										</div>
										<div className="flex items-center space-x-4">
											<Button
												onClick={() =>
													setIsFavorited(!isFavorited)
												}
												variant="ghost"
												size="icon"
												className={`${
													isFavorited
														? "text-pink-500 hover:text-pink-600"
														: "text-gray-400 hover:text-gray-300"
												}`}
											>
												<Heart
													className={`w-6 h-6 ${isFavorited ? "fill-current" : ""}`}
												/>
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-gray-400 hover:text-gray-300"
											>
												<Share2 className="w-6 h-6" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-gray-400 hover:text-gray-300"
											>
												<MessageSquare className="w-6 h-6" />
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Comments Section */}
						<div className="w-96 bg-gray-800/30 border-l border-gray-700 flex flex-col">
							{/* Comments Header */}
							<div className="p-4 border-b border-gray-700">
								<div className="flex items-center justify-between">
									<h3 className="text-white">Comments</h3>
									<span className="text-gray-400 text-sm">
										{nowPlayingComments.length}
									</span>
								</div>
							</div>

							{/* Comment Input */}
							<div className="p-4 border-b border-gray-700">
								<div className="flex space-x-3">
									<div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600">
										<img
											src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=32&h=32&fit=crop&crop=face"
											alt="Your avatar"
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex-1">
										<Textarea
											value={newComment}
											onChange={(e) =>
												setNewComment(e.target.value)
											}
											placeholder="Add a comment..."
											className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 resize-none min-h-[60px] text-sm"
										/>
										<div className="flex justify-between items-center mt-2">
											<span className="text-gray-500 text-xs">
												{newComment.length}/280
											</span>
											<Button
												size="sm"
												disabled={!newComment.trim()}
												className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
											>
												Post
											</Button>
										</div>
									</div>
								</div>
							</div>

							{/* Comments List */}
							<div className="flex-1 overflow-y-auto p-4 space-y-4">
								{nowPlayingComments.map((comment) => (
									<div
										key={comment.id}
										className="flex space-x-3"
									>
										<div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
											<img
												src={comment.avatar}
												alt={comment.user}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center space-x-2 mb-1">
												<span className="text-white text-sm">
													{comment.user}
												</span>
												<span className="text-gray-500 text-xs">
													{comment.time}
												</span>
											</div>
											<p className="text-gray-300 text-sm leading-relaxed">
												{comment.text}
											</p>
											<div className="flex items-center space-x-3 mt-2">
												<button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 transition-colors">
													<Heart className="w-3 h-3" />
													<span className="text-xs">
														{comment.likes}
													</span>
												</button>
												<button className="text-gray-400 hover:text-gray-300 text-xs transition-colors">
													Reply
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

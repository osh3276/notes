import {
	ArrowLeft,
	Search,
	User,
	Menu,
	LogIn,
	LogOut,
	Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

interface Track {
	id: string;
	name: string;
	artists: Array<{
		id: string;
		name: string;
	}>;
	album: {
		id: string;
		name: string;
		images: Array<{
			url: string;
			height: number;
			width: number;
		}>;
	};
}

interface MiniHeaderProps {
	onBack?: () => void;
	onProfileClick?: () => void;
	onSongSelect?: (songId: string) => void;
}

export function MiniHeader({
	onBack,
	onProfileClick,
	onSongSelect,
}: MiniHeaderProps) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<Track[]>([]);
	const [showResults, setShowResults] = useState(false);
	const [isSearchActive, setIsSearchActive] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const handleSignIn = () => {
		signIn("spotify");
	};

	const handleSignOut = () => {
		signOut();
	};

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.back();
		}
	};

	const handleLogoClick = () => {
		router.push("/");
	};

	const handleSearch = async () => {
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		setIsSearching(true);
		try {
			const response = await fetch(
				`/api/search/tracks?q=${encodeURIComponent(query)}&limit=20`,
			);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to search tracks");
			}

			setSearchResults(data.tracks);
			setShowResults(true);
		} catch (error) {
			console.error("Search error:", error);
		} finally {
			setIsSearching(false);
		}
	};

	return (
		<>
			{/* Blur overlay when search is active */}
			<div
				className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
					isSearchActive
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={() => {
					setIsSearchActive(false);
					setShowResults(false);
				}}
			/>

			<header className="w-full bg-[#1A1A1A] border-b border-white/10 relative">
				<div
					className={`container mx-auto px-4 py-3 flex items-center justify-between transition-all duration-300 ${isSearchActive ? "z-50" : ""}`}
				>
					{/* Left side - Back button and Logo */}
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={handleBack}
							className="text-white hover:bg-white/10"
						>
							<ArrowLeft className="w-5 h-5" />
						</Button>

						<div
							className="flex items-center cursor-pointer"
							onClick={handleLogoClick}
						>
							<img
								src="/logo.png"
								alt="Notes"
								className="h-12 w-auto"
							/>
						</div>
					</div>

					{/* Center - Search Bar */}
					<div className="flex-1 max-w-lg mx-8 relative">
						<div className="relative">
							{/* Magnifying glass icon */}
							<div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-100">
								{isSearching ? (
									<Loader2 className="w-4 h-4 text-gray-300 animate-spin" />
								) : (
									<Search className="w-4 h-4 text-gray-300" />
								)}
							</div>

							{/* Search text/input area */}
							<div
								className="relative cursor-text py-2 pl-6 z-100"
								onClick={() => {
									setIsSearchActive(true);
									searchInputRef.current?.focus();
								}}
							>
								{!isSearchActive && !query ? (
									<span className="text-gray-300 text-sm">
										Search songs...
									</span>
								) : (
									<input
										ref={searchInputRef}
										type="text"
										value={query}
										onChange={(e) => {
											setQuery(e.target.value);
											if (e.target.value) {
												handleSearch();
												setShowResults(true);
											} else {
												setShowResults(false);
											}
										}}
										onFocus={() => setIsSearchActive(true)}
										onBlur={() => {
											// Delay to allow click on results
											setTimeout(() => {
												if (!showResults) {
													setIsSearchActive(false);
												}
											}, 150);
										}}
										className="bg-transparent text-white text-sm outline-none border-none w-full placeholder-gray-300"
										placeholder="Search songs..."
										autoFocus={isSearchActive}
									/>
								)}

								{/* Animated underline */}
								<div className="absolute bottom-0 left-0 h-0.5 bg-white/30 w-full">
									<div
										className={`h-full bg-white transition-all duration-300 ease-out ${
											isSearchActive ? "w-full" : "w-0"
										}`}
									/>
								</div>
							</div>
						</div>

						{/* Search Results Dropdown */}
						{showResults && isSearchActive && (
							<div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl z-50">
								{searchResults.length > 0 ? (
									<div className="max-h-[300px] overflow-auto">
										{searchResults.map((track) => (
											<div
												key={track.id}
												className="flex items-center space-x-3 p-3 hover:bg-white/10 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
												onClick={() => {
													if (onSongSelect) {
														onSongSelect(track.id);
													} else {
														router.push(
															`/song/${track.id}`,
														);
													}
													setShowResults(false);
													setIsSearchActive(false);
													setQuery("");
												}}
											>
												{track.album.images[0] && (
													<img
														src={
															track.album
																.images[0].url
														}
														alt={track.album.name}
														className="w-10 h-10 rounded object-cover"
													/>
												)}
												<div className="flex-1 min-w-0">
													<p className="text-white font-medium truncate text-sm">
														{track.name}
													</p>
													<p className="text-gray-400 text-xs truncate">
														{track.artists
															.map((a) => a.name)
															.join(", ")}
													</p>
												</div>
											</div>
										))}
									</div>
								) : query && !isSearching ? (
									<div className="p-4 text-gray-400 text-center text-sm">
										No results found
									</div>
								) : null}
							</div>
						)}
					</div>

					{/* Right side - Profile */}
					<div className="flex items-center space-x-3">
						{/* Profile/Login Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="p-0 hover:bg-white/10 transition-all duration-300"
									disabled={status === "loading"}
								>
									{status === "loading" ? (
										<div className="w-8 h-8 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
											<div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
										</div>
									) : session?.user?.image ? (
										<div className="w-8 h-8 overflow-hidden rounded-full border-2 border-white/20 hover:border-accent transition-colors">
											<img
												src={session.user.image}
												alt={
													session.user.name ||
													"User profile"
												}
												className="w-full h-full object-cover"
											/>
										</div>
									) : (
										<div className="w-8 h-8 rounded-full bg-white/10 border-2 border-white/20 hover:border-accent transition-colors flex items-center justify-center">
											<User className="w-4 h-4 text-white" />
										</div>
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								{status === "loading" ? (
									<>
										<DropdownMenuLabel>
											Loading...
										</DropdownMenuLabel>
									</>
								) : session ? (
									<>
										<DropdownMenuLabel>
											{session.user?.name || "User"}
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={onProfileClick}
										>
											<User className="mr-2 h-4 w-4" />
											View Profile
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={handleSignOut}
										>
											<LogOut className="mr-2 h-4 w-4" />
											Sign Out
										</DropdownMenuItem>
									</>
								) : (
									<>
										<DropdownMenuLabel>
											Welcome
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={handleSignIn}
										>
											<LogIn className="mr-2 h-4 w-4" />
											Sign in with Spotify
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Menu Icon */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="text-white hover:bg-white/10"
								>
									<Menu className="w-5 h-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-56 bg-black"
							>
								<DropdownMenuLabel>Menu</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => router.push("/")}
								>
									<Search className="mr-2 h-4 w-4" />
									Search Songs
								</DropdownMenuItem>
								<DropdownMenuItem>
									Trending Artists
								</DropdownMenuItem>
								<DropdownMenuItem>
									New Releases
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Settings</DropdownMenuItem>
								<DropdownMenuItem>
									Help & Support
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>
		</>
	);
}

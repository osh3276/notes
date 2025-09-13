import { Search, Menu, LogIn, LogOut, User, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

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

interface HeaderProps {
	onProfileClick?: () => void;
	onSongSelect?: (songId: string) => void;
}

export function Header({ onProfileClick, onSongSelect }: HeaderProps) {
	const { data: session, status } = useSession();
	const [query, setQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<Track[]>([]);
	const [showResults, setShowResults] = useState(false);

	const handleSignIn = () => {
		signIn("spotify");
	};

	const handleSignOut = () => {
		signOut();
	};

	const handleSearch = async () => {
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		setIsSearching(true);
		try {
			const response = await fetch(
				`/api/search/tracks?q=${encodeURIComponent(query)}&limit=20`
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
		<header className="w-full relative">
			{/* Main gradient background that blends seamlessly with content */}
			<div className="absolute inset-0 header-gradient"></div>
			{/* Gold accent gradient for brand colors */}
			<div className="absolute inset-0 header-accent-gradient"></div>
			<div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-between">
				{/* Logo */}
				<div className="flex items-center">
					<img
						src="https://i.redd.it/vw6c9iwr6rk51.jpg"
						alt="Notes - MusicCritic"
						className="h-12 w-auto"
					/>
				</div>

				{/* Centered Search Bar */}
				<div className="flex-1 max-w-md mx-8">
					<Popover open={showResults} onOpenChange={setShowResults}>
						<PopoverTrigger asChild>
							<div className="relative">
								{isSearching ? (
									<Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
								) : (
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								)}
								<Input
									type="search"
									value={query}
									onChange={(e) => {
										setQuery(e.target.value);
										if (e.target.value) handleSearch();
									}}
									placeholder="Search songs..."
									className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-300"
								/>
							</div>
						</PopoverTrigger>
						<PopoverContent className="w-[400px] p-0 bg-black/95 backdrop-blur-lg border-white/20">
							{searchResults.length > 0 ? (
								<div className="max-h-[400px] overflow-auto">
									{searchResults.map((track) => (
										<div
											key={track.id}
											className="flex items-center space-x-3 p-3 hover:bg-white/10 cursor-pointer"
											onClick={() => {
												if (onSongSelect) {
													onSongSelect(track.id);
													setShowResults(false);
													setQuery("");
												}
											}}
										>
											{track.album.images[0] && (
												<img
													src={track.album.images[0].url}
													alt={track.album.name}
													className="w-10 h-10 rounded object-cover"
												/>
											)}
											<div className="flex-1 min-w-0">
												<p className="text-white font-medium truncate">
													{track.name}
												</p>
												<p className="text-gray-400 text-sm truncate">
													{track.artists
														.map((a) => a.name)
														.join(", ")}
												</p>
											</div>
										</div>
									))}
								</div>
							) : query && !isSearching ? (
								<div className="p-3 text-gray-400">
									No results found
								</div>
							) : null}
						</PopoverContent>
					</Popover>
				</div>

				{/* Profile Picture and Menu */}
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
									<DropdownMenuItem onClick={onProfileClick}>
										<User className="mr-2 h-4 w-4" />
										View Profile
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleSignOut}>
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
									<DropdownMenuItem onClick={handleSignIn}>
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
							<DropdownMenuItem>
								<Search className="mr-2 h-4 w-4" />
								Advanced Search
							</DropdownMenuItem>
							<DropdownMenuItem>
								Trending Artists
							</DropdownMenuItem>
							<DropdownMenuItem>New Releases</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuItem>Help & Support</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}

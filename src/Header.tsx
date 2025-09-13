import { Search, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Header() {
  return (
    <header className="w-full relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent"></div>
      <div className="relative z-10 container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
          <span className="font-bold text-lg text-white">MusicCritic</span>
        </div>

        {/* Centered Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Search artists, albums, reviews..."
              className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Menu Icon */}
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
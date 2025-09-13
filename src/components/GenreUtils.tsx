// Genre color mapping utility
export const getGenreColor = (genre: string): string => {
  const normalizedGenre = genre.toLowerCase().trim();
  
  // Define color mappings for different genres - monochrome with gold highlights
  const genreColorMap: Record<string, string> = {
    // Popular/Featured genres - Gold shades
    'hip hop': 'bg-accent/20 text-accent border-accent/50',
    'rap': 'bg-accent/20 text-accent border-accent/50',
    'pop': 'bg-accent/20 text-accent border-accent/50',
    'electronic': 'bg-accent/20 text-accent border-accent/50',
    'r&b': 'bg-accent/20 text-accent border-accent/50',
    'jazz': 'bg-accent/20 text-accent border-accent/50',
    
    // Secondary genres - Lighter gold
    'trap': 'bg-accent/15 text-accent/80 border-accent/40',
    'pop rock': 'bg-accent/15 text-accent/80 border-accent/40',
    'edm': 'bg-accent/15 text-accent/80 border-accent/40',
    'house': 'bg-accent/15 text-accent/80 border-accent/40',
    'soul': 'bg-accent/15 text-accent/80 border-accent/40',
    'funk': 'bg-accent/15 text-accent/80 border-accent/40',
    'smooth jazz': 'bg-accent/15 text-accent/80 border-accent/40',
    
    // Rock family - Medium gray
    'rock': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    'hard rock': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    'punk rock': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    'indie rock': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    'alternative rock': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    'classic rock': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    
    // Alternative/Indie - Light gray
    'indie': 'bg-gray-500/20 text-gray-400 border-gray-400/50',
    'indie pop': 'bg-gray-500/20 text-gray-400 border-gray-400/50',
    'indie folk': 'bg-gray-500/20 text-gray-400 border-gray-400/50',
    'alternative': 'bg-gray-500/20 text-gray-400 border-gray-400/50',
    'alt rock': 'bg-gray-500/20 text-gray-400 border-gray-400/50',
    
    // Traditional genres - Dark gray
    'country': 'bg-gray-700/20 text-gray-500 border-gray-600/50',
    'folk': 'bg-gray-700/20 text-gray-500 border-gray-600/50',
    'bluegrass': 'bg-gray-700/20 text-gray-500 border-gray-600/50',
    'americana': 'bg-gray-700/20 text-gray-500 border-gray-600/50',
    'blues': 'bg-gray-700/20 text-gray-500 border-gray-600/50',
    'delta blues': 'bg-gray-700/20 text-gray-500 border-gray-600/50',
    'electric blues': 'bg-gray-700/20 text-gray-500 border-gray-600/50',
    'classical': 'bg-gray-700/20 text-gray-500 border-gray-600/50',
    'orchestral': 'bg-gray-700/20 text-gray-500 border-gray-600/50',
    'opera': 'bg-gray-700/20 text-gray-500 border-gray-600/50',
    
    // Heavy/Experimental - Darkest gray
    'metal': 'bg-gray-800/20 text-gray-600 border-gray-700/50',
    'heavy metal': 'bg-gray-800/20 text-gray-600 border-gray-700/50',
    'death metal': 'bg-gray-800/20 text-gray-600 border-gray-700/50',
    'black metal': 'bg-gray-800/20 text-gray-600 border-gray-700/50',
    'grunge': 'bg-gray-800/20 text-gray-600 border-gray-700/50',
    'experimental': 'bg-gray-800/20 text-gray-600 border-gray-700/50',
    'avant-garde': 'bg-gray-800/20 text-gray-600 border-gray-700/50',
    
    // World/Regional - Medium gray
    'reggae': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    'dancehall': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    'ska': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    'world': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    'latin': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    'african': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    'k-pop': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    'j-pop': 'bg-gray-600/20 text-gray-300 border-gray-500/50',
    
    // Chill/Ambient - Light gray
    'ambient': 'bg-gray-500/20 text-gray-400 border-gray-400/50',
    'chillout': 'bg-gray-500/20 text-gray-400 border-gray-400/50',
    'downtempo': 'bg-gray-500/20 text-gray-400 border-gray-400/50',
    'acoustic': 'bg-gray-500/20 text-gray-400 border-gray-400/50',
    
    // Dance/Party - Gold accents
    'disco': 'bg-accent/15 text-accent/80 border-accent/40',
    'techno': 'bg-accent/15 text-accent/80 border-accent/40',
    'dubstep': 'bg-accent/15 text-accent/80 border-accent/40',
    'synthwave': 'bg-accent/15 text-accent/80 border-accent/40',
    
    // Sub-genres
    'bubblegum pop': 'bg-gray-500/20 text-gray-400 border-gray-400/50',
    'rnb': 'bg-accent/20 text-accent border-accent/50',
    'neo soul': 'bg-accent/15 text-accent/80 border-accent/40',
    'bebop': 'bg-accent/15 text-accent/80 border-accent/40',
    'fusion': 'bg-accent/15 text-accent/80 border-accent/40',
  };

  // Return the mapped color or default gray if not found
  return genreColorMap[normalizedGenre] || 'bg-gray-600/20 text-gray-300 border-gray-500/50';
};

// Helper component for rendering genre tags with proper colors
interface GenreTagProps {
  genre: string;
  className?: string;
  onClick?: (genre: string) => void;
  clickable?: boolean;
}

export function GenreTag({ genre, className = "", onClick, clickable = true }: GenreTagProps) {
  const colorClasses = getGenreColor(genre);
  
  if (clickable && onClick) {
    return (
      <button 
        onClick={() => onClick(genre)}
        className={`px-3 py-1 text-sm font-bold border transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer ${colorClasses} ${className}`}
      >
        {genre}
      </button>
    );
  }
  
  return (
    <span 
      className={`px-3 py-1 text-sm font-bold border ${colorClasses} ${className}`}
    >
      {genre}
    </span>
  );
}
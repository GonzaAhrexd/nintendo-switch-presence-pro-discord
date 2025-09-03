import React from 'react';

type Game = {
  name: string;
  img?: string;
  franchise?: string;
};

type GameGridProps = {
  games: Game[];
  favorites?: string[];
  darkMode: boolean | null;
  onCardClick?: (game: Game) => void;
  onToggleFavorite?: (gameName: string) => void;
  showFavoriteButton?: boolean;
  translations?: any;
  language?: string | null;
};

const GameGrid: React.FC<GameGridProps> = ({
  games,
  favorites = [],
  darkMode,
  onCardClick,
  onToggleFavorite,
  showFavoriteButton = true
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
      {games.map(game => (
        <div
          key={game.name}
          className={`${darkMode ? 'bg-zinc-800/70 hover:bg-zinc-700/70' : 'bg-zinc-100 hover:bg-zinc-200'} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-stretch group focus:ring-2 focus:ring-indigo-500 focus:outline-none relative`}
        >
          {showFavoriteButton && onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(game.name)}
              className={`absolute top-2 right-2 z-10 p-1 rounded-full ${darkMode ? 'bg-zinc-900' : 'bg-white'} shadow ${favorites.includes(game.name) ? 'text-yellow-400' : 'text-zinc-400'} hover:text-yellow-400 focus:outline-none`}
              aria-label={favorites.includes(game.name) ? 'Remove from favorites' : 'Add to favorites'}
              tabIndex={0}
            >
              {favorites.includes(game.name)
                ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                )}
            </button>
          )}
          <button
            onClick={() => onCardClick && onCardClick(game)}
            className="flex-1 flex flex-col items-stretch group focus:outline-none"
            aria-label={game.name}
            tabIndex={0}
          >
            <div className={`w-full aspect-[4/3] ${darkMode ? 'bg-zinc-900' : 'bg-zinc-200'} flex items-center justify-center overflow-hidden relative cursor-pointer`}>
              {game.img ? (
                <img
                  src={`/games/${game.img}.png`}
                  alt={game.name}
                  className="w-full h-full object-cover rounded-t-xl group-hover:scale-110 transition-transform duration-300"
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-zinc-700/50 text-zinc-400' : 'bg-zinc-300 text-zinc-500'} text-sm font-medium`}>
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <span className={`${darkMode ? 'text-white' : 'text-zinc-900'} text-center font-semibold text-sm md:text-base line-clamp-2`}>
                {game.name}
              </span>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default GameGrid;

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

type Game = {
  name: string;
  img?: string;
  franchise?: string;
};

type AllGamesProps = {
  darkMode: boolean | null;
  language: string | null;
  games: Game[];
  translations: translations;
};

type translationsText = {
  allGames: string;
  search: string;
  filter: string;
  noImage: string;
  select: (name: string) => string;
};

type translations = {
  en: translationsText;
  es: translationsText;
};

const AllGames: React.FC<AllGamesProps> = ({ darkMode, language, games, translations }) => {
  const [gameList] = useState<Game[]>(games);
  const [search, setSearch] = useState('');
  const [franchise, setFranchise] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortAsc, setSortAsc] = useState(true); // true = ascendente (default)

  // Cargar favoritos al montar
  useEffect(() => {
    // @ts-ignore
    window.electronAPI.getFavorites().then((favs: string[]) => setFavorites(favs));
  }, []);

  // Agregar o quitar favorito
  const toggleFavorite = async (gameName: string) => {
    if (favorites.includes(gameName)) {
      // @ts-ignore
      const newFavs = await window.electronAPI.removeFavorite(gameName);
      setFavorites(newFavs);
    } else {
      // @ts-ignore
      const newFavs = await window.electronAPI.addFavorite(gameName);
      setFavorites(newFavs);
    }
  };

  const franchises = Array.from(new Set(gameList.map((g) => g.franchise || '')))
    .filter((f) => f)
    .sort();
  franchises.unshift('All');

  const handleCardClick = (game: Game) => {
    // @ts-ignore
    window.electronAPI.sendGame(
      game.name,
      '',
      game.name === 'Custom' ? 'Custom Game' : ''
    );
  };

  // Filtrado
  let filteredGames = gameList.filter((game) => {
    const matchesName = game.name.toLowerCase().includes(search.toLowerCase());
    const matchesFranchise = franchise === 'All' || game.franchise === franchise;
    return matchesName && matchesFranchise;
  });

  // Ordenamiento alfabético
  filteredGames = filteredGames.sort((a, b) =>
    sortAsc
      ? a.name.localeCompare(b.name) // ascendente
      : b.name.localeCompare(a.name) // descendente
  );

  const t = translations[language as 'en' | 'es'] || translations.en;

  return (
    <div
      className={`p-6 overflow-x-hidden w-full box-border ${
        darkMode ? 'bg-gray-950' : 'bg-white'
      }`}
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-3xl font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-zinc-900'
            }`}
          >
            {t.allGames}
          </h1>
          <button
            onClick={() => setSortAsc((prev) => !prev)}
            className={`p-2 rounded-full shadow ${
              darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-900'
            } hover:bg-indigo-500 hover:text-white transition`}
            aria-label="Ordenar"
          >
            {sortAsc ? (
              <div className='flex flex-row'> 
              A-Z<ChevronUpIcon className="w-6 h-6" />
              </div>
            ) : (
              <div className='flex flex-row'> 
              Z-A<ChevronDownIcon className="w-6 h-6" />
              </div>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className={`${
              darkMode
                ? 'bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-400'
                : 'bg-zinc-100 border-zinc-300 text-zinc-900 placeholder-zinc-500'
            } rounded-lg px-4 py-2 w-full sm:w-1/2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
            aria-label={t.search}
          />

          <select
            value={franchise}
            onChange={(e) => setFranchise(e.target.value)}
            className={`${
              darkMode
                ? 'bg-zinc-800/50 border-zinc-700 text-white'
                : 'bg-zinc-100 border-zinc-300 text-zinc-900'
            } rounded-lg px-4 py-2 w-full sm:w-1/2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
            aria-label={t.filter}
          >
            {franchises.map((f) => (
              <option
                key={f}
                value={f}
                className={
                  darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-900'
                }
              >
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
          {filteredGames.map((game) => (
            <div
              key={game.name}
              className={`${
                darkMode ? 'bg-zinc-800/70 hover:bg-zinc-700/70' : 'bg-zinc-100 hover:bg-zinc-200'
              } rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-stretch group focus:ring-2 focus:ring-indigo-500 focus:outline-none relative`}
            >
              {/* Estrella de favorito */}
              <button
                onClick={() => toggleFavorite(game.name)}
                className={`absolute top-2 right-2 z-10 p-1 rounded-full ${
                  darkMode ? 'bg-zinc-900' : 'bg-white'
                } shadow ${
                  favorites.includes(game.name) ? 'text-yellow-400' : 'text-zinc-400'
                } hover:text-yellow-400 focus:outline-none`}
                aria-label={
                  favorites.includes(game.name)
                    ? 'Remove from favorites'
                    : 'Add to favorites'
                }
                tabIndex={0}
              >
                {favorites.includes(game.name) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="w-6 h-6"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 0 0-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 0 0 .95-.69l1.286-3.967z"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={() => handleCardClick(game)}
                className="flex-1 flex flex-col items-stretch group focus:outline-none"
                aria-label={t.select(game.name)}
                tabIndex={0}
              >
                <div
                  className={`w-full aspect-[4/3] ${
                    darkMode ? 'bg-zinc-900' : 'bg-zinc-200'
                  } flex items-center justify-center overflow-hidden relative cursor-pointer`}
                >
                  {game.img ? (
                    <img
                      src={`/games/${game.img}.png`}
                      alt={game.name}
                      className="w-full h-full object-cover rounded-t-xl group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        darkMode
                          ? 'bg-zinc-700/50 text-zinc-400'
                          : 'bg-zinc-300 text-zinc-500'
                      } text-sm font-medium`}
                    >
                      {t.noImage}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                  <span
                    className={`${
                      darkMode ? 'text-white' : 'text-zinc-900'
                    } text-center font-semibold text-sm md:text-base line-clamp-2`}
                  >
                    {game.name}
                  </span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllGames;

import React, { useState } from 'react';

type Game = {
  name: string;
  img?: string;
  franchise?: string;
};

type AllGamesProps = {
  darkMode: boolean | null;
  language: string | null;
}

import games from '../../../../games.json';

const translations = {
  en: {
    allGames: 'All Games',
    search: 'Search game...',
    filter: 'Filter by franchise',
    noImage: 'No Image',
    select: (name: string) => `Select ${name}`,
  },
  es: {
    allGames: 'Todos los juegos',
    search: 'Buscar juego...',
    filter: 'Filtrar por franquicia',
    noImage: 'Sin imagen',
    select: (name: string) => `Seleccionar ${name}`,
  }
};

const AllGames: React.FC<AllGamesProps> = ({darkMode, language}) => {
  const [gameList] = useState<Game[]>(games);
  const [search, setSearch] = useState('');
  const [franchise, setFranchise] = useState('All');

  const franchises = Array.from(new Set(gameList.map(g => g.franchise || '')))
    .filter(f => f)
    .sort();
  franchises.unshift('All');

  const handleCardClick = (game: Game) => {
    console.log('Click en juego:', game);
    // @ts-ignore
    window.electronAPI.sendGame(
      game.name,
      '',
      game.name === 'Custom' ? 'Custom Game' : ''
    );
  };

  const filteredGames = gameList.filter(game => {
    const matchesName = game.name.toLowerCase().includes(search.toLowerCase());
    const matchesFranchise = franchise === 'All' || game.franchise === franchise;
    return matchesName && matchesFranchise;
  });

  const t = translations[language as 'en' | 'es'] || translations.en;
  return (
    <div className={`p-6 overflow-x-hidden w-full box-border ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto w-full">
        <h1 className={`text-3xl font-extrabold mb-8 tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{t.allGames}</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.search}
            className={`${darkMode ? 'bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-400' : 'bg-zinc-100 border-zinc-300 text-zinc-900 placeholder-zinc-500'} rounded-lg px-4 py-2 w-full sm:w-1/2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
            aria-label={t.search}
          />

          <select
            value={franchise}
            onChange={e => setFranchise(e.target.value)}
            className={`${darkMode ? 'bg-zinc-800/50 border-zinc-700 text-white' : 'bg-zinc-100 border-zinc-300 text-zinc-900'} rounded-lg px-4 py-2 w-full sm:w-1/2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
            aria-label={t.filter}
          >
            {franchises.map(f => (
              <option key={f} value={f} className={darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-900'}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
          {filteredGames.map(game => (
            <button
              key={game.name}
              onClick={() => handleCardClick(game)}
              className={`${darkMode ? 'bg-zinc-800/70 hover:bg-zinc-700/70' : 'bg-zinc-100 hover:bg-zinc-200'} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-stretch group focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              aria-label={t.select(game.name)}
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
                    {t.noImage}
                  </div>
                )}
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <span className={`${darkMode ? 'text-white' : 'text-zinc-900'} text-center font-semibold text-sm md:text-base line-clamp-2`}>
                  {game.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllGames;
import React, { useEffect, useState } from 'react'

type Game = {
  name: string;
  img?: string;
  franchise?: string;
}

import games from '../../../../games.json'

const AllGames: React.FC = () => {
  const [gameList] = useState<Game[]>(games);
  const [search, setSearch] = useState('');
  const [franchise, setFranchise] = useState('All');

  // Obtener lista única de franquicias
  const franchises = Array.from(new Set(gameList.map(g => g.franchise || ''))).filter(f => f).sort();
  franchises.unshift('All');

  const handleCardClick = (game: Game) => {
    console.log("Click en juego:", game);
    // Enviar evento al backend para actualizar el presence
    // window.electron.ipcRenderer.send('game', game.name, '', game.name === 'Custom' ? 'Custom Game' : '');
    // @ts-ignore
    window.electronAPI.sendGame(
      game.name,
      '',
      game.name === 'Custom' ? 'Custom Game' : ''
    )
  };

  // Filtrar juegos por nombre y franquicia
  const filteredGames = gameList.filter(game => {
    const matchesName = game.name.toLowerCase().includes(search.toLowerCase());
    const matchesFranchise = franchise === 'All' || game.franchise === franchise;
    return matchesName && matchesFranchise;
  });

  return (
    <div className="min-h-screen bg-zinc-900 p-4 overflow-x-hidden w-full">
      <div className="max-w-5xl mx-auto w-full overflow-x-hidden">
        <h1 className="text-2xl font-bold text-zinc-100 mb-6">All Games</h1>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search game..."
          className="bg-zinc-800 rounded px-3 py-2 text-zinc-100 mb-3 w-full outline-none focus:ring-2 focus:ring-red-700"
        />
        <select
          value={franchise}
          onChange={e => setFranchise(e.target.value)}
          className="bg-zinc-800 rounded px-3 py-2 text-zinc-100 mb-6 w-full outline-none focus:ring-2 focus:ring-red-700"
        >
          {franchises.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full overflow-x-hidden max-w-full">
          {filteredGames.map((game) => (
            <button
              key={game.name}
              onClick={() => handleCardClick(game)}
              className="bg-zinc-800 rounded-lg shadow hover:shadow-lg hover:bg-zinc-700 transition-all duration-200 flex flex-col items-stretch p-0 group overflow-hidden"
            >
              {game.img && (
                <div className="w-full aspect-[4/3] bg-zinc-900 flex items-center justify-center overflow-hidden">
                  <img
                    src={`/games/${game.img}.png`}
                    alt={game.name}
                    className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
              <div className="flex-1 flex items-center justify-center p-3">
                <span className="text-zinc-100 text-center font-medium line-clamp-2">{game.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllGames
import React, { useEffect, useState } from 'react'

type Game = {
  name: string
  img?: string
}

import games from '../../../../games.json'

const AllGames: React.FC = () => {
  const [gameList, setGameList] = useState<Game[]>(games)



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
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-100 mb-6">All Games</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {gameList.map((game) => (
            <button
              key={game.name}
              onClick={() => handleCardClick(game)}
              className="bg-zinc-800 rounded-lg shadow hover:shadow-lg hover:bg-zinc-700 transition-all duration-200 flex flex-col items-center p-4 group"
            >
              {game.img && (
                <img
                  src={`assets/games/${game.img}.png`}
                  alt={game.name}
                  className="w-16 h-16 object-contain mb-2 opacity-80 group-hover:opacity-100 transition"
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
              )}
              <span className="text-zinc-100 text-center font-medium">{game.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllGames
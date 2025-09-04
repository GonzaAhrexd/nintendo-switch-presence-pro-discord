import React, { useEffect, useState } from 'react';
import GameGrid from '../GameGrid/GameGrid'


type AllGamesProps = {
  darkMode: boolean | null;
  language: string | null;
}

import games from '../../../../games.json';

const AllGames: React.FC<AllGamesProps> = ({darkMode, language}) => {
  const [loading, setLoading] = useState(true);
  const [gameList, setGameList] = useState(games);

  useEffect(() => {
    (window as any).electronAPI.getUserConfig().then((cfg: any) => {

      
      console.log(cfg.showSwitch2Games)
  // Filtrar juegos según el setting
      if(!cfg.showSwitch2Games){
        setGameList(games.filter((g: any) => g.console !== 'sw2'));
      }


      setLoading(false);
    });
    // Listen for changes
  
    
  }, []);

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



  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 w-full">
        <span className="text-zinc-500 dark:text-zinc-300 animate-pulse text-lg font-semibold">
          {translations[language ?? 'en'].allGames}... Loading
        </span>
      </div>
    );
  }

  return (
    <GameGrid darkMode={darkMode} language={language} games={gameList} translations={translations} />
  );
};

export default AllGames;
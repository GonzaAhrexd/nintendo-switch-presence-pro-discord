import React, { useEffect, useState } from 'react';
import GameGrid from '../GameGrid/GameGrid'
import games from '../../../../games.json';

type Game = {
  name: string;
  img?: string;
  franchise?: string;
};

type FavoriteGamesProps = {
  darkMode: boolean | null;
  language: string | null;
};


const translations = {
  en: {
    allGames: 'Favorite Games',
    search: 'Search game...',
    filter: 'Filter by franchise',
    noImage: 'No Image',
    select: (name: string) => `Select ${name}`,
  },
  es: {
    allGames: 'Juegos favoritos',
    search: 'Buscar juego...',
    filter: 'Filtrar por franquicia',
    noImage: 'Sin imagen',
    select: (name: string) => `Seleccionar ${name}`,
  }
};
const FavoriteGames: React.FC<FavoriteGamesProps> = ({ darkMode, language }) => {
  const [gameList] = useState<Game[]>(games);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      // @ts-ignore
      const favs: string[] = await window.electronAPI.getFavorites();
      setFavorites(favs);
      setLoading(false);
    };
    loadFavorites();
    // Reload on tab focus
    const handleVisibility = () => {
      if (!document.hidden) {
        setLoading(true);
        loadFavorites();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [gameList]);

  const favoriteList = gameList.filter(game => favorites.includes(game.name));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 w-full">
        <span className="text-zinc-500 dark:text-zinc-300 animate-pulse text-lg font-semibold">
          {translations[language ?? 'en'].favorites}... Loading
        </span>
      </div>
    );
  }

  return (
    <GameGrid darkMode={darkMode} language={language} games={favoriteList} translations={translations} />
  );
};

export default FavoriteGames;

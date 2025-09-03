import React from 'react';
import GameGrid from '../GameGrid/GameGrid'


type AllGamesProps = {
  darkMode: boolean | null;
  language: string | null;
}

import games from '../../../../games.json';

const AllGames: React.FC<AllGamesProps> = ({darkMode, language}) => {

  
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

  return (
    <GameGrid darkMode={darkMode} language={language} games={games} translations={translations} />
  )

};

export default AllGames;
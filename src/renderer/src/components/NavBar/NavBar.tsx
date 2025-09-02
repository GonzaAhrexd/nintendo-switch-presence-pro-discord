import React from 'react'
import { HomeIcon, StarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'


type NavBarProps = {
  activeTab: number
  setActiveTab: (tab: any) => void
  darkMode: boolean | null
  language: 'es' | 'en' | null
}

const NavBar: React.FC<NavBarProps> = ({activeTab, setActiveTab, darkMode, language}) => {

  const accentBg = darkMode ? 'bg-red-900' : 'bg-red-600'
  const accentActive = darkMode ? 'bg-red-800 text-white' : 'bg-red-700 text-white'
  const accentHover = darkMode
    ? 'hover:bg-red-800 hover:text-white transition-colors duration-200'
    : 'hover:bg-red-700 hover:text-white transition-colors duration-200'
    
    const navItems = [
      { enLabel: `All Games`, esLabel: `Todos los juegos`, icon: HomeIcon },
      { enLabel: `Favorites`, esLabel: `Favoritos`, icon: StarIcon },
      // { enLabel: `My Games`, esLabel: `Mis juegos`, icon: StarIcon },
      { enLabel: `Settings`, esLabel: `Configuraciones`, icon: Cog6ToothIcon }
    ]
  
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 shadow-md overflow-x-hidden ${accentBg}`}>
      <ul className="flex justify-center gap-2 md:gap-6 px-2 md:px-0 py-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon
          const isActive = idx === activeTab
          return (
            <li key={language == "en" ? item.enLabel : item.esLabel}>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-zinc-200 font-medium ${accentHover} ${isActive ? accentActive : ''}`}
                onClick={() => setActiveTab(idx)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-5 h-5" />
                <span>{language == "en" ? item.enLabel : item.esLabel}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default NavBar
import React from 'react'
import { HomeIcon, StarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

const navItems = [
  { label: 'All Games', icon: HomeIcon },
  { label: 'Favorites', icon: StarIcon },
  // { label: 'My Games', icon: StarIcon },
  { label: 'Settings', icon: Cog6ToothIcon }
]

const accentBg = 'bg-red-800'
const accentActive = 'bg-red-700 text-white'
const accentHover = 'hover:bg-red-700 hover:text-white transition-colors duration-200'

type NavBarProps = {
  activeTab: number
  setActiveTab: (tab: any) => void
}

const NavBar: React.FC<NavBarProps> = ({activeTab, setActiveTab}) => {

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 shadow-md overflow-x-hidden ${accentBg}`}>
      <ul className="flex justify-center gap-2 md:gap-6 px-2 md:px-0 py-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon
          const isActive = idx === activeTab
          return (
            <li key={item.label}>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-zinc-200 font-medium ${accentHover} ${isActive ? accentActive : ''}`}
                onClick={() => setActiveTab(idx)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default NavBar
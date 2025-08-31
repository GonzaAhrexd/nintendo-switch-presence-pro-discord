import { DiscordPresenceButton } from './components/DiscordPresenceButton/DiscordPresenceButton'


import NavBar from "./components/NavBar/NavBar"
import { useState } from 'react'
import Setting from './components/Settings/Setting'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [activeTab, setActiveTab] = useState(0)
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState('en')
  return (
    <>
        <div className={`min-h-screen w-screen ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={`pt-14 `}>
        {activeTab === 0 && <div>Contenido de Todos los juegos</div>}
        {activeTab === 1 && <div>Contenido de Favoritos</div>}
        {activeTab === 2 && <div>Contenido de Mis juegos</div>}
        {activeTab === 3 && <Setting />}
      </div>
    </div>
    </>
  )
}

export default App

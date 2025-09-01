import { DiscordPresenceButton } from './components/DiscordPresenceButton/DiscordPresenceButton'


import NavBar from "./components/NavBar/NavBar"
import { useState, useEffect } from 'react'
import Setting from './components/Settings/Setting'
import AllGames from './components/AllGames/AllGames'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  // Al iniciar la app, enviar evento para Presence Idle
  useEffect(() => {
    if (window?.electron?.ipcRenderer) {
      window.electron.ipcRenderer.send('idle', 0)
    }
  }, [])

  const [activeTab, setActiveTab] = useState(0)
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState('en')
  return (
    <>
        <div className={`min-h-screen w-screen ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={`pt-14 `}>
        {activeTab === 0 && <AllGames /> }
        {activeTab === 1 && <div>Contenido de Favoritos</div>}
        {activeTab === 2 && <div>Contenido de Mis juegos</div>}
        {activeTab === 3 && <Setting />}
      </div>
    </div>
    </>
  )
}

export default App

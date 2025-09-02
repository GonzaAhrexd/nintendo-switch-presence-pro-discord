import { DiscordPresenceButton } from './components/DiscordPresenceButton/DiscordPresenceButton'


import NavBar from "./components/NavBar/NavBar"
import { useState, useEffect } from 'react'
import Setting from './components/Settings/Setting'
import AllGames from './components/AllGames/AllGames'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [activeTab, setActiveTab] = useState(0)
  const [darkMode, setDarkMode] = useState(null)
  const [language, setLanguage] = useState(null)
  // Al iniciar la app, enviar evento para Presence Idle
  useEffect(() => {
  if (window?.electron?.ipcRenderer) {
    window.electron.ipcRenderer.send('idle', 0)
  }

  // Obtener configuración inicial
  // @ts-ignore
  window.electronAPI.getUserConfig().then(config => {
    setDarkMode(config.darkMode);
    setLanguage(config.language);
  });

  // Escuchar cambios de tema
    // @ts-ignore
  window.electronAPI.onThemeChanged((isDark) => {
    setDarkMode(isDark);
  });

  // Escuchar cambios de idioma por IPC
  const languageListener = (_e, lang) => setLanguage(lang);
  if (window.electron?.ipcRenderer?.on) {
    window.electron.ipcRenderer.on('language-changed', languageListener);
  }

  // Limpieza: solo ese listener
  return () => {
    if (window.electron?.ipcRenderer?.removeListener) {
      window.electron.ipcRenderer.removeListener('language-changed', languageListener);
    }
  }
}, []);

  return (
    <>
      <div className={`min-h-screen max-w-screen w-screen overflow-x-hidden ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
        {language}
        <NavBar activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} language={language}/>
        <div className={`pt-14`}>
          {activeTab === 0 && <AllGames darkMode={darkMode} language={language} />}
          {/* {activeTab === 1 && <div>Contenido de Favoritos</div>}
        {activeTab === 2 && <div>Contenido de Mis juegos</div>} */}
          {activeTab === 2 && <Setting />}
        </div>
      </div>
    </>
  )
}

export default App

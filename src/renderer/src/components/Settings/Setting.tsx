import React, { useState, useEffect } from 'react'

const translations = {
  en: {
    settings: 'Settings',
    language: 'Language',
    darkMode: 'Dark Mode',
    showSwitch2Games: 'Show Nintendo Switch 2 Games',
    apply: 'Apply',
    applied: 'Applied!',
    currentTheme: 'Current theme',
    light: 'Light',
    dark: 'Dark',
    restartNotice: 'You need to restart the app for the changes to take effect.',
    languages: [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Spanish' }
    ]
  },
  es: {
    settings: 'Configuración',
    language: 'Idioma',
    darkMode: 'Modo oscuro',
    showSwitch2Games: 'Mostrar juegos de Nintendo Switch 2',
    apply: 'Aplicar',
    applied: '¡Aplicado!',
    currentTheme: 'Tema actual',
    light: 'Claro',
    dark: 'Oscuro',
    restartNotice: 'Necesitas reiniciar la aplicación para que los cambios tengan efecto.',
    languages: [
      { code: 'en', label: 'Inglés' },
      { code: 'es', label: 'Español' }
    ]
  }
}

const Setting: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [showSwitch2Games, setShowSwitch2Games] = useState(true);
  const [pendingLanguage, setPendingLanguage] = useState('en');
  const [pendingDarkMode, setPendingDarkMode] = useState(false);
  const [pendingShowSwitch2Games, setPendingShowSwitch2Games] = useState(true);
  const [applied, setApplied] = useState(false);

  const t = translations[language as 'en' | 'es'] || translations.en;

  // Cargar configuración inicial y escuchar cambios de tema/idioma
  useEffect(() => {
    // @ts-ignore
    window.electronAPI.getUserConfig().then(cfg => {
      setLanguage(cfg.language);
      setPendingLanguage(cfg.language);
      setDarkMode(cfg.darkMode);
      setPendingDarkMode(cfg.darkMode);
      setShowSwitch2Games(cfg.showSwitch2Games);
      setPendingShowSwitch2Games(cfg.showSwitch2Games);
    });

    // Escuchar cambios de idioma por IPC
    const languageListener = (_e: any, lang: string) => {
      setLanguage(lang);
      setPendingLanguage(lang);
    };
    if (window.electron?.ipcRenderer?.on) {
      window.electron.ipcRenderer.on('language-changed', languageListener);
    }
    return () => {
      if (window.electron?.ipcRenderer?.removeListener) {
        window.electron.ipcRenderer.removeListener('language-changed', languageListener);
      }
    };
  }, []);

  const handleApply = async () => {
    // @ts-ignore
    await window.electronAPI.setLanguage(pendingLanguage);
    // @ts-ignore
    await window.electronAPI.setDarkMode(pendingDarkMode);
    setLanguage(pendingLanguage);
    setDarkMode(pendingDarkMode);

    // @ts-ignore
    await window.electronAPI.setShowSwitch2Games(pendingShowSwitch2Games);
    setShowSwitch2Games(pendingShowSwitch2Games);

    setApplied(true);
    setTimeout(() => setApplied(false), 1200);
  };

  // Utilidad para clases según modo
  const mode = darkMode ? 'dark' : 'light';
  const bg = darkMode ? 'bg-zinc-900' : 'bg-white';
  const border = darkMode ? 'border-zinc-700' : 'border-zinc-200';
  const textMain = darkMode ? 'text-zinc-100' : 'text-zinc-800';
  const textLabel = darkMode ? 'text-zinc-300' : 'text-zinc-600';
  const inputBg = darkMode ? 'bg-zinc-800' : 'bg-zinc-100';
  const inputText = darkMode ? 'text-zinc-200' : 'text-zinc-700';
  const inputBorder = darkMode ? 'border-zinc-700' : 'border-zinc-200';
  const inputHover = darkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-200';
  const divider = darkMode ? 'border-zinc-700' : 'border-zinc-200';
  const restartText = darkMode ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className={`max-w-md mx-auto mt-8 p-6 rounded-xl border ${border} ${bg} shadow-sm transition-colors`}>
      <h2 className={`text-lg font-semibold mb-4 ${textMain}`}>{t.settings}</h2>
      <div className="mb-6">
        <label className={`block ${textLabel} mb-2 font-medium`}>{t.language}</label>
        <div className="flex gap-2">
          {t.languages.map((lang) => (
            <button
              key={lang.code}
              className={`px-3 py-1 rounded transition-colors border ${inputBorder} text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-400 ${pendingLanguage === lang.code
                  ? 'bg-red-600 text-white border-red-600'
                  : `${inputBg} ${inputText} ${inputHover}`
                }`}
              onClick={() => setPendingLanguage(lang.code)}
              aria-pressed={pendingLanguage === lang.code}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
      <div className={`flex items-center justify-between py-2 border-t ${divider}`}>
        <span className={`font-medium ${textLabel}`}>{t.darkMode}</span>
        <button
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 ${pendingDarkMode ? 'bg-red-600' : (darkMode ? 'bg-zinc-700' : 'bg-zinc-300')
            }`}
          onClick={() => setPendingDarkMode((v) => !v)}
          aria-pressed={pendingDarkMode}
        >
          <span
            className={`w-5 h-5 ${darkMode ? 'bg-zinc-900' : 'bg-white'} rounded-full shadow transform transition-transform duration-200 ${pendingDarkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
          />
        </button>
      </div>
      <div className={`flex items-center justify-between py-2 border-t ${divider}`}>
        <span className={`font-medium ${textLabel}`}>{t.showSwitch2Games}</span>
        <button
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 ${pendingShowSwitch2Games ? 'bg-red-600' : (showSwitch2Games ? 'bg-zinc-700' : 'bg-zinc-300')
            }`}
          onClick={() => setPendingShowSwitch2Games((v) => !v)}
          aria-pressed={pendingShowSwitch2Games}
        >
          <span
            className={`w-5 h-5 ${darkMode ? 'bg-zinc-900' : 'bg-white'} rounded-full shadow transform transition-transform duration-200 ${pendingShowSwitch2Games ? 'translate-x-6' : 'translate-x-0'
              }`}
          />
        </button>
      </div>
      <div className="flex justify-end mt-6">
        <button
          className={`px-5 py-2 rounded font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 ${applied ? 'opacity-70 cursor-default' : ''
            }`}
          onClick={handleApply}
          disabled={
            applied ||
            (pendingLanguage === language &&
              pendingDarkMode === darkMode &&
              pendingShowSwitch2Games === showSwitch2Games)
          }>
          {applied ? t.applied : t.apply}
        </button>
      </div>
      <div className={`mt-4 text-xs ${restartText} text-right`}>
        {t.currentTheme}: {darkMode ? t.dark : t.light}
        <p className={`mt-2 ${restartText}`}>{t.restartNotice}</p>
      </div>
    </div>
  )
}

export default Setting;
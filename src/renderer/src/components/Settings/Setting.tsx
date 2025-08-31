import React, { useState } from 'react'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' }
]

const Setting: React.FC = () => {
  const [language, setLanguage] = useState('en')
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [pendingLanguage, setPendingLanguage] = useState(language)
  const [pendingDarkMode, setPendingDarkMode] = useState(darkMode)
  const [applied, setApplied] = useState(false)

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleApply = async () => {
    setLanguage(pendingLanguage)
    setDarkMode(pendingDarkMode)
    setApplied(true)
    // Directly update settings.json in the renderer (Electron context only)
    try {
      // @ts-ignore
      const fs = window.require ? window.require('fs') : null
      // @ts-ignore
      const path = window.require ? window.require('path') : null
      if (fs && path) {
        const settingsPath = path.join(__dirname, '../../../settings.json')
        const newSettings = {
          language: pendingLanguage,
          darkMode: pendingDarkMode
        }
        fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2), 'utf-8')
      } else {
        alert('Direct file system access is only available in Electron renderer process.')
      }
    } catch (e) {
      alert('Failed to write settings.json: ' + e)
    }
    setTimeout(() => setApplied(false), 1200)
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">Settings</h2>
      <div className="mb-6">
        <label className="block text-zinc-600 dark:text-zinc-300 mb-2 font-medium">Language</label>
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`px-3 py-1 rounded transition-colors border border-zinc-200 dark:border-zinc-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-400 ${
                pendingLanguage === lang.code
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
              onClick={() => setPendingLanguage(lang.code)}
              aria-pressed={pendingLanguage === lang.code}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between py-2 border-t border-zinc-200 dark:border-zinc-700">
        <span className="text-zinc-600 dark:text-zinc-300 font-medium">Dark Mode</span>
        <button
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 ${
            pendingDarkMode ? 'bg-red-600' : 'bg-zinc-300 dark:bg-zinc-700'
          }`}
          onClick={() => setPendingDarkMode((v) => !v)}
          aria-pressed={pendingDarkMode}
        >
          <span
            className={`w-5 h-5 bg-white dark:bg-zinc-900 rounded-full shadow transform transition-transform duration-200 ${
              pendingDarkMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      <div className="flex justify-end mt-6">
        <button
          className={`px-5 py-2 rounded font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 ${
            applied ? 'opacity-70 cursor-default' : ''
          }`}
          onClick={handleApply}
          disabled={applied || (pendingLanguage === language && pendingDarkMode === darkMode)}
        >
          {applied ? 'Applied!' : 'Apply'}
        </button>
      </div>
    </div>
  )
}

export default Setting
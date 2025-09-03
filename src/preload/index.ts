import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  sendGame: (game: string, status: string, customGame: string) =>
    ipcRenderer.send('game', game, status, customGame),

  sendIdle: (clicks: number) =>
    ipcRenderer.send('idle', clicks),

  // Configuración de idioma y modo oscuro
  getUserConfig: () => ipcRenderer.invoke('get-user-config'),
  setLanguage: (lang: string) => ipcRenderer.invoke('set-language', lang),
  setDarkMode: (mode: boolean | 'system') => ipcRenderer.invoke('set-dark-mode', mode),
  onThemeChanged: (callback: (isDark: boolean) => void) => {
    ipcRenderer.on('theme-changed', (_event, isDark) => callback(isDark))
  },

  // Favoritos
  getFavorites: () => ipcRenderer.invoke('get-favorites'),
  setFavorites: (favorites: string[]) => ipcRenderer.invoke('set-favorites', favorites),
  addFavorite: (game: string) => ipcRenderer.invoke('add-favorite', game),
  removeFavorite: (game: string) => ipcRenderer.invoke('remove-favorite', game)
})

import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  sendGame: (game: string, status: string, customGame: string) =>
    ipcRenderer.send('game', game, status, customGame),

  sendIdle: (clicks: number) =>
    ipcRenderer.send('idle', clicks)
})

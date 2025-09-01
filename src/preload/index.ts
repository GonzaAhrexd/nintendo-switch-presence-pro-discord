import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
// Expone setDiscordPresence directamente en window.electronAPI para uso en React
contextBridge.exposeInMainWorld('electronAPI', {
  ...electronAPI,
  setDiscordPresence: (presence) => electronAPI.ipcRenderer.invoke('discord-set-presence', presence),
  saveSettings: (settings) => electronAPI.ipcRenderer.invoke('save-settings', settings),
  loadSettings: () => electronAPI.ipcRenderer.invoke('load-settings')
})

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
}

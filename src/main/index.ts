import { app, shell, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { join } from 'path'

const ElectronStore = require('electron-store')
const store = new ElectronStore.default({
  defaults: {
    language: app.getLocale ? app.getLocale().split('-')[0] : 'en',
    darkMode: 'system'
  }
})

function getUserConfig() {
  return {
    language: store.get('language', app.getLocale ? app.getLocale().split('-')[0] : 'en'),
    darkMode: store.get('darkMode', 'system')
  }
}

function applyDarkMode(win: BrowserWindow, mode: boolean | 'system') {
  if (mode === 'system') {
    win.webContents.send('theme-changed', nativeTheme.shouldUseDarkColors)
  } else {
    win.webContents.send('theme-changed', !!mode)
  }
}
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const rpc = require('discord-rich-presence')('1409736895440621610')
import gameData from '../games.json'

let window

let mainWindow: BrowserWindow | null = null
function createWindow(): void {

  const path = __dirname

  console.log(path)

  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    autoHideMenuBar: true,
  icon: join(app.getAppPath(), 'resources', 'icon.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
    mainWindow?.webContents.openDevTools({ mode: 'detach' })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Aplica el modo oscuro inicial
  applyDarkMode(mainWindow, store.get('darkMode', 'system'))

  // Escucha cambios del sistema si el modo es 'system'
  nativeTheme.on('updated', () => {
    if (store.get('darkMode', 'system') === 'system') {
      applyDarkMode(mainWindow!, 'system')
    }
  })

  setIdle()
}
// --- IPC para configuración ---
ipcMain.handle('get-user-config', () => {
  return getUserConfig()
})

ipcMain.handle('set-language', (event, language: string) => {
  store.set('language', language)
  if (mainWindow) mainWindow.webContents.send('language-changed', language)
  return { success: true }
})

ipcMain.handle('set-dark-mode', (_event, mode: boolean | 'system') => {
  store.set('darkMode', mode)
  if (mainWindow) applyDarkMode(mainWindow, mode)
  return { success: true }
})

let name: string
let customName: string
let desc: string
let img: string
let idle: number

// Executes when game data is recieved
ipcMain.on('game', (e, game, status, customGame) => {
  console.log("[IPC] Evento 'game' recibido:", { game, status, customGame })
  if (status === '') desc = 'Online'
  else desc = status.charAt(0).toUpperCase() + status.slice(1)
  name = game
  customName = customGame
  setRPC()
})

// Executes when idle data is recieved
ipcMain.on('idle', (e, clicks) => {
  idle = clicks
  setIdle()
})

// Sets the presence to idle
function setIdle() {
  console.log('Should work')
  if (idle === 16)
    return rpc.updatePresence({
      details: 'IDLE',
      state: 'IDLE',
      largeImageKey: 'yfi',
      largeImageText: 'IDLE..'
    })
  rpc.updatePresence({
    details: 'Home',
    state: 'Idle',
    largeImageKey: 'switch',
    largeImageText: 'Home'
  })
}

function setRPC() {
  // Log para depuración
  console.log('[setRPC] Ejecutando con:', { name, customName, desc })

  for (let i = 0; i < gameData.length; i++) {
    if (gameData[i].name === name) {
      img = gameData[i].img
      break
    }
  }

  const presenceData = {
    details: name === 'Custom' ? customName : name,
    state: desc,
    largeImageKey: img,
    largeImageText: name
  }
  console.log('[DiscordRPC] updatePresence:', presenceData)
  rpc.updatePresence(presenceData)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// Events to listen for
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (window === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

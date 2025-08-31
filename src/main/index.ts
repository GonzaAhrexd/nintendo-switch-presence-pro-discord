import { writeFile } from 'fs/promises'
// IPC handler to save settings.json from renderer
ipcMain.handle('save-settings', async (_event, settings) => {
  try {
    const filePath = join(__dirname, 'settings.json')
    await writeFile(filePath, JSON.stringify(settings, null, 2), 'utf-8')
    return { success: true }
  } catch (e) {
    return { success: false, error: String(e) }
  }
})
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// --- Discord Rich Presence Modular ---
import type { Presence } from 'discord-rich-presence'
let rpcClient: ReturnType<typeof require> | null = null
let lastPresence: Presence | null = null
let reconnectTimeout: NodeJS.Timeout | null = null

/**
 * Inicializa y actualiza el Discord Rich Presence.
 * Llama a esta función en cualquier momento para actualizar el Presence.
 * @param presence Objeto con las propiedades de Presence (details, state, largeImageKey, smallImageKey, startTimestamp, etc)
 */
function activarDiscordPresence(presence: Presence & { clientId?: string }) {
  if (!rpcClient) {
    if (!presence.clientId) {
      throw new Error('Debes proporcionar clientId la primera vez que llamas a activarDiscordPresence')
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    rpcClient = require('discord-rich-presence')(presence.clientId)
  }
  lastPresence = presence
  const { clientId, ...activity } = presence
  try {
    rpcClient.updatePresence(activity)
  } catch (e) {
    console.error('Error setting Discord Presence:', e)
    // Reintento simple
    if (!reconnectTimeout) {
      reconnectTimeout = setTimeout(() => {
        reconnectTimeout = null
        activarDiscordPresence(lastPresence!)
      }, 5000)
    }
  }
}

// Exponer vía IPC para que React pueda llamar desde el renderer
ipcMain.handle('discord-set-presence', async (_event, presence) => {
  try {
    activarDiscordPresence(presence)
    return { success: true }
  } catch (e) {
    return { success: false, error: String(e) }
  }
})

import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // Activa Presence automáticamente al iniciar la app (opcional)
    activarDiscordPresence({
      clientId: '1409736895440621610',
      details: 'Playing on Nintendo Switch',
      state: 'In the main menu',
      largeImageKey: 'nintendo_switch_logo',
      largeImageText: 'Nintendo Switch',
      startTimestamp: Date.now()
    })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

      setIdle();


}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

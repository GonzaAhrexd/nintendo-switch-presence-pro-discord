
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const rpc = require("discord-rich-presence")("1409736895440621610");
import gameData from "../games.json"

let window 

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // mainWindow.webContents.openDevTools({ mode: 'detach' })
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

  setIdle();
}

let name;
let customName;
let desc;
let img;
let idle;

// Executes when game data is recieved
ipcMain.on("game", (e, game, status, customGame) => {
  console.log("[IPC] Evento 'game' recibido:", { game, status, customGame });
  if (status === "") desc = "Online";
  else desc = status.charAt(0).toUpperCase() + status.slice(1);
  name = game;
  customName = customGame;
  setRPC();
});

// Executes when idle data is recieved
ipcMain.on("idle", (e, clicks) => {
    idle = clicks
    setIdle();
});

// Sets the presence to idle
function setIdle() {
  console.log("Should work")
  if (idle === 16) return rpc.updatePresence({
        details: "Yoshi's Fucking Island",
        state: "ccomign This Sprign",
        largeImageKey: "yfi",
        largeImageText: "he's sitting there.."});
    rpc.updatePresence({
        details: "Home",
        state: "Idle",
        largeImageKey: "switch",
        largeImageText: "Home"
    });
}

function setRPC() {

  // Log para depuración
  console.log("[setRPC] Ejecutando con:", { name, customName, desc });

  for (let i = 0; i < gameData.length; i++) {
      if (gameData[i].name === name) {
          img = gameData[i].img;
          break;
      }
    }

    const presenceData = {
      details: name === 'Custom' ? customName : name,
      state: desc,
      largeImageKey: img,
      largeImageText: name
    };
    console.log("[DiscordRPC] updatePresence:", presenceData);
    rpc.updatePresence(presenceData);
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// Events to listen for
app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (window === null) createWindow();
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

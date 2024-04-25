const path = require("path");

const { app, BrowserWindow, desktopCapturer } = require("electron");

const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV !== "development";

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    frame: false,
    title: "Dolus",
    width: 500,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "./index.html"));
  //if (isDev) {
   // mainWindow.webContents.openDevTools();
 // }
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

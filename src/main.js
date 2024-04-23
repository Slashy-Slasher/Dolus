const path = require("path");

const { app, BrowserWindow, desktopCapturer } = require("electron");

const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV !== "development";

//create a function that detects whether the user is in lightmode/darkmode
function detectColorScheme() {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.toggle("dark-mode");
  }
  else {
    document.body.classList.toggle("light-mode");
}
}

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

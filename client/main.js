import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconPath = path.join(__dirname, "public", "favicon.ico");

let window;
function createWindow() {
  const win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    minWidth: 1024,
    minHeight: 600,
    icon: iconPath,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.maximize();
  win.flashFrame(true);
  win.show();
  win.loadURL("http://localhost:5173/");
}

app.whenReady().then(async () => {
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});

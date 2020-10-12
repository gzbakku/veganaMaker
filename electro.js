const electron = require('electron');
const app = electron.app;
const browser = electron.BrowserWindow;
const ipc = require('hadron-ipc');

let win;

function createWindow(){
  win = new browser({
    width: 800,
    height: 600,
    frame:true,
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadFile('electric.html');
  win.webContents.openDevTools();
}

ipc.respondTo('reload', (sender) => {
  win.close();
  //app.quit();
  createWindow();
});

app.on('ready', createWindow);

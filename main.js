const { app, BrowserWindow } = require('electron')


app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 1240,
    height: 720,
    minWidth: 1240,
    minHeight: 720,
    transparent: true,
    backgroundColor: "#99333333",
    titleBarStyle: "hiddenInset",
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000/');
  } else {
    mainWindow.loadURL(`file://${__dirname}/build/index.html`);
  }
})

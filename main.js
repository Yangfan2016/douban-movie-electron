const { app, BrowserWindow } = require('electron')


app.on('ready', () => {
  let win=new BrowserWindow({
    width:1240,
    height:720,
    minWidth:1240,
    minHeight:720,
    transparent:true,
    backgroundColor:"#99333333",
    titleBarStyle:"hiddenInset",
  });

  win.loadURL('http://localhost:3000');

})

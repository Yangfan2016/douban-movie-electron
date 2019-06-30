const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const apiServer = require("./server/app");
const { server } = require("./app.config");
const path = require("path");

const template = [
  {
    label: '编辑',
    submenu: [
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  },
  {
    label: '查看',
    submenu: [
      {
        label: '重载',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            // 重载之后, 刷新并关闭所有的次要窗体
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(function (win) {
                if (win.id > 1) {
                  win.close();
                }
              });
            }
            focusedWindow.reload();
          }
        }
      },
      {
        label: '切换全屏',
        accelerator: (function () {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F';
          } else {
            return 'F11';
          }
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        }
      },
      {
        label: '切换开发者工具',
        accelerator: (function () {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I';
          } else {
            return 'Ctrl+Shift+I';
          }
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        }
      }
    ]
  },
  {
    label: '窗口',
    role: 'window',
    submenu: [
      {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: '退出',
        accelerator: 'Cmd+Q',
        role: 'quit'
      }
    ]
  }
];


if (process.env.NODE_ENV !== 'development') {
  // start api server
  apiServer.listen(server.port, () => {
    console.log(server.url);
  });
}

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 1160,
    height: 720,
    minWidth: 1160,
    minHeight: 720,
    transparent: true,
    backgroundColor: "#99333333", // #<aarrggbb>
    titleBarStyle: "hiddenInset",
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, "./build/index.html"));
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  let playWin = null;

  ipcMain.on("open-page-video", (ev, info) => {
    if (playWin) playWin.destroy();

    playWin = new BrowserWindow({
      width: 1100,
      height: 500,
      titleBarStyle: "hiddenInset",
    });

    let options = {
      query: {
        info: JSON.stringify(info),
      }
    };

    if (process.env.NODE_ENV === 'development') {
      playWin.loadFile(path.join(__dirname, "./public/play.html"), options);
    } else {
      playWin.loadFile(path.join(__dirname, "./build/play.html"), options);
    }

    playWin.focus();
  });

  ipcMain.on("open-dialog-msg", (ev, info) => {
    dialog.showMessageBox(playWin, {
      message: info,
    });
  });

});

app.on('before-quit', () => {
  // stop api server
  if (apiServer) {
    process.exit();
  }
});

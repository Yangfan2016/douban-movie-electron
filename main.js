const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const apiServer = require("./server/app");
const { server } = require("./app.config");
const path = require("path");
const { exec } = require('child_process');


const isProd = process.env.NODE_ENV !== "development";

const SYS_MAP = {
  'darwin': {
    shortcuts: {
      'devtools': 'Alt+Command+I'
    }
  },
  'win32': {
    shortcuts: {
      'devtools': 'Ctrl+Shift+I'
    }
  },
  'linux': {
    shortcuts: {
      'devtools': 'Ctrl+Shift+I'
    }
  }
};

const SYS_CONF_MAP = SYS_MAP[process.platform] || {};

const template = [
  {
    label: "app",
    submenu: [
      {
        label: '关于 douban-movie-electron',
        role: 'about',
      },
      {
        type: "separator",
      },
      {
        label: '退出',
        accelerator: 'Cmd+Q',
        role: 'quit'
      }
    ]
  },
  {
    label: "编辑",
    submenu: [
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      }
    ]
  },
  {
    label: '窗口',
    submenu: [
      {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: '重载',
        accelerator: 'CmdOrCtrl+R',
        role: 'reload'
      },
      {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      }
    ]
  },
  {
    label: '调试',
    submenu: [
      {
        label: '切换开发者工具',
        accelerator: SYS_CONF_MAP['shortcuts']['devtools'],
        click: function (_ev, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        }
      }
    ]
  }
];


if (isProd) {
  // start api server
  apiServer.listen(server.port, () => {
    console.log(server.url);
  });
} else {
  // start webpack-devserver
  require("./scripts/start");
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

  if (isProd) {
    mainWindow.loadFile(path.join(__dirname, "./build/index.html"));
  } else {
    mainWindow.loadURL('http://localhost:3000');
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

    if (isProd) {
      playWin.loadFile(path.join(__dirname, "./build/play.html"), options);
    } else {
      playWin.loadFile(path.join(__dirname, "./public/play.html"), options);
    }

    playWin.focus();
  });

  ipcMain.on("open-dialog-msg", (_ev, info) => {
    dialog.showMessageBox(playWin, {
      message: info,
    });
  });

});

app.on('before-quit', () => {
  // stop api server
  process.exit();
});

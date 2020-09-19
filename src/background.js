import {
  app, protocol, BrowserWindow, ipcMain,
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
const Store = require('electron-store');

const store = new Store();

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

const isLogin = store.get('isLogin');

function createWindow() {
  // Create the browser window.
  let winOpt = {
    width: 700,
    height: 473,
    resizable: false,
  };
  if (isLogin) {
    winOpt = {
      width: 1280,
      height: 800,
      resizable: true,
    };
  }
  win = new BrowserWindow({
    width: winOpt.width,
    height: winOpt.height,
    frame: false,
    titleBarStyle: 'hidden',
    resizable: winOpt.resizable,
    minimizable: true, // 可否最小化
    maximizable: true, // 可否最大化
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
      // for more info
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
  });

  // 最大化窗口
  win.on('maximize', () => {
    win.webContents.send('winIsMax', true);
  });

  // 取消最大化窗口
  win.on('unmaximize', () => {
    win.webContents.send('winIsMax', false);
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // try {
    //   await installExtension(VUEJS_DEVTOOLS);
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString());
    // }
  }
  // 查询所有 cookies。
  // session.defaultSession.cookies.get({})
  //   .then((cookies) => {
  //     console.log(cookies);
  //     createWindow();
  //   }).catch((error) => {
  //     console.log(error);
  //     createWindow();
  //   });
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

ipcMain.on('loginSuccess', () => {
  win.hide();
  setTimeout(() => {
    if (process.platform === 'darwin') {
      win.setWindowButtonVisibility(true);
      win.setTrafficLightPosition({ x: 15, y: 20 });
    }
    win.setResizable(true);
    win.maximize();
    win.center();
    win.show();
  }, 500);
});

ipcMain.on('logout', () => {
  win.hide();
  setTimeout(() => {
    if (process.platform === 'darwin') {
      win.setWindowButtonVisibility(false);
    }
    win.setSize(700, 473);
    win.setResizable(false);
    win.show();
    win.center();
  }, 300);
});

ipcMain.on('winShow', () => {
  win.show();
});

// 隐藏窗口
ipcMain.on('winHide', () => {
  win.hide();
});

// 最小化窗口
ipcMain.on('winMin', () => {
  win.minimize();
});

// 最大化窗口
ipcMain.on('winMax', (event) => {
  let isMax = false;
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
    isMax = true;
  }
  event.reply('winIsMax', isMax);
});

// 关闭窗口
ipcMain.on('winClose', (_, args) => {
  if (args) {
    store.set('isLogin', false);
    win.destroy();
  } else {
    // showLoginPage()
  }
});

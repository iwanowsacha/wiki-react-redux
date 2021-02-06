/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path, { resolve } from 'path';
import { app, BrowserWindow, ipcMain, Menu, MenuItem, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import {loadDocuments} from './directories';
import * as fs from 'fs-extra';
import { rejects } from 'assert';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let documents = {};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });
  loadDocuments().then((obj: any) => {
    documents = obj;
    mainWindow?.loadFile(`${__dirname}/index.html`);
  });


  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  
  menuBuilder.buildMenu();

  let menu = Menu.getApplicationMenu();
  menu?.append(new MenuItem({
    click: () => { 
      mainWindow?.webContents.send('new-list');
    },
    label: 'New List'
  }));
  menu?.append(new MenuItem({
    click: () => {
      console.log('article');
    },
    label: 'New Article'
  }))
  Menu.setApplicationMenu(menu);

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// ipcMain.handle('read-document', (event, title) => {
//   return new Promise((resolve, reject) => {

//     if (documents.articles.includes(title)) {
//       mainWindow.webContents.send('document-read', 'article');
//     } else if (documents.lists.includes(title)) {
//       fs.readJSON(path.join(__dirname, 'lists', title, 'list.json'))
//       .then((obj) => {
//         resolve({type: 'list', document: obj});
//       }).catch(err => reject(err));
//     }

//   });
// });

ipcMain.handle('read-list', (event, title) => {
  return new Promise((resolve, reject) => {
    if (!title) {
      resolve({document: {}});
    } else if ( documents.lists.includes(title) ) {
      fs.readJSON(path.join(__dirname, 'lists', title, 'list.json'))
      .then((obj) => {
        resolve({type: 'list', document: obj});
      }).catch(err => reject(err));
    } else {
      reject(`List: ${title} not found`);
    }
  })
})

ipcMain.handle('documents', () => {
  return documents;
});

ipcMain.handle('save-list', (event, list, newTitle) => {
  console.log(list.title);
  console.log(newTitle);
  if (newTitle && list.title != newTitle) {
    list.title = newTitle;
  }
  list.items[0].image = "000";
  mainWindow?.webContents.send('list-saved', list.items);
  return;
  if (documents.lists.includes(list.title)) {
    let json = JSON.stringify(list);
    fs.writeFile(path.join(__dirname, 'lists', list.title, 'list.json'), json);
    mainWindow?.webContents.send('list-saved');
  }
});
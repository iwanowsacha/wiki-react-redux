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
import path from 'path';
import { app, BrowserWindow, ipcMain, Menu, MenuItem, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import * as fs from 'fs-extra';
import MenuBuilder from './menu';
import { loadDocuments, DIRECTORIES } from './directories';
import { Article, DirectoriesList, List, ListItemImageChanges } from './types';
import { saveList } from './utils/list/list';
import { saveArticle } from './utils/article/article';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let documents: DirectoriesList = {};

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

  loadDocuments()
    .then((obj: { [key: string]: Array<string> }) => {
      documents = obj;
      mainWindow?.loadFile(`${__dirname}/index.html`);
      return true;
    })
    .catch(console.log);

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

  const menu = Menu.getApplicationMenu();

  menu?.append(
    new MenuItem({
      click: () => {
        mainWindow?.webContents.send('new-list');
      },
      label: 'New List',
    })
  );

  menu?.append(
    new MenuItem({
      click: () => {
        mainWindow?.webContents.send('new-article');
      },
      label: 'New Article',
    })
  );

  Menu.setApplicationMenu(menu);

  // Open urls in the user's browser
  // @TODO: look into open local urls in a different window
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    console.log(url);
    if (url.startsWith('local://')) {
      const document = url.replace('local://', '');
      if (
        !documents.articles.includes(document) &&
        !documents.lists.includes(document)
      )
        return;
      mainWindow?.webContents.send('open-list', url.replace('local://', ''));
    } else if (!url.endsWith('/src/index.html')) {
      shell.openExternal(url);
    }
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

ipcMain.handle('get-documents', (_event) => {
  return documents;
});

ipcMain.handle(
  'save-list',
  async (
    _event,
    list: List,
    newTitle: string,
    images: ListItemImageChanges
  ) => {
    const previousTitle: string = list.title ? list.title : newTitle;

    await saveList(list, newTitle, images);

    if (newTitle) {
      if (previousTitle !== newTitle) {
        documents.lists[documents.lists.indexOf(previousTitle)] = newTitle;
      } else if (previousTitle === newTitle) {
        documents.lists.push(newTitle);
      }
    }

    mainWindow?.webContents.send('open-list', list.title);
  }
);

ipcMain.handle(
  'save-article',
  async (_event, article: Article, newTitle: string) => {
    const previousTitle: string = article.title ? article.title : newTitle;

    await saveArticle(article, newTitle);

    if (newTitle) {
      if (previousTitle !== newTitle) {
        documents.articles[
          documents.articles.indexOf(previousTitle)
        ] = newTitle;
      } else if (previousTitle === newTitle) {
        documents.articles.push(newTitle);
      }
    }

    mainWindow?.webContents.send('open-article', article.title);
  }
);

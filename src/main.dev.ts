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
import { DirectoriesList, List, ListItemImageChanges } from './types';

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
        console.log('article');
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
      if (!documents.articles.includes(document) && !documents.lists.includes(document)) return;
      mainWindow?.webContents.send('open-list-link', url.replace('local://', ''));
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

ipcMain.handle('read-list', async (_event, title) => {
  if (!title) {
    return { document: {} };
  }
  const obj: List | undefined = await fs
    .readJSON(path.join(DIRECTORIES.lists, title, 'list.json'))
    .catch(console.log);
  return obj ? { type: 'list', document: obj } : { document: {} };
});

ipcMain.handle('documents', () => {
  return documents;
});

const renameDocumentDirectory = async (
  previousTitle: string,
  newTitle: string,
  documentType: string
) => {
  await fs.rename(
    path.join(__dirname, documentType, previousTitle),
    path.join(__dirname, documentType, newTitle)
  );
};

const createDocumentDirectory = async (
  directoryPath: string,
  subfolder?: string
) => {
  await fs.mkdir(directoryPath);
  if (subfolder) await fs.mkdir(path.join(directoryPath, subfolder));
};

const manageListItemImages = async (
  images: ListItemImageChanges,
  list: List
) => {
  const pathStartsWithFile = (filePath: string) =>
    filePath.startsWith('file://') ? filePath.slice(7) : filePath;

  const unlink = images.delete.map((value: string) => {
    return fs
      .unlink(
        path.join(
          DIRECTORIES.lists,
          list.title,
          'images',
          decodeURI(pathStartsWithFile(value))
        )
      )
      .catch(console.log);
  });
  const rename = Object.entries(images.rename).map(([key, value]) => {
    list.items[list.items.findIndex((it) => it.title === key)].image =
      key + path.extname(value);
    return fs
      .rename(
        path.join(DIRECTORIES.lists, list.title, 'images', value),
        path.join(
          DIRECTORIES.lists,
          list.title,
          'images',
          key + path.extname(value)
        )
      )
      .catch(console.log);
  });

  const create = Object.entries(images.new).map(([key, value]) => {
    list.items[list.items.findIndex((it) => it.title === key)].image =
      key + path.extname(value);
    return fs
      .copyFile(
        decodeURI(pathStartsWithFile(value)),
        path.join(
          DIRECTORIES.lists,
          list.title,
          'images',
          key + path.extname(value)
        )
      )
      .catch();
  });

  await Promise.all([unlink, rename, create]).catch(console.log);
};

ipcMain.handle(
  'save-list',
  async (
    _event,
    list: List,
    newTitle: string,
    images: ListItemImageChanges
  ) => {
    const previousTitle: string = list.title ? list.title : newTitle;
    if (newTitle && list.title !== newTitle) {
      list.title = newTitle;
    }
    const directoryExists: boolean = fs.existsSync(
      path.join(DIRECTORIES.lists, previousTitle)
    );
    if (directoryExists) {
      if (newTitle) renameDocumentDirectory(previousTitle, list.title, 'lists');
    } else {
      await createDocumentDirectory(
        path.join(DIRECTORIES.lists, list.title),
        'images'
      );
    }

    await manageListItemImages(images, list);
    // mainWindow?.webContents.send('list-saved', list.items);

    // if (documents.lists.includes(list.title)) {
      let json = JSON.stringify(list);
      fs.writeFile(path.join(__dirname, 'lists', list.title, 'list.json'), json);
      mainWindow?.webContents.send('list-saved', list.items);
    // }
  }
);

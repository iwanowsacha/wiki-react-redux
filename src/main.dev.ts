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
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItem,
  shell,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { MessageBoxOptions } from 'electron/main';
import MenuBuilder from './menu';
import { loadDocuments } from './directories';
import { Article, DirectoriesList, List, ListItemImageChanges } from './types';
import { deleteList, saveList } from './utils/list/list';
import { deleteArticle, saveArticle } from './utils/article/article';
import { openDevTools } from 'electron-debug';
import electronLocalShortcut from 'electron-localshortcut';


export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let documents: DirectoriesList = {};

app.commandLine.appendSwitch('high-dpi-support', '1');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  openDevTools();
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

  registerShortcuts();

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

  mainWindow.webContents.on('found-in-page', (_event, result) => {
    mainWindow?.webContents.send('found-in-page', result);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  let shouldWindowClose = false;
  mainWindow.on('close', (event) => {
    if (!shouldWindowClose) {
      event.preventDefault();
      mainWindow?.webContents.send('on-app-close');
    }
  });
  
  ipcMain.handle('app-close-confirmation', () => {
    shouldWindowClose = true;
    mainWindow?.close();
  });

  let menu: Menu | null;

  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    const menuBuilder = new MenuBuilder(mainWindow);
  
    menuBuilder.buildMenu();
    menu = Menu.getApplicationMenu();
  } else {
    menu = new Menu();
  }

  menu?.append(
    new MenuItem({
      role: 'fileMenu',
      submenu: [
        {
          click: () => {
            mainWindow?.webContents.send('open-index', '');
          },
          label: 'Home',
          accelerator: 'CommandOrControl+H'
        },
        {
          click: () => {
            mainWindow?.webContents.send('open-list', '');
          },
          label: 'New List',
          accelerator: 'CommandOrControl+L'
        },
        {
          click: () => {
            mainWindow?.webContents.send('open-article', '');
          },
          label: 'New Article',
          accelerator: 'CommandOrControl+N'
        },
        { type: 'separator' },
        { role: 'quit'}
      ]
    })
  )

  menu?.append(
    new MenuItem({
      label: 'Help',
      type: 'submenu',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            if (!mainWindow) return;
            const docWindow = new BrowserWindow({parent: mainWindow, modal: true, show: false, maximizable: true});
            docWindow.setMenuBarVisibility(false);
            docWindow.loadFile('./documentation.html');
            docWindow.once('ready-to-show', () => {
              docWindow.show();
            });
          }
        },
        { type: 'separator'},
        {
          label: 'About...',
          click: () => {
            showMessageDialog(false, {
              title: 'My Wiki',
              type: 'info',
              detail: `Version: ${app.getVersion()}\nRepository: github.com/iwanowsacha/wiki-react-redux`,
              message: 'My Wiki'
            });
          }
        }
      ]
    })
  );

  Menu.setApplicationMenu(menu);

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    if (!url.startsWith('locala://') && !url.startsWith('locall://') && !url.endsWith('/src/index.html')) {
      shell.openExternal(url);
    } else if (url.startsWith('local')) {
      const isArticle = url.startsWith('locala://') ? true : false;
      const document = isArticle ? url.replace('locala://', '') : url.replace('locall://', '');
      if ((isArticle && documents.articles.includes(document)) || (!isArticle && documents.lists.includes(document))) {
        mainWindow?.webContents.send(isArticle ? 'open-article' : 'open-list', document);
      }
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

const registerShortcuts = () => {
  electronLocalShortcut.register(mainWindow, 'CommandOrControl+Shift+I', () => {
    openDevTools();
  });
  
  electronLocalShortcut.register(mainWindow, 'CommandOrControl+F', () => {
    mainWindow?.webContents.stopFindInPage('clearSelection');
    mainWindow?.webContents.send('search-page');
  });
}

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

    try {

      await saveList(list, newTitle, images);
    } catch (e) {
      showMessageDialog(true, {title: 'error', message:e.message})
    }


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
    const previousTitle: string = article.title ? article.title : '';

    await saveArticle(article, newTitle);

    if (!previousTitle) {
      documents.articles.push(newTitle);
    } else if (previousTitle !== newTitle) {
      documents.articles[
        documents.articles.indexOf(previousTitle)
      ] = newTitle;
    }

    mainWindow?.webContents.send('open-article', article.title);
  }
);

ipcMain.handle('delete-document', async (_event, title: string, type: string) => {
  const clicked = showMessageDialog(true, {
    title: 'DELETE',
    message: "Are you sure you want to delete this document? This action can't be undone!",
    buttons: ['Cancel', 'Accept'],
    type: 'warning',
    defaultId: 0, cancelId: 0});
  if (clicked !== 0) {
    try {
      if (type === 'list') {
        await deleteList(title)
      } else if (type === 'article') {
        await deleteArticle(title);
      }
    } catch (e) {
      showMessageDialog(false, {title: 'ERROR', type: 'error', message: `Document couldn't be deleted`, detail: e});
      return;
    }
    documents[type+'s'].splice(documents[type+'s'].indexOf(title), 1);
    mainWindow?.webContents.send('open-index');
    showMessageDialog(false, {title: 'ERROR', type: 'info', message: `Document: ${title} deleted successfully`});
  }
});

const showMessageDialog = (isSync: boolean = false, options: MessageBoxOptions) => {
  if (!mainWindow) return;
  if (isSync) {
    return dialog.showMessageBoxSync(mainWindow, options);
  } else {
    return dialog.showMessageBox(mainWindow, options);
  }
}

ipcMain.handle('on-component-unmount', () => {
  const clicked = showMessageDialog(true, {
    title: 'Unsaved changes',
    message: 'You have unsaved changes, are you sure you want to exit?',
    buttons: ['Cancel', 'Accept'],
    cancelId: 0,
    defaultId: 0
  });
  return clicked !== 0;
});

ipcMain.on('search-in-page', (_event, text, options?) => {
  mainWindow?.webContents.findInPage(text, options);
});

ipcMain.on('stop-page-search', (_event, selection) => {
  mainWindow?.webContents.stopFindInPage(selection);
});
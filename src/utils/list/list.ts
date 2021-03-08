import path from 'path';
import * as fs from 'fs-extra';
import { ipcMain } from 'electron';
import {
  DIRECTORIES,
  createDirectoryIfNotExists,
  renameDirectory,
} from '../../directories';
import { List, ListItemImageChanges } from '../../types';

export const deleteList = async (title: string) => {
  await fs.remove(path.join(DIRECTORIES.lists, title));
}

export const saveList = async (
  list: List,
  newTitle: string,
  listImages: ListItemImageChanges
) => {
  const previousTitle = list.title ? list.title : newTitle;
  if (newTitle && list.title !== newTitle) {
    list.title = newTitle;
  }

  if (previousTitle !== newTitle) {
    await renameDirectory(
      path.join(DIRECTORIES.lists, previousTitle),
      path.join(DIRECTORIES.lists, newTitle)
    );
  } else {
    await createDirectoryIfNotExists(
      path.join(DIRECTORIES.lists, list.title, 'images')
    );
  }

  await manageListItemImages(listImages, list);

  const json = JSON.stringify(list);
  await fs
    .writeFile(path.join(DIRECTORIES.lists, list.title, 'list.json'), json)
    .catch(console.log);
};

const manageListItemImages = async (
  images: ListItemImageChanges,
  list: List
) => {
  const unlink = listImagesDelete(images.delete, list.title);
  const rename = listImagesRename(images.rename, list);
  const copy = listImagesCopy(images.new, list);
  await Promise.all([unlink, rename, copy]);
};

const listImagesDelete = (images: Array<string>, title: string) => {
  const unlink = images.map((value) => {
    return fs
      .unlink(
        path.join(
          DIRECTORIES.lists,
          title,
          'images',
          decodeURI(pathStartsWithFile(value))
        )
      )
      .catch(console.log);
  });
  return unlink;
};

const listImagesRename = (images: { [key: string]: string }, list: List) => {
  const rename = Object.entries(images).map(([key, value]) => {
    list.items[list.items.findIndex((it) => it.title === key)].image =
      key + path.extname(value);
    return renameDirectory(
      path.join(DIRECTORIES.lists, list.title, 'images', value),
      path.join(
        DIRECTORIES.lists,
        list.title,
        'images',
        key + path.extname(value)
      )
    );
  });
  return rename;
};

const listImagesCopy = (images: { [key: string]: string }, list: List) => {
  const create = Object.entries(images).map(([key, value]) => {
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
  return create;
};

const pathStartsWithFile = (filePath: string) =>
  filePath.startsWith('file://') ? filePath.slice(7) : filePath;

ipcMain.handle('read-list', async (_event, title) => {
  if (!title) {
    return { document: {} };
  }
  const obj: List | undefined = await fs
    .readJSON(path.join(DIRECTORIES.lists, title, 'list.json'))
    .catch(console.log);
  return obj ? { type: 'list', document: obj } : { document: {} };
});

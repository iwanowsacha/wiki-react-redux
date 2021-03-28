import { ipcMain } from 'electron';
import * as fs from 'fs-extra';
import path, { basename } from 'path';
import { Article } from '../../types';
import {
  createDirectoryIfNotExists,
  DIRECTORIES,
  renameDirectory,
} from '../../directories';
import { sanitizeFilename } from '../filenameSanitizer';
import convertToJPG from '../ffmpeg';

export const deleteArticle = async (title: string) => {
  await fs.remove(path.join(DIRECTORIES.articles, title));
}

export const saveArticle = async (article: Article, newTitle: string) => {
  const previousTitle: string = article.title ? article.title : newTitle;
  if (newTitle && article.title !== newTitle) {
    article.title = newTitle;
  }

  const sanitizedPreviousTitle: string = sanitizeFilename(previousTitle);
  const sanitizedTitle: string = sanitizeFilename(article.title);

  const directoryExists: boolean = fs.existsSync(
    path.join(DIRECTORIES.articles, sanitizedPreviousTitle)
  );

  if (directoryExists && newTitle) {
    await renameDirectory(
      path.join(DIRECTORIES.articles, sanitizedPreviousTitle),
      path.join(DIRECTORIES.articles, sanitizedTitle)
    );
  } else if (!directoryExists) {
    await createDirectoryIfNotExists(
      path.join(DIRECTORIES.articles, sanitizedTitle)
    );
  }

  if (basename(article.image) !== article.image) {
    await convertToJPG(article.image, path.join(DIRECTORIES.articles, sanitizedTitle, 'image.jpg'));
    article.image = 'image.jpg';
  }

  const json = JSON.stringify(article);
  await fs.writeFile(
    path.join(DIRECTORIES.articles, sanitizedTitle, 'article.json'),
    json
  );
};

ipcMain.handle('read-article', async (_event, title) => {
  if (!title) {
    return null;
  }
  const obj: Article | undefined = await fs
    .readJSON(path.join(DIRECTORIES.articles, sanitizeFilename(title), 'article.json'))
    .catch(console.log);
  return obj || null;
});

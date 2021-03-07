import { ipcMain } from "electron";
import { Article } from "../../types";
import * as fs from 'fs-extra';
import path from 'path';
import { createDirectoryIfNotExists, DIRECTORIES, renameDirectory } from "../../directories";

ipcMain.handle('read-article', async (_event, title) => {
    if (!title) {
        return { document: {} };
    }
    const obj: Article | undefined = await fs
        .readJSON(path.join(DIRECTORIES.articles, title, 'article.json'))
        .catch(console.log);
    return obj ? { type: 'article', document: obj } : { document: {} };
});

export const saveArticle = async (article: Article, newTitle: string) => {
    const previousTitle: string = article.title ? article.title : newTitle;
    if (newTitle && article.title !== newTitle) {
      article.title = newTitle;
    }

    const directoryExists: boolean = fs.existsSync(
      path.join(DIRECTORIES.articles, previousTitle)
    );

    if (directoryExists && newTitle) {
      await renameDirectory(path.join(DIRECTORIES.articles, previousTitle), path.join(DIRECTORIES.articles, newTitle));
    } else if (!directoryExists) {
      await createDirectoryIfNotExists(path.join(DIRECTORIES.articles, article.title));
    }

    const json = JSON.stringify(article);
    await fs.writeFile(
      path.join(DIRECTORIES.articles, article.title, 'article.json'),
      json
    );

}
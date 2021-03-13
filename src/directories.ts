import getAppDataPath from 'appdata-path';
import * as fs from 'fs-extra';
import path from 'path';
import { DirectoriesList } from './types';
import { unsanitizeFilename } from './utils/filenameSanitizer';

const appData = process.env.NODE_ENV === 'production' ? getAppDataPath("my-wiki") : `${__dirname}/..`;

export const DIRECTORIES: { [key: string]: string } = {
  articles: path.join(appData, 'articles'),
  lists: path.join(appData, 'lists')
};

export const createDirectoryIfNotExists = async (directoryPath: string) => {
  const exists = await fs.pathExists(directoryPath);
  if (!exists) await fs.mkdir(directoryPath, { recursive: true });
};

const prepareDirectories = async () => {
  const promises = Object.values(DIRECTORIES).map((directoryPath: string) =>
    createDirectoryIfNotExists(directoryPath)
  );
  await Promise.all(promises).catch(console.log);
};

export const renameDirectory = async (
  previousPath: string,
  newPath: string
) => {
  fs.rename(previousPath, newPath);
};

export const loadDocuments = async () => {
  const directoriesList: DirectoriesList = {};
  console.log(process.env.APPDATA);

  try {
    await prepareDirectories();

    Object.entries(DIRECTORIES).forEach(([key, directory]) => {
      directoriesList[key] = fs.readdirSync(directory).map((dir) => unsanitizeFilename(dir));
    });
  } catch (err) {
    console.log(err);
  }
  console.log(directoriesList);
  return directoriesList;
};

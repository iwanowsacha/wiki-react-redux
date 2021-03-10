import path from 'path';
import * as fs from 'fs-extra';
import { DirectoriesList } from './types';
import { unsanitizeFilename } from './utils/filenameSanitizer';

export const DIRECTORIES: { [key: string]: string } = {
  articles: path.join(__dirname, 'articles'),
  lists: path.join(__dirname, 'lists'),
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

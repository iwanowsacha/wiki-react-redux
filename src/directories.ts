import path from 'path';
import * as fs from 'fs-extra';
import { DirectoriesList } from './types';

export const DIRECTORIES: { [key: string]: string } = {
  articles: path.join(__dirname, 'articles'),
  lists: path.join(__dirname, 'lists'),
};

const createDirectoryIfNotExists = async (directoryPath: string) => {
  const exists = await fs.pathExists(directoryPath);
  if (!exists) fs.mkdir(directoryPath);
};

const prepareDirectories = async () => {
  const promises = Object.values(DIRECTORIES).map((directoryPath: string) =>
    createDirectoryIfNotExists(directoryPath)
  );
  await Promise.all(promises).catch(console.log);
};

export const loadDocuments = async () => {
  const directoriesList: DirectoriesList = {};

  try {
    await prepareDirectories();

    Object.entries(DIRECTORIES).forEach(([key, directory]) => {
      directoriesList[key] = fs.readdirSync(directory);
    });
  } catch (err) {
    console.log(err);
  }
  console.log(directoriesList);
  return directoriesList;
};

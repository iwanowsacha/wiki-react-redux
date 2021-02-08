import path from 'path';
import * as fs from 'fs-extra';
import { DirectoriesList } from './types';


export const DIRECTORIES: {[key: string]: string} = {
    articles: path.join(__dirname, 'articles'),
    lists: path.join(__dirname, 'lists')
}

const createDirectoryIfNotExists = async(path: string) => {
    const exists = await fs.pathExists(path);
    if (!exists) fs.mkdir(path);
}

const prepareDirectories = async () => {
    const promises = Object.values(DIRECTORIES).map((path: string) => createDirectoryIfNotExists(path));
    await Promise.all(promises).catch(console.log);
}

export const loadDocuments = async () => {

    let directoriesList: DirectoriesList = {};

    try {
        await prepareDirectories();

        for (let directory of Object.values(DIRECTORIES)) {
            directoriesList[directory.slice(directory.lastIndexOf('/')+1)] = await fs.readdir(directory);
        }

    } catch (err) {
        console.log(err);
    }
    
    return directoriesList;
}
const path = require('path');
const fs = require('fs-extra');


const DIRECTORIES = {
    articles: path.join(__dirname, 'articles'),
    lists: path.join(__dirname, 'lists')
}


async function directoryExists(path : string) {
    const exists = await fs.pathExists(path)
    if (!exists) {
        await fs.mkdir(path);
    }

}

async function prepareDirectories() {
    const promises = Object.values(DIRECTORIES).map((path) => directoryExists(path));
    await Promise.all(promises)
    .catch((err) => {
      console.log("prepareDirs -> err", err)
    });
}

export async function loadDocuments() {
    console.log(DIRECTORIES);

    let obj : any = {}

    try {
        await prepareDirectories()

        for (let directory of Object.values(DIRECTORIES)) {
            obj[directory.slice(directory.lastIndexOf('/')+1)] = await fs.readdir(directory)
        }

    } catch (err) {
        console.log(err)
    }

    console.log("returning object")
    return obj
}
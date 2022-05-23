import path from "path";
import {readdir, stat} from "fs/promises";

async function getDirs(paths: string[], basePath: string){
  return paths.reduce( async (acc, curr) => {
    const filePath = path.join(basePath,curr);
    console.log("Init waiting");
    const fileStat = await stat(filePath);
    if(fileStat.isDirectory()){
      return (await acc).concat(curr);
    }
    return acc;
  }, Promise.resolve([]) as Promise<Array<string>> );
}

function getFiles(paths: string[], dirs: string[]){
  return paths.filter(
    (element) => !dirs.find(
      (dir) => dir === element
    ));
}

export async function getProjectStructure(){
  const basePath = process.cwd();
  try {
    const paths = await readdir(basePath);
    const dirs = await getDirs(paths, basePath);
    const files = getFiles(paths, dirs);
    return {
      files,
      dirs
    };
  } catch (error) {
    console.log(error);
  }
}
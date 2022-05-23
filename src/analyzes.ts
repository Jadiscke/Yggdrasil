import path from "path";
import { readdir, stat } from "fs/promises";

type filePath = string;
type filePathArray = filePath[];

interface ProjectTree {
  parentDir: string;
  level: number;
  files: string[];
  dirs: string[];
  nestedDirs: ProjectTree[];
}

async function getDirs(paths: string[], basePath: string) {
  return paths.reduce(async (acc, curr) => {
    const filePath = path.join(basePath, curr);
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      return (await acc).concat(curr);
    }
    return acc;
  }, Promise.resolve([]) as Promise<filePathArray>);
}

function getFiles(paths: filePathArray, dirs: string[]) {
  return paths.filter((element) => !dirs.find((dir) => dir === element));
}

export async function getProjectStructure(
  level = 0,
  basePath: filePath
): Promise<ProjectTree> {
  const paths = await readdir(basePath);
  const dirs = await getDirs(paths, basePath);
  const files = getFiles(paths, dirs);
  let nestedDirs: Array<ProjectTree> = [];
  if (dirs.length > 0) {
    nestedDirs = await Promise.all(
      dirs.map(
        async (dir) =>
          await getProjectStructure(level + 1, path.join(basePath, dir))
      )
    );
  }
  return {
    parentDir: path.relative(process.cwd(), basePath),
    level,
    files,
    dirs,
    nestedDirs,
  };
}

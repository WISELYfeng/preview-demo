import { readdirSync } from 'fs';
import { resolve } from 'path';
import inquirer from 'inquirer';

const root = process.cwd();
const pagesPath = resolve(root, 'src/pages');

export function getPages() {
  return readdirSync(pagesPath)
    .map(name => ({ name }))
    .filter(k => !k.name.includes('.DS_Store'))
    .map(v => v.name);
}

export async function selectEntry(pages) {
  const { entry } = await inquirer.prompt([
    {
      type: 'list',
      name: 'entry',
      message: '请选择要运行的项目：',
      choices: pages
    }
  ]);
  return entry;
}

import { resolve } from 'path';

export function createAlias(pages) {
  const alias = {
    '@': resolve(__dirname, '../src')
  };

  pages.forEach(dir => {
    alias[`@${dir}`] = resolve(__dirname, `../src/pages/${dir}`);
  });

  return alias;
}

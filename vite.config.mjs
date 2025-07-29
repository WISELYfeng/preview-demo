import { defineConfig, loadEnv } from 'vite';
import { createPlugins } from './config-vite/plugins';
import { createAlias } from './config-vite/alias';
import { createCss } from './config-vite/css';
import { createBuild } from './config-vite/build';
import { getPages, selectEntry } from './config-vite/pages';
import { resolve } from 'path';

export default defineConfig(async ({ mode }) => {
  const isDev = mode === 'development';
  const pages = getPages();
  const VITE_ENTRY = await selectEntry(pages);
  const env = loadEnv(mode, resolve(__dirname, 'src/pages/' + VITE_ENTRY + '/'));

  console.log(`${isDev ? '运行' : '打包'}项目为:`, VITE_ENTRY);

  return {
    root: resolve(__dirname, 'src/pages/' + VITE_ENTRY + '/'), // 根据入口文件改变根目录
    publicDir: resolve(__dirname, `src/pages/${VITE_ENTRY}/public`),
    base: env.VITE_PUBLIC_PATH || './',
    resolve: {
      alias: createAlias(pages),
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    css: createCss(),
    plugins: createPlugins(VITE_ENTRY, loadEnv, mode),
    define: {
      __VUE_OPTIONS_API__: true, // 是否启用 Options API（data, methods, 等）
      __VUE_PROD_DEVTOOLS__: true, // 生产模式保留 Vue Devtools 支持
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    },
    server: {
      host: true,
      port: 5300,
      open: isDev ? '?style=0&secucode=SZHQ300803' : '',
      strictPort: false,
      proxy: {
        '^/dev-api': {
          target: ''
        },
        '/release': {
          target: env.VITE_APP_TARGET_URL,
          ws: true,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/release/, '')
        }
      }
    },
    build: createBuild(VITE_ENTRY, env, isDev)
  };
});

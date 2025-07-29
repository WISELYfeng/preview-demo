import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import mockDevServerPlugin from 'vite-plugin-mock-dev-server';
import viteCompression from 'vite-plugin-compression';
import legacy from '@vitejs/plugin-legacy';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import Components from 'unplugin-vue-components/vite';
import XIconResolver from '@compass/icons/resolver';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import { getPages } from './pages';
import { createHtmlPlugin } from 'vite-plugin-html';
import fs from 'fs';
import path from 'path';

export function createPlugins(VITE_ENTRY, loadEnv, mode) {
  const env = loadEnv(mode, process.cwd());
  const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'));
  const appVersion = pkg.version;
  const appEnv = env.VITE_APP_ENV || mode;

  const pages = getPages();
  const dynamicIconDirs = pages.map(dir => resolve(__dirname, `../src/pages/${dir}/assets/icons/svg`));
  return [
    vue(),
    createHtmlPlugin({
      inject: {
        data: {
          injectScript: `
            <script>
              window.__H5_INFO__ = {
                version: '${appVersion}',
                env: '${appEnv}'
              };
              console.log('%c[H5_VERSION]', 'color: green;', window.__H5_INFO__);
            </script>`
        }
      }
    }),
    vueJsx(),
    mockDevServerPlugin(),
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240,
      compressionOptions: { level: 9 },
      verbose: true,
      disable: false
    }),
    Components({
      dirs: [resolve(__dirname, '../src/components'), resolve(__dirname, `../src/pages/${VITE_ENTRY}/components`)],
      dts: false,
      resolvers: [VantResolver(), XIconResolver()]
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, '../src/assets/icons/svg'), ...dynamicIconDirs], // 指定需要缓存的图标文件夹
      symbolId: 'icon-[dir]-[name]'
    }),
    vueSetupExtend(),
    legacy({
      targets: ['android 4.1', 'ios 7.1', 'chrome 49', 'safari 11', 'firefox 53', 'edge 16'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      modernPolyfills: true
    })
  ];
}

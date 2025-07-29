import { resolve } from 'path';
import rollupDelete from 'rollup-plugin-delete';

export function createBuild(VITE_ENTRY, env, isDev) {
  return {
    minify: 'terser',
    format: { comments: !isDev },
    sourcemap: false,
    rollupOptions: {
      plugins: [
        rollupDelete({
          // 修改删除的目标路径为 doc 目录
          targets: [`docs/${VITE_ENTRY}`, `sourcemaps/${VITE_ENTRY}`],
          hook: 'buildStart'
        })
      ],
      input: {
        main: resolve(__dirname, `../src/pages/${VITE_ENTRY}/index.html`)
      },
      output: {
        chunkFileNames: chunkInfo => {
          const id = chunkInfo.facadeModuleId;
          if (!id) return 'static/js/[name]-[hash].js';

          // pages/projectA/views/xxx/index.vue，提取 xxx
          const match = id.match(/pages\/[^/]+\/views\/([^/]+)\/index\.vue$/);
          if (match) {
            const pageName = match[1];
            return `static/js/${pageName}-[hash].js`;
          }

          // 默认 fallback
          return 'static/js/[name]-[hash].js';
        },
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/node_modules\/(vue|vue-router|pinia|vueuse|axios|crypto|@compass\/icons)/.test(id)) {
              return 'vue-mix';
            }

            if (/node_modules\/echarts/.test(id)) {
              return 'echarts';
            }
            const match = id.match(/\/node_modules\/(?!.pnpm)([^\/]*)\//);
            return match ? match[1] : 'vendor';
          }
        }
      }
    },
    // 修改输出目录为 doc
    outDir: resolve(__dirname, `../docs/${VITE_ENTRY}`),
    terserOptions: {
      compress: {
        drop_debugger: true
      }
    }
  };
}
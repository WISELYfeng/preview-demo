import autoprefixer from 'autoprefixer';

export function createCss() {
  return {
    preprocessorOptions: {
      less: {
        additionalData: '@import "../src/assets/style/mixin.less";'
      }
    },
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['android >= 6.0', 'ios >= 7.1', 'chrome > 40', 'safari > 10', 'ff > 53', 'ie >= 11', 'edge >= 15'],
          grid: true
        })
      ]
    }
  };
}

import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';
import 'virtual:svg-icons-register';
import '@/assets/style/index-v2.less'; // 全局样式
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import importDirective from '@/directives';

async function initApp() {
  try {
    const debug = await import('@/utils/debug');
    await debug.default();
  } catch (err) {
    console.error('调试模块加载或执行时发生错误：', err);
  }
  const app = createApp(App);
  const store = createPinia().use(piniaPersist);
  // 注册指令
  importDirective(app, router, store);
  app.use(router).use(store).mount('#app');
}

initApp();

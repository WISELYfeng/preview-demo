/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_APP_TARGET_URL: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 解决无法识别 .vue 模块的问题。
declare module '*.vue' {
  import { Component } from 'vue';
  const component: Component;
  export default component;
}

\*\*🌱 基于 Vue3 全家桶、TS/JS、Vite 构建的多页面项目

- [x] ⚡ Vue3 + Vite4
- [x] 🍕 TypeScript
- [x] ✨ Vant4
- [x] 🍍 Pinia
- [x] Vue-router 4
- [x] 支持 SVG 图标自动注册组件
- [x] Axios
- [x] 打包资源 gzip 压缩
- [x] 开发环境 Mock 数据
- [x] ESLint
- [x] 开发环境调试面板

### 目录说明

```
.
├── config-vite               # Vite 构建、服务、代理等配置
├── dist                      # 构建产物）
├── jsconfig.json             # js 路径别名等配置
├── mock                      # 本地 mock服务(暂未使用)
├── package.json              # 依赖
├── src                       # 源代码主目录
│   ├── assets                # 静态资源（图片、字体等）
│   ├── components            # 全局或通用组件
│   ├── directives            # 自定义指令
│   ├── env.d.ts              # TypeScript 环境类型声明
│   ├── frame                 # 框架基础组件和全局状态（改动需谨慎）
│   │   ├── BaseLayout        # 页面框架布局组件
│   │   │   ├── BaseHeader.vue# Header 组件
│   │   │   └── index.vue     # 页面整体布局组件
│   │   ├── baseStore.js      # 全局基础通用状态管理（Pinia）
│   │   ├── useCachedViewStore.js # 基础通用路由缓存Store（keep-alive 管理）
│   │   └── useInitApp.js     # 应用初始化逻辑（如权限、配置加载等）
│   ├── hooks                 # 公共自定义hooks
│   ├── pages                 # 多页面应用（MPA）结构，每个文件夹一个页面应用
│   │   └── task-center       # 任务中心模块
│   │       ├── App.vue       # 入口组件
│   │       ├── index.html    # HTML
│   │       ├── main.js       # 入口
│   │       ├── router        # 路由配置
│   │       │   ├── index.js
│   │       │   └── routes.js
│   │       ├── store         # Pinia Store
│   │       │   └── app.js
│   │       └── views         # 视图
│   │           ├── home
│   │           │   └── index.vue
│   │           ├── page1
│   │           │   └── index.vue
│   │           └── page2
│   │               └── index.vue
│   ├── public                # 静态资源目录
│   ├── service               # API 调用逻辑和接口服务封装
│   │   ├── api               # 公共模块接口
│   │   │   ├── login
│   │   │   │   └── index.js  # 登录
│   │   ├── auth.js           # token存取
│   │   ├── encryption.js     # 加密方法
│   │   ├── enums             # 请求枚举常量
│   │   │   └── requestEnum.js
│   │   ├── http              # axios
│   │   │   └── index.js
│   │   └── refreshToken.js   # token 续期
│   └── utils                 # 工具包
│       ├── debug.js          # 调试工具
│       ├── formatter.js      # 格式化函数
│       ├── native.js         # 客户端交互相关封装
│       ├── others.js         # 其他杂项工具
│       └── url.js            # URL 处理工具
├── tsconfig.json             # TypeScript 编译器配置
└── vite.config.mjs           # Vite 配置（ESM）
```

## 运行项目

注意：要求 Node 版本 16+，可使用 [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) 进行本地 Node 版本管理，同时建议使用 [pnpm](https://pnpm.io/zh/installation) 包管理器。

```shell
# 安装依赖
pnpm install

# 启动服务
pnpm dev

# 测试环境构建
pnpm test

# 生产环境构建
pnpm build
```

### - <span id="vant">按需引入 vant 组件</span>

使用 `unplugin-vue-components` 插件进行按需自动引入组件，可通过[官方文档](https://vant-ui.github.io/vant/#/zh-CN/quickstart#2.-pei-zhi-cha-jian)了解更多。

### - <span id="svg">SVG 图标使用</span>

> 1. 将 svg 图标文件放在 `src/icons/svg` 目录下
> 2. 在项目中直接使用 `<svg-icon name="svg图标文件命名" />` 即可

例如：

本项目 `src/icons/svg` 中放了个叫 `check-in.svg` 的图标文件，然后在组件 `name` 属性中填入文件的命名即可

```Vue
<svg-icon name="check-in" />
```

> 项目中使用了 `unplugin-vue-components` 自动引入组件，所以 `main.ts` 中无需注册全局图标组件。

### - <span id="router">路由缓存 & 命名注意 ⚠</span>

组件默认开启缓存，如某个组件需关闭缓存，在对应路由 `meta` 内的 `noCache` 字段赋值为 `true` 即可。

```typescript
// src/router/routes.js
const routes: Array<RouteRecordRaw> = [
  // ...
  {
    path: 'about',
    name: 'About',
    component: () => import('@/views/about/index.vue'),
    meta: {
      title: '关于',
      noCache: true,
    },
  },
];
```

为了保证页面能被正确缓存，请确保**组件**的 `name` 值和对应路由的 `name` 命名完全相同。

```vue
<!-- src/views/about/index.vue -->
<script setup lang="ts" name="About">
// 使用了 `vite-plugin-vue-setup-extend` 插件，可在 `setup` 语法糖标签上添加 `name` 属性为组件命名
</script>

<template>
  <div>about</div>
</template>
```

### - <span id="page-title">动态设置页面标题</span>

在路由全局前置守卫中：

```js
// src/router/index.ts
// ...
router.beforeEach((to: toRouteType, from, next) => {
  // ...
  // 页面 title
  window.document.title = 'xxx';
  next();
});
```

### - <span id="mock">开发环境 Mock</span>

> 本项目开发环境支持 mock 请求数据，在 `mock` 目录中可配置接口和数据，具体见[文档](https://github.com/pengzhanbo/vite-plugin-mock-dev-server/blob/main/README.zh-CN.md)。

### Git 提交规则

```
具体见[文档](https://github.com/conventional-changelog/commitlint/#what-is-commitlint)。
eg:
feat(optional): adds ability to parse arrays

feat：新功能（feature）
chore：构建过程或辅助工具的变动
docs：文档（documentation）
fix：修补bug
revert: 回退版本
perf：性能
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动

1、每个提交都必须使用类型字段前缀，它由一个名词组成，如feat，其后接一个可选的作用域字段，以及一个必要的冒号（英文半角）和空格。
2、当一个提交为应用或类库实现了新特性时，必须使用feat类型
3、当一个提交为应用修复 bug 时，必须使用fix类型
4、作用域字段可以跟随在类型字段后面。作用有必须是一个描述某部分代码的名词，并用圆括号包围，例如：fix(parser):
5、描述字段在类型/作用域前缀的空格之后

```

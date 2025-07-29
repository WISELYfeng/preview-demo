import NotFound from '@/components/notFound.vue';
import Home from '@demo/views/home/index.vue';

const routes = [
  {
    path: '/',
    redirect: '/base-header'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '任务中心',
      keepAlive: true,
      level: 1
    }
  },
  {
    path: '/double-table',
    name: 'DoubleTable',
    component: () => import('@demo/views/double-table/index.vue'),
    meta: {
      title: '双表格',
      keepAlive: false,
      level: 1
    }
  },
  {
    path: '/single-table',
    name: 'SingleTable',
    component: () => import('@demo/views/single-table/index.vue'),
    meta: {
      title: '单表格',
      keepAlive: true,
      level: 1
    }
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('@demo/views/help/index.vue'),
    meta: {
      title: '帮助',
      keepAlive: true,
      level: 3
    }
  },
  {
    path: '/ellipsis-text',
    name: 'EllipsisText',
    component: () => import('@demo/views/ellipsis-text/index.vue'),
    meta: {
      title: '文本省略',
      keepAlive: true,
      level: 3
    }
  },
  {
    path: '/base-header',
    name: 'BaseHeader',
    component: () => import('@demo/views/base-header/index.vue'),
    meta: {
      title: 'BaseHeader',
      keepAlive: true,
      level: 1
    }
  },
  {
    path: '/app-search',
    name: 'AppSearch',
    component: () => import('@demo/views/app-search/index.vue'),
    meta: {
      title: 'AppSearch',
      keepAlive: true,
      level: 1
    }
  },
  {
    path: '/icons',
    name: 'Icons',
    component: () => import('@demo/views/icons/index.vue'),
    meta: {
      title: 'Icons',
      keepAlive: true,
      level: 1
    }
  },
  {
    path: '/industry',
    name: 'Industry',
    component: () => import('@demo/views/industry-list/index.vue'),
    meta: {
      title: 'Industry',
      keepAlive: true,
      level: 1
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    meta: {
      title: 'Page not found',
      isLogin: false
    },
    component: NotFound
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  },
  {
    path: '/page1',
    name: 'Page1',
    component: () => import('@demo/views/page1/index.vue'),
    meta: {
      title: 'page1',
      keepAlive: true,
      level: 2
    }
  },
  {
    path: '/page2',
    name: 'Page2',
    component: () => import('@demo/views/page2/index.vue'),
    meta: {
      title: 'page2',
      keepAlive: true,
      level: 3
    }
  }
];

export default routes;

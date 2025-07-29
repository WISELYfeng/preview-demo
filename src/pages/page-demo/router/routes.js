import NotFound from '@/components/notFound.vue';
import Home from '@page-demo/views/home/index.vue';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '布局测试',
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

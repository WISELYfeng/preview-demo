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
  }
];

export default routes;

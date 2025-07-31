import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes.js';
import { useCachedViewStoreHook } from '@/frame/useCachedViewStore.js';
import { getAuth, setAuth } from '@/service/auth.js';

const router = createRouter({
  history: createWebHashHistory('/scroll-demo'),
  routes
});

router.beforeEach(async (to, from, next) => {
  const toLevel = to?.meta?.level || 0;
  const fromLevel = from?.meta?.level || 0;
  if (fromLevel < toLevel) useCachedViewStoreHook().addCachedView(from); // 下级 → 上级：保留 from 页面

  if (toLevel < fromLevel) useCachedViewStoreHook().delCachedView(from); // 上级 → 下级：移除 from 页面缓存
  if (!getAuth('token')) {
    // const { accessToken } = await getToken();
    // setAuth('token', accessToken);
    next();
  } else {
    next();
  }
});

export default router;

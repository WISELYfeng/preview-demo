import { defineStore } from 'pinia';

export const useCachedViewStore = defineStore({
  id: 'cached-view',
  state: () => ({
    cachedViewList: [] // 缓存页面 keepAlive
  }),
  actions: {
    addCachedView(route) {
      // 不重复添加
      if (this.cachedViewList.includes(route.name)) return;
      if (route.meta.keepAlive) {
        this.cachedViewList.push(route.name);
      }
    },
    delCachedView(route) {
      const index = this.cachedViewList.indexOf(route.name);
      if (index > -1) {
        console.log('before this.cachedViewList', this.cachedViewList);
        this.cachedViewList.splice(index, 1);
        console.log('after this.cachedViewList', this.cachedViewList);
      }
    },
    delAllCachedViews() {
      this.cachedViewList = [];
    }
  }
});

export const useCachedViewStoreHook = () => {
  return useCachedViewStore();
};

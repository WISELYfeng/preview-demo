import { setOrigin } from '@/utils/url.js';
import { callClient, getAppStockList } from '@/utils/native.js';
import { nextTick } from 'vue';

/**
 * @param appOrigin
 * @param store
 * @param isGetSockList 是否获取自选股列表
 */
export function useInitApp(appOrigin, store, isGetSockList = false) {
  setOrigin(appOrigin);
  const getClientParamsCallback = params => {
    store.setClientParams(params);
  };
  const getClientParams = () => {
    console.log('执行客户端 getParams');
    callClient('getParams', null, getClientParamsCallback);
  };
  const getStockList = () => {
    window.getSelfStockCodesCallback = data => {
      store.setStockList(data);
    };
    if (import.meta.env.MODE === 'development') {
      store.myStocks = ['SZHQ300803', 'SHHQ600519'];
    } else {
      getAppStockList('getSelfStockCodesCallback');
    }
  };
  const handleOrientationChange = () => {
    nextTick(() => {
      // 竖屏判断
      const isVertical = store.clientHeight > store.clientWidth || window.matchMedia('(orientation: portrait)').matches;
      const isLandscape = store.clientHeight < store.clientWidth || window.matchMedia('(orientation: landscape)').matches;
      if (isVertical !== store.isVertical) {
        store.show = false;
        store.setWidthHeight();
        if (isLandscape) {
          console.warn('横屏模式');
          store.setIsVertical(false);
        }
        if (isVertical) {
          console.warn('竖屏模式');
          store.setIsVertical(true);
        }
        store.show = true;
        if (document.visibilityState === 'visible') {
          getClientParams();
        }
        if (`${store.isVertical}` !== sessionStorage.getItem('isVertical')) {
          // 屏幕方向有改变时重新渲染
          store.addPageKey();
        }
      }
    });
  };
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      handleOrientationChange();
    } else {
      sessionStorage.setItem('isVertical', store.isVertical);
    }
  };
  const resizeHandler = () => {
    handleOrientationChange();
    store.setWidthHeight();
  };
  const mount = () => {
    handleOrientationChange();
    if (isGetSockList) {
      getStockList();
    }
    window.addEventListener('orientationchange', handleOrientationChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', resizeHandler);
  };
  const unmount = () => {
    window.removeEventListener('orientationchange', handleOrientationChange);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('resize', resizeHandler);
  };

  return { mount, unmount, getStockList };
}

import { defineStore } from 'pinia';
import { getQueryString, getOsTypeByUa } from '@/utils/url.js';
import { setAuth } from '@/service/auth.js';
import { getToken } from '@/service/api/login/index.js';

const getClientW = () => {
  // 当前视口的宽度, innerWidth 兼容最好
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};
const getClientH = () => {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

export function createBaseStore(extraOptions = {}) {
  return defineStore('app', {
    state: () => ({
      ...extraOptions.state, // 允许添加额外的 state
      osType: getQueryString('os') || getOsTypeByUa(),
      isPC: (getQueryString('os') || getOsTypeByUa()).includes('win'),
      clientHeight: 0,
      clientWidth: 0,
      isVertical: null,
      myStocks: ['SZHQ300803', 'SHHQ600519'],
      pageLoading: false,
      statusHeight: 0,
      titleBarHeight: 0,
      headerHeight: 44,
      show: true,
      pageKey: 1,
      theme: document.documentElement.getAttribute('theme'),
      isDark: document.documentElement.getAttribute('theme')?.includes('dark'),
      clientPersonid: getQueryString('personid') || 'share',
      clientOsver: '',
      clientVer: '',
      clientAid: getQueryString('aid') || ''
    }),
    actions: {
      ...extraOptions.actions, // 允许添加额外的 action
      initToken() {
        return new Promise((rs, rj) => {
          // 获取token
          getToken()
            .then(({ accessToken }) => {
              setAuth('token', accessToken);
              rs();
            })
            .catch(err => {
              rj(err);
            });
        });
      },
      addPageKey() {
        this.pageKey++;
      },
      setClientParams(params) {
        const { statusHeight, titleBarHeight, personid, osver, aid, ver } = JSON.parse(params);
        console.log(' JSON.parse(params)', JSON.parse(params));
        this.statusHeight = statusHeight;
        this.titleBarHeight = titleBarHeight;
        this.headerHeight = statusHeight + titleBarHeight;
        this.clientAid = aid;
        this.clientOsver = osver;
        this.clientPersonid = personid;
        this.clientVer = ver;
      },
      setStockList(data) {
        this.myStocks = data.split(',');
      },
      setPageLoading(bool) {
        this.pageLoading.value = bool;
      },
      setPageTabActive(num) {
        this.pageTabActive = num;
      },

      setIsVertical(bool) {
        this.isVertical = bool;
      },
      setWidthHeight() {
        this.clientWidth = getClientW();
        this.clientHeight = getClientH();
        console.log('更新宽高', {
          宽度: this.clientWidth,
          高度: this.clientHeight
        });
      }
    },
    getters: {
      ...extraOptions.getters // 允许添加额外的 getters
    },
    persist: {
      enabled: true,
      strategies: [
        {
          storage: localStorage,
          paths: ['isPC', ...extraOptions.localStoragePaths]
        }
      ]
    }
  });
}

import { requestRefreshToken } from '@/service/api/login/index.js';

class RefreshToken {
  static _instance;
  static isRepeat;
  constructor() {
    if (new.target !== RefreshToken) return;
    if (!RefreshToken._instance) {
      RefreshToken.isRepeat = false;
      RefreshToken._instance = this;
    } else {
      RefreshToken.isRepeat = true;
      return RefreshToken._instance;
    }
  }

  isRepeat() {
    return RefreshToken.isRepeat;
  }

  getRefreshToken() {
    if (RefreshToken.isRepeat) return; // 防止并发请求时重复触发刷新token
    return new Promise((resolve, reject) => {
      requestRefreshToken()
        .then(res => {
          RefreshToken.isRepeat = false;
          const { accessToken } = res;
          if (accessToken) {
            resolve(accessToken);
          } else {
            reject();
          }
        })
        .catch(() => {
          RefreshToken.isRepeat = false;
        })
        .finally(() => {
          RefreshToken._instance = null; // 清空实例防锁死
        });
    });
  }
}

export default RefreshToken;

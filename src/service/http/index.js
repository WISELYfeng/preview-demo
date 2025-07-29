import Axios from 'axios';
import { ContentTypeEnum, ResultEnum } from '../enums/requestEnum.js';
import { showFailToast } from 'vant';
import 'vant/es/toast/style';
import { getOrigin, getOsTypeByUa, getCid, getTid } from '../../utils/url.js';
import { getSign } from '../encryption.js';
import { getAuth, removeAuth, setAuth } from '../auth.js';
import RefreshToken from '../refreshToken';

let subscribers = [];
function onAccessTokenFetched() {
  subscribers.forEach(cb => cb());
  subscribers = [];
}

function addSubscriber(cb) {
  return new Promise(resolve => {
    subscribers.push(() => {
      resolve(cb());
    });
  });
}

const configDefault = {
  headers: {},
  timeout: 10000,
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  data: {}
};

class Http {
  static axiosInstance;
  static axiosConfigDefault;

  constructor(config) {
    Http.axiosConfigDefault = config;
    Http.axiosInstance = Axios.create(config);
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  request(paramConfig) {
    const config = { ...Http.axiosConfigDefault, ...paramConfig };
    return new Promise((resolve, reject) => {
      Http.axiosInstance
        .request(config)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  httpInterceptorsRequest() {
    Http.axiosInstance.interceptors.request.use(
      config => {
        config.headers['Content-Type'] = ContentTypeEnum.JSON;
        config.headers['Content-Type'] = 'application/json';
        config.headers['x-timestamp'] = new Date().valueOf();
        config.headers['x-origin'] = getOrigin();
        config.headers['x-cid'] = getCid();
        config.headers['x-tid'] = getTid();
        config.headers['x-ostype'] = getOsTypeByUa();
        config.headers['x-sign'] = getSign(config.data);
        if (getAuth('token') && config.url.indexOf('login') < 0) {
          config.headers['Authorization'] = `Bearer ${getAuth('token')}`;
        }
        return config;
      },
      error => {
        showFailToast(error.message);
        return Promise.reject(error);
      }
    );
  }

  httpInterceptorsResponse() {
    Http.axiosInstance.interceptors.response.use(
      response => {
        const {
          status,
          data: { code, msg, data }
        } = response;

        return new Promise((rs, rj) => {
          const isSuccess = data && Reflect.has(response.data, 'code') && code === ResultEnum.SUCCESS;
          if (status === 200 && isSuccess) return rs(data);

          if ([401].includes(code)) {
            // 未授权
            const config = {
              ...response.config,
              data: JSON.parse(response.config.data || '{}')
            };
            addSubscriber(() => this.request(config)).then(rs);
            const RefreshTokenFn = new RefreshToken();

            if (!RefreshTokenFn.isRepeat()) {
              removeAuth('token');
              return RefreshTokenFn.getRefreshToken().then(token => {
                setAuth('token', token);
                onAccessTokenFetched(rs);
              });
            }
          } else {
            showFailToast(msg);
            return rj(msg);
          }
        });
      },
      error => {
        if (error?.message) {
          if (error.message === 'Network Error') {
            showFailToast('网络连接故障');
          } else {
            showFailToast(error.message);
          }
        }
        return Promise.reject(error);
      }
    );
  }
}

export const http = new Http(configDefault);

import { http } from '@/service/http/index';
import { getCid } from '@/utils/url.js';

export function getToken() {
  return http.request({
    url: '/user/auth/login',
    method: 'post',
    data: {
      cid: getCid()
    }
  });
}

export function requestRefreshToken() {
  return http.request({
    url: '/user/auth/login',
    method: 'post',
    data: {
      cid: getCid()
    }
  });
}

export function setAuth(key, value) {
  return localStorage.setItem(key, value);
}

// 获取
export function getAuth(key) {
  return localStorage.getItem(key);
}

// 删除
export function removeAuth(key) {
  return localStorage.removeItem(key);
}

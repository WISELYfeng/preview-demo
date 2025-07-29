let origin;

export function setOrigin(data) {
  origin = data;
}

export function getOrigin() {
  return origin;
}

export function getTheme() {
  const themeAttr = document.documentElement.getAttribute('theme') || 'light';
  return themeAttr;
}

export function getCid() {
  const cid = getQueryString('personid');
  if (cid) {
    return cid;
  } else {
    return 'share';
  }
}

export function getTid() {
  const tid = getQueryString('aid');
  if (tid) {
    return tid;
  } else {
    // return '';
    // todo 测试值，需要修改  2024.11.11
    return 'zhinantong_appxAADwC';
  }
}

export function getOperator() {
  const operator = getQueryString('operator');
  if (operator) {
    return Number(operator);
  } else {
    return 0;
  }
}

export function getSecuCode() {
  const secucode = getQueryString('secucode');
  if (secucode) {
    return secucode;
  } else {
    console.warn('secucode为：' + secucode);
    return '';
    // return 'BJHQ873693'
  }
}

export const getOsTypeByUa = () => {
  const osType = getQueryString('os') || getQueryString('osType'); // 交易客户端使用'osType'，指南针使用'os'
  if (osType) return osType.toLowerCase();

  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf('Mac OS X') > -1;
  const isHarmonyOS = u.toLowerCase().includes('harmonyos');
  if (isIOS) return 'ios';
  if (isAndroid) return 'android';
  if (isHarmonyOS) return 'harmonyos';
  return 'other';
};

// 获取url中的值
export function getQueryString(name) {
  //获取url中的值
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

/**
 * @api  objectToQueryString(obj)  对象转换为url参数
 * @apiName objectToQueryString
 * @apiParam {obj} [obj]
 * @apiSuccess {Object} object 返回字符串
 * @example
 *  const obj1 = { name: 'Alice', age: 30 };
 *  console.log(objectToQueryString(obj1)); // 输出："&name=Alice&age=30"
 *
 *  const obj2 = {};
 *  console.log(objectToQueryString(obj2)); // 输出：""
 */
function objectToQueryString(obj) {
  if (!obj || Object.keys(obj).length === 0) {
    return '';
  }
  const queryString = Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return queryString;
}

/**
 * 将 URL 查询字符串转换为对象
 * @param {string} search - URL 查询字符串，默认使用 window.location.search
 * @returns {Object} - 包含查询字符串键值对的对象
 * @example
 *  const queryParams = parseQueryString();
 */
function parseQueryString(search = window.location.search) {
  const queryObject = {};
  if (!search) return queryObject;
  // 去掉开头的 '?' 或 '&'
  const queryString = search.startsWith('?') || search.startsWith('&') ? search.substring(1) : search;
  // 分割成键值对数组
  const pairs = queryString.split('&');
  // 遍历键值对并添加到对象中
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) {
      queryObject[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  }
  return queryObject;
}

/**
 * @api  locationHrefTo({ routerPathName, appendParams })  携带原有参数，生成新的 url 并跳转新的 webview
 * @apiName locationHrefTo
 * @apiParam {String} [routerPathName] routerPathName 要跳转的路由名称
 * @apiParam {Object} [appendParams] url后新增参数
 * @apiParam {Object} [projectName] 项目名称、默认为 dzjy
 * @apiParam {Number} [znzflag] 网页内部地址跳转，是否打开新页面【https://www.kdocs.cn/l/cm1jDvGreFN5】
 * @apiSuccess {void} 无返回
 * @description znzflag=48 (打开新页面、展示通用帮助入口)
 */
export const locationHrefTo = ({ routerPath, appendParams, projectName = 'dzjy', znzflag = 48, url = null }) => {
  let newUrl = new URL(window.location.href);
  const urlParams = parseQueryString(window.location.search);
  const mergeObj = {
    ...urlParams,
    znzflag,
    ...appendParams
  };
  const appParams = objectToQueryString(mergeObj);
  let link = newUrl.origin + `/h5/${projectName}/${routerPath}?` + appParams;
  if (url) {
    const separator = url.includes('?') ? '&' : '?';
    link = url + separator + appParams;
  }
  try {
    // App内跳转
    window.location.href = link;
  } catch (err) {
    throw new Error('跳转失败错误信息：' + err);
  }
};

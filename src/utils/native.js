import { getOsTypeByUa } from './url.js';
import { useThrottleFn } from '@vueuse/core';

export function goToStock(code, tab) {
  let url = 'znzapp://gotostock?';
  if (code) {
    url = url.concat('id='.concat(code));
  }
  if (tab) {
    url = url.concat('&tab='.concat(tab));
  }
  window.location.href = url;
}
export function gotoURL(url, id, type) {
  let finalURL = 'znzapp://gotourl?';
  if (url) {
    finalURL = finalURL.concat('url='.concat(encodeURIComponent(url)));
  }
  if (id) {
    finalURL = finalURL.concat('&id='.concat(id));
  }
  if (type) {
    finalURL = finalURL.concat('&type='.concat(type));
  }
  window.location.href = finalURL;
}
/**
 * 挂载方法到window （重复挂载报错）
 * @param callback 需要挂载的回调方法
 */
const setCallbackToWindow = callback => {
  try {
    Object.defineProperty(window, callback.name, {
      value: callback,
      writable: true // 禁止修改 todo
    });
  } catch (err) {
    if (err?.message?.indexOf('redefine') > -1) {
      console.error('setCallbackToWindow 挂载重复>>>>>>>>   window.', callback.name);
    } else {
      console.error('setCallbackToWindow 挂载其他错误>>>>>>>>   window.', callback.name);
    }
  }
};

/**
 * 客户端交互（统一为异步方式）
 * @param methodName 客户端方法名（必传）string
 * @param params 客户端方法参数（非必传）obj
 * @param callback 回调方法（非必传）function
 */
export const callClient = (methodName, params, callback) => {
  const osType = getOsTypeByUa();
  if (!['android', 'win', 'ios', 'harmonyos'].includes(osType)) {
    return;
  }
  try {
    console.log(`调用${osType}客户端[${methodName}] >>> params:`, params);
    // 统一方法调用逻辑
    const invokeMethod = (target, funcName, parameters) => {
      if (!target?.[funcName]) {
        console.warn(`${osType} 客户端未找到方法: ${funcName}`);
        return;
      }
      //安卓、鸿蒙、PC按序接收值，不接收参数
      const result = parameters !== null && typeof parameters !== 'undefined' ? target[funcName](...Object.values(parameters)) : target[funcName]();
      if (callback) {
        setCallbackToWindow(callback);
        window[callback.name]?.(result);
      }
    };
    let pcTarget;
    let iosMessage = Object.assign({ action: methodName }, params);
    switch (osType) {
      case 'ios':
        if (callback) {
          console.log('callback', callback);
          setCallbackToWindow(callback);
          iosMessage.callback = callback.name;
        }
        window.webkit?.messageHandlers?.system?.postMessage?.(iosMessage);
        break;
      case 'android':
        invokeMethod(window.external, methodName, params);
        break;
      case 'harmonyos':
        invokeMethod(window.harBridge, methodName, params);
        break;
      case 'win':
        if (window.external) {
          pcTarget = window.external;
        } else if (window.Dispatch) {
          pcTarget = window.Dispatch;
        } else {
          console.error('PC客户端未提供external或Dispatch方法>>>>>>>');
        }
        invokeMethod(pcTarget, methodName, params);
        break;
    }
  } catch (err) {
    console.error(`${osType} callClient >>> ${methodName} >>> 交互错误:`, err.stack || err);
  }
};

// 设置客户端头部返回按钮颜色 (type 1:白色-竖屏 0:黑色-横屏)
export const setAppBackColor = useThrottleFn(type => {
  console.log('type', type);
  callClient('changeBackImageTheme', { type: type });
}, 300);

export const gotoAppSearch = callBackName => {
  try {
    const osType = getOsTypeByUa();
    if (osType === 'android') {
      if (window.external) window.external.gotoSearchStock(callBackName);
    } else if (osType === 'harmonyos') {
      if (window.harBridge) window.harBridge.gotoSearchStock(callBackName);
    } else if (osType === 'ios') {
      window.webkit?.messageHandlers?.system?.postMessage({
        action: 'gotoSearchStock',
        callback: callBackName
      });
    } else {
      console.log('请登录指南针手机客户端');
    }
  } catch (err) {
    console.log(err);
  }
};
export const getAppStockList = callBackName => {
  try {
    const osType = getOsTypeByUa();
    if (osType === 'android') {
      if (window.external) window.external.getSelfStockCodes(callBackName);
    } else if (osType === 'harmonyos') {
      if (window.harBridge) window.harBridge.getSelfStockCodes(callBackName);
    } else if (osType === 'ios') {
      window.webkit?.messageHandlers?.system?.postMessage({
        action: 'getSelfStockCodes',
        callback: callBackName
      });
    } else {
      console.log('请登录指南针手机客户端');
    }
  } catch (err) {
    console.log(err);
  }
};

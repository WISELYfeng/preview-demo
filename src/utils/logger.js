// utils/logger.js
import { runtimeConfig } from './config.js';

const logLevels = ['none', 'error', 'warn', 'info', 'log'];

function shouldLog(type) {
  let currentLevel = runtimeConfig.SHOW_LOG === 'true' ? 'log' : 'warn';
  const index = logLevels.indexOf(currentLevel);
  const typeIndex = logLevels.indexOf(type);
  return typeIndex <= index;
}

const originLog = console.log;
const originInfo = console.info;
const originWarn = console.warn;
const originError = console.error;

export const replaceConsole = function () {
  console.log = function () {
    const timestamp = new Date().toLocaleString();
    const timestampMs = new Date().getMilliseconds();
    const args = [`[${timestamp}:${timestampMs}]`, ...arguments];
    shouldLog('log') && originLog.apply(console, args);
  };
  console.info = function () {
    const timestamp = new Date().toLocaleString();
    const timestampMs = new Date().getMilliseconds();
    const args = [`[${timestamp}:${timestampMs}]`, ...arguments];
    shouldLog('info') && originInfo.apply(console, args);
  };
  console.warn = function () {
    const timestamp = new Date().toLocaleString();
    const timestampMs = new Date().getMilliseconds();
    const args = [`[${timestamp}:${timestampMs}]`, ...arguments];
    shouldLog('warn') && originWarn.apply(console, args);
  };
  console.error = function () {
    const timestamp = new Date().toLocaleString();
    const timestampMs = new Date().getMilliseconds();
    const args = [`[${timestamp}:${timestampMs}]`, ...arguments];
    shouldLog('error') && originError.apply(console, args);
  };
};

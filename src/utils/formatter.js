import dayjs from 'dayjs';

/**
 * 日期转报告期
 * @param date
 * @returns {string}
 */
export function getReportType(date) {
  const tenThousand = 10000;
  const year = date.toString().slice(0, 4);
  switch (date % tenThousand) {
    case 331:
      return year + '一季报';
    case 630:
      return year + '中报';
    case 930:
      return year + '三季报';
    case 1231:
      return year + '年报';
    default:
      return '';
  }
}

/**
 * 日期转报告期_单季度
 * @param date
 * @returns {string}
 */
export function getReportType_single(date) {
  const tenThousand = 10000;
  const year = date.toString().slice(0, 4);
  switch (date % tenThousand) {
    case 331:
      return year + '一季度';
    case 630:
      return year + '二季度';
    case 930:
      return year + '三季报';
    case 1231:
      return year + '四季度';
    default:
      return '';
  }
}

/**
 * 数值转换为‘万’或‘亿’
 * @param num
 * @param allowZero 是否允许0
 * @returns {string}
 */
export function unitToWanYi(num, allowZero = false) {
  const data = Math.abs(Number(num));
  if (data === null || data === 0 || String(data) === '--' || String(data) === 'NaN' || String(data) === 'undefined') {
    if (allowZero) {
      return '0.00';
    } else {
      return '--';
    }
  }
  const number = Number(num);
  if (data <= 10000) {
    return String(number.toFixed(2));
  } else if (data > 10000 && data < 100000000) {
    return String((number / 10000).toFixed(2)) + '万';
  } else {
    return String((number / 100000000).toFixed(2)) + '亿';
  }
}

/**
 * 数值转换为‘亿’
 * @param num
 * @returns {string}
 */
export function unitToYiByNumber(num) {
  const data = Math.abs(Number(num));
  if (data === null || data === 0 || String(data) === '--' || String(data) === 'NaN' || String(data) === 'undefined') {
    return 0;
  }
  const number = Number(num);
  return String((number / 100000000).toFixed(2));
}

/**
 * 数字转为百分比，保留小数位自定义 /100
 * @param num
 * @param digit
 * @param allowZero 是否允许0
 * @param showUnit 是否展示单位（%），默认展示
 * @returns {string}
 */
export function percentage(num, digit, allowZero = false, showUnit = true) {
  if (num === null || isNaN(Number(num))) {
    return '--';
  }
  const data = Number(num);
  if (!allowZero && data === 0) {
    return '--';
  }
  const unit = showUnit ? '%' : '';
  return String((data / 100).toFixed(digit)) + unit || '--';
}

/**
 * 缩小倍数
 * @param num
 * @param multiple 倍数
 * @param digit 保留小数位
 * @param allowZero 是否允许0
 * @returns {string}
 */
export function reduce(num, multiple, digit, allowZero = false) {
  const data = Number(num);

  if (allowZero && data === 0) {
    return '0.00';
  }

  if (data === null || data === 0 || String(data) === '--' || String(data) === 'NaN' || String(data) === 'undefined') {
    return '--';
  }

  return (data / multiple).toFixed(digit) || '--';
}

/**
 * 计算变动百分比
 * @param current 当前值
 * @param prev 上一个值
 * @returns {string} 变动百分比字符串
 */
export function calcChange(current, prev) {
  if (current === null || prev === null) {
    return '--';
  }
  const change = (((current - prev) / prev) * 100).toFixed(2) + '%';
  return change;
}

/**
 * 获取股票代码（截取后六位）
 * @param {string} input - 输入的字符串
 * @returns {string} - 截取后六位字符串
 */
export function sliceAfterSix(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }
  if (!input) return '';
  return input.slice(-6);
}

/**
 * 截取年月日
 * @param {string} t - 输入的时间（"2024-05-11 12:34:24"）
 * @returns {string} - 返回 2024-05-11
 */
export const getYMD = t => {
  if (!t) return '';
  let result = '';
  try {
    result = t.split(' ')[0];
  } catch (err) {
    result = '--';
    console.log('getYMD err', err);
  }
  return result;
};

/**
 * 格式化时间戳
 * @param {number} timestamp 输入的时间戳
 * @returns {string} 返回格式化的时间字符串
 */
export function formatTimestamp(timestamp) {
  const now = dayjs();
  const date = dayjs(timestamp);

  const diffInSeconds = now.diff(date, 'second'); // 时间差 单位为秒

  // 刚刚（1分钟内）
  if (diffInSeconds <= 60) {
    return '刚刚';
  }

  // MM分钟前（1分钟 < t < 60分钟）
  const diffInMinutes = now.diff(date, 'minute');
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }

  // 今天的时间（60分钟 ≤ t 且在今日24:00之前）
  if (now.isSame(date, 'day')) {
    return date.format('HH:mm');
  }

  // 昨天的时间（在今日00:00之前 且未早于昨天00:00）
  if (now.subtract(1, 'day').isSame(date, 'day')) {
    return `昨天 ${date.format('HH:mm')}`;
  }

  // 今年的时间（在今年1月1日00:00之后）
  if (now.isSame(date, 'year')) {
    return date.format('MM-DD HH:mm');
  }

  // 早于今年1月1日00:00的时间
  return date.format('YYYY-MM-DD HH:mm');
}

/**
 * 计算两个日期之间的天数差
 * @param {string|number} startDateStr 开始日期字符串或日期时间戳
 * @param {string|number} endDateStr 结束日期字符串或日期时间戳
 * @returns {number|null} 返回天数差 如果日期格式无效返回null
 */
export function daysBetween(startDateStr, endDateStr) {
  const startDate = dayjs(`${startDateStr}`, ['YYYYMMDD', 'YYYY-MM-DD']);
  const endDate = dayjs(`${endDateStr}`, ['YYYYMMDD', 'YYYY-MM-DD']);

  if (!startDate.isValid() || !endDate.isValid()) {
    console.error('日期格式无效');
    return null;
  }

  return endDate.diff(startDate, 'day');
}

/**
 * 保留两位小数
 * @param {string|number} value 输入值 可以是字符串或数字
 * @returns {string} 返回保留两位小数的字符串 如果输入值无效则返回 "无效数字"
 */
export function toTwoDecimal(value) {
  return isNaN(value) ? '--' : parseFloat(value).toFixed(2);
}

/**
 * 根据指定的key进行排序
 * @param {Array} array - 要排序的数组
 * @param {String} key - 要排序的key
 * @param {Boolean} [isAscending=true] - 是否为升序（默认升序）
 * @param {Array} unSortItem - 不参与排序的项
 */
export function sortByKey(array, key, isAscending = 0, unSortItem = [{ key: '', value: '' }]) {
  console.log('开始排序', array, key);
  return array.sort((x, y) => {
    let needReturn;
    unSortItem.forEach(item => {
      if (x[item.key] === item.value || y[item.key] === item.value) needReturn = true;
    });
    if (needReturn) return;
    let valueX = x[key];
    let valueY = y[key];
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(valueX) && dateRegex.test(valueY)) {
      // 判断是否为日期格式，部分safari 不支持 yyyy-mm-dd,做替换 yyyy/mm/dd
      valueX = +new Date(valueX.replaceAll('-', '/'));
      valueY = +new Date(valueY.replaceAll('-', '/'));
    }
    if (typeof valueX === 'string' && valueX.includes('%')) {
      // 如果是百分比字符串，将其转化为数字
      valueX = parseFloat(valueX.replace('%', ''));
      valueY = parseFloat(valueY.replace('%', ''));
    } else {
      // 转换为数字
      valueX = parseFloat(valueX);
      valueY = parseFloat(valueY);
    }

    // i.  第一排序规则：所选数值本身。
    // ii. 第二排序规则：股票代码和所选的排序顺序。
    // 升序排序
    if (isAscending === 1) {
      if (valueX !== valueY) {
        return valueX - valueY;
      } else {
        return x.secucodeFormat - y.secucodeFormat;
      }
    } else {
      // 降序排序
      if (valueX !== valueY) {
        return valueY - valueX;
      } else {
        return y.secucodeFormat - x.secucodeFormat;
      }
    }
  });
}

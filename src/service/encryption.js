import MD5 from 'crypto-js/md5';
import BASE64 from 'crypto-js/enc-base64';
import UTF8 from 'crypto-js/enc-utf8';
import { runtimeConfig } from '@/utils/config';

export const getSign = data => {
  // 递归
  const processData = body => {
    let keys_str = '';
    // 对象检查
    if (body && typeof body === 'object' && !Array.isArray(body)) {
      // 获取对象的键并排序
      const keys = Object.keys(body)
        .filter(key => key !== 'sign' && body[key] !== null && body[key] !== undefined)
        .sort();

      // 遍历排序后的键
      for (const key of keys) {
        keys_str += processData(body[key]);
      }
    } else if (Array.isArray(body)) {
      // 数组，递归处理每个元素（数组后逗号分隔，最后一个元素不拼逗号）
      for (const [index, item] of body.entries()) {
        keys_str += `${processData(item)}${index < body.length - 1 ? ',' : ''}`;
      }
    } else {
      // 基本类型，直接拼接
      keys_str += String(body);
    }

    return keys_str;
  };

  /* 更新密钥先加密再存储 public/config
    const wordArray = UTF8.parse('nBTsFaMBwL6IBqf6'); // 先转成 WordArray
    const base64 = BASE64.stringify(wordArray);
    console.log(" base64", base64);
  */

  const decodedWordArray = BASE64.parse(runtimeConfig.PRIVATE_KEY);
  const private_key = UTF8.stringify(decodedWordArray);

  const body = JSON.parse(JSON.stringify(data)); // 深拷贝
  const keys_str = private_key + processData(body);
  return MD5(keys_str).toString();
};

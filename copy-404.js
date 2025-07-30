const fs = require('fs');
const path = require('path');

// 源文件路径
const source = path.resolve(__dirname, 'public', '404.html');

// 目标文件夹列表
const targets = ['docs/page-demo']; // 根据实际情况调整

targets.forEach(target => {
  const dest = path.resolve(__dirname, target, '404.html');
  fs.copyFileSync(source, dest);
  console.log(`Copied 404.html to ${dest}`);
});
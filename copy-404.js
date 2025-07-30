// copy-404.js
const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, 'public', '404.html');
const dest = path.resolve(__dirname, 'docs', '404.html');

// 确保 docs 目录存在
if (!fs.existsSync(path.dirname(dest))) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
}

fs.copyFileSync(source, dest);
console.log('✅ Copied 404.html to /docs/404.html');

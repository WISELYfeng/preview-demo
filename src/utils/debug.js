const TIME_START = new Date().getTime();

const CFG = {
  KEY_URL: 'debug',
  KEY_STORAGE: 'isWebDebug',
  SCRIPT_CONSOLE: 'https://misc-cdn.compass.cn/js/eruda.min.js'
};

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function () {
      resolve();
    };
    script.onerror = function () {
      console.error(`Failed to load script: ${url}`);
      reject(new Error(`Failed to load script: ${url}`));
    };
    script.src = url;
    document.head.appendChild(script);
  });
}

function getStorage(name) {
  return localStorage.getItem(name);
}

function setStorage(name, value) {
  localStorage.setItem(name, value);
}

function getDebugMode() {
  const urlParams = new URLSearchParams(window.location.search);
  const debugQuery = urlParams.get(CFG.KEY_URL);
  if (debugQuery === 'true') {
    setStorage(CFG.KEY_STORAGE, 'true');
    return true;
  } else if (debugQuery === 'false') {
    setStorage(CFG.KEY_STORAGE, 'false');
    return false;
  } else {
    return getStorage(CFG.KEY_STORAGE) === 'true';
  }
}

function toggleDebugMode(enable) {
  const url = new URL(window.location);
  if (enable) {
    setStorage(CFG.KEY_STORAGE, 'true');
  } else {
    url.searchParams.delete(CFG.KEY_URL);
    setStorage(CFG.KEY_STORAGE, 'false');
  }
  window.location.href = url.toString();
}

function setupRapidClickTrigger() {
  let clickCounter = 0;
  let resetClickTimer;

  const handleRapidClicks = () => {
    clickCounter++;
    clearTimeout(resetClickTimer);

    resetClickTimer = setTimeout(() => {
      clickCounter = 0;
    }, 1000);

    if (clickCounter === 30) {
      initDebugDevtools(); // 初始化调试工具
    }
  };

  document.addEventListener('click', handleRapidClicks);
}

function initDebugDevtools() {
  if (document.getElementById('debugDevtools')) {
    return;
  }

  const debugDevtoolsHtml = `
    <div id="debugDevtools" class="debug-devtools">
      <div id="debugBtn" class="action-btn debug-btn">调试</div>
      <div id="startBtn" class="action-btn start-btn btn-hidden">开启</div>
      <div id="stopBtn" class="action-btn stop-btn btn-hidden">关闭</div>
      <div id="refreshBtn" class="action-btn refresh-btn btn-hidden">刷新</div>
    </div>
  `;

  const debugDevtoolsCss = `
    .debug-devtools {
      position: fixed;
      bottom: 10px;
      right: 10px;
      z-index: 9999;
      width: 40px;
      height: 40px;
    }

    .debug-devtools .action-btn {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #007bff;
      transition: top 0.3s ease, opacity 0.3s ease;
      color: #ffffff;
      font-size: 12px;
      outline: none;
      opacity: 0;
      cursor: pointer;
      user-select: none;
      pointer-events: none;
      -webkit-tap-highlight-color: transparent;
    }

    .debug-devtools .debug-btn {
      top: 0;
      opacity: 1;
      pointer-events: auto;
    }

    .debug-devtools .btn-show {
      opacity: 1;
      pointer-events: auto;
    }

    .debug-devtools .start-btn.btn-show {
      top: -150px;
    }

    .debug-devtools .stop-btn.btn-show {
      top: -100px;
    }

    .debug-devtools .refresh-btn.btn-show {
      top: -50px;
    }

    .debug-devtools .action-btn[disabled] {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `;

  document.body.insertAdjacentHTML('beforeend', debugDevtoolsHtml);

  const style = document.createElement('style');
  style.textContent = debugDevtoolsCss;
  document.head.appendChild(style);

  const debugDevtools = document.getElementById('debugDevtools');
  const debugBtn = document.getElementById('debugBtn');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const refreshBtn = document.getElementById('refreshBtn');

  debugBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    startBtn.classList.toggle('btn-hidden');
    startBtn.classList.toggle('btn-show');
    stopBtn.classList.toggle('btn-hidden');
    stopBtn.classList.toggle('btn-show');
    refreshBtn.classList.toggle('btn-hidden');
    refreshBtn.classList.toggle('btn-show');
  });

  startBtn.addEventListener('click', () => toggleDebugMode(true));

  stopBtn.addEventListener('click', () => toggleDebugMode(false));

  refreshBtn.addEventListener('click', () => window.location.reload());

  // 点击 document 的其他地方隐藏按钮
  document.addEventListener('click', function (e) {
    if (e.target !== debugBtn && debugDevtools && !debugDevtools.contains(e.target)) {
      startBtn.classList.add('btn-hidden');
      startBtn.classList.remove('btn-show');
      stopBtn.classList.add('btn-hidden');
      stopBtn.classList.remove('btn-show');
      refreshBtn.classList.add('btn-hidden');
      refreshBtn.classList.remove('btn-show');
    }
  });
}

function init() {
  return new Promise((resolve, reject) => {
    if (getDebugMode()) {
      loadScript(CFG.SCRIPT_CONSOLE)
        .then(() => {
          // eslint-disable-next-line no-undef
          eruda.init();
          const loadTime = new Date().getTime() - TIME_START;
          console.log(`debug init success, loadTime: ${loadTime} ms`);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
      initDebugDevtools();
    } else {
      resolve();
    }
    setupRapidClickTrigger();
  });
}

export default init;

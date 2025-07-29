<template>
  <div class="menu-fixed">
    <van-icon name="shrink" size="25" @click="fullScreen" class="not-full-screen" />
    <div v-if="showConfig">
      <van-button plain style="margin-left: 10px; height: 26px" @click="toggleStyle" size="small">日/夜</van-button>
    </div>
  </div>
  <div class="layout" :class="{ horizontal: isHorizontal }" :key="layoutKey">
    <div class="menu" v-if="showMenu">
      <template v-for="menu in menuList" :key="menu.path">
        <van-button plain :type="menu.path !== activeMenuPath ? 'default' : 'primary'" @click="menuClick(menu)" class="btn-menu">
          {{ menu.name }}
        </van-button>
      </template>
    </div>
    <div class="pane left" :style="{ width: leftWidth + 'px' }">
      <slot name="left" />
    </div>
    <div class="resizer" @mousedown="onMouseDown" @touchstart="onTouchStart" v-if="showResizer"></div>
    <div class="pane right" :style="{ flex: 1 }" v-if="showRight">
      <div class="iframe-container">
        <iframe :src="helpUrl" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $route = useRoute();
const $router = useRouter();
const props = defineProps({
  appStore: { type: Object, required: true },
  helpUrl: { type: String, default: 'https://www.baidu.com' }
});

// Load all settings from sessionStorage or use defaults
const showConfig = ref(sessionStorage.getItem('showConfig') !== 'false');
const showMenu = ref(sessionStorage.getItem('showMenu') !== 'false');
const showResizer = ref(sessionStorage.getItem('showResizer') !== 'false');
const showRight = ref(sessionStorage.getItem('showRight') !== 'false');
const leftWidth = ref(Number(sessionStorage.getItem('leftWidth')) || 400);
const isDragging = ref(false);

const isHorizontal = ref(leftWidth.value > 530);
const minWidth = 200;
const maxWidth = window.innerWidth - 100;
const layoutKey = ref(0);

// Save settings to sessionStorage whenever they change
watch(showConfig, (val) => sessionStorage.setItem('showConfig', val));
watch(showMenu, (val) => sessionStorage.setItem('showMenu', val));
watch(showResizer, (val) => sessionStorage.setItem('showResizer', val));
watch(showRight, (val) => sessionStorage.setItem('showRight', val));
watch(leftWidth, (val) => {
  sessionStorage.setItem('leftWidth', val);
  isHorizontal.value = val > 530;
  props.appStore.setIsVertical(!isHorizontal.value);
}, { immediate: true });

// Mouse events
const onMouseMove = (e) => {
  if (!isDragging.value) return;
  leftWidth.value = Math.min(Math.max(e.clientX, minWidth), maxWidth);
};

const onMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
};

const onMouseDown = (e) => {
  e.preventDefault();
  isDragging.value = true;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

// Touch events
const onTouchMove = (e) => {
  if (!isDragging.value) return;
  const clientX = e.touches[0].clientX;
  leftWidth.value = Math.min(Math.max(clientX, minWidth), maxWidth);
};

const onTouchEnd = () => {
  if (isDragging.value) {
    isDragging.value = false;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  }
};

const onTouchStart = (e) => {
  isDragging.value = true;
  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('touchend', onTouchEnd);
};

onMounted(() => {
  const savedLeftWidth = sessionStorage.getItem('leftWidth');
  if (savedLeftWidth) {
    leftWidth.value = Number(savedLeftWidth);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchEnd);
});

const menuList = [
  { path: '/base-header', name: '标题栏[BaseHeader]' },
  { path: '/single-table', name: '单表格页面[VirtualScrollTable]' },
  // { path: '/double-table', name: '双表格页面[VirtualScrollTable]' },
  { path: '/ellipsis-text', name: '文本省略[EllipsisText]' },
  { path: '/app-search', name: '客户端搜索[AppSearch]' },
  { path: '/icons', name: '图标[Icons]' },
  { path: '/industry', name: '行业筛选[Industry]' }
];
const activeMenuPath = ref($route.path);

watch(
  () => $route.path,
  (newPath) => {
    activeMenuPath.value = newPath;
    sessionStorage.setItem('activeMenuPath', newPath);
  }
);

const menuClick = (menu) => {
  // 如果已经是当前路由，则不重复导航
  if ($route.path !== menu.path) {
    $router.push(menu.path);
  }
};

const fullScreen = () => {
  showConfig.value = !showConfig.value;
  showMenu.value = !showMenu.value;
  showResizer.value = !showResizer.value;
  showRight.value = !showRight.value;
  leftWidth.value = showConfig.value ? 400 : document.body.offsetWidth;
  sessionStorage.setItem('showConfig', showConfig.value);
  sessionStorage.setItem('showMenu', showMenu.value);
  sessionStorage.setItem('showResizer', showResizer.value);
  sessionStorage.setItem('showRight', showRight.value);
  sessionStorage.setItem('leftWidth', leftWidth.value);
};

function toggleStyle() {
  const url = new URL(window.location.href);
  const currentStyle = url.searchParams.get('style') || '0';
  const newStyle = currentStyle === '0' ? '1' : '0';
  url.searchParams.set('style', newStyle);
  window.location.href = url.toString();
}
</script>

<style scoped>
.menu {
  width: 100px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  margin-top: 30px;
}

.menu-fixed {
  width: 200px;
  position: absolute;
  left: 5px;
  top: 5px;
  z-index: 999999;
  display: flex;
  align-items: center;
  margin: 5px;
  border-radius: 30px;
}

.layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  touch-action: none;
}

.pane {
  height: 100%;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.menu::-webkit-scrollbar,
.pane::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.left {
  background-color: var(--bg_deep);
  height: 100%;
  padding: 0px;
  border: 1px solid #c3c3c3;
  border-radius: 10px;
}

.right {
  background-color: #ffffff;
}

.resizer {
  width: 10px;
  background-color: #d6d6d6;
  cursor: ew-resize;
  touch-action: none;
  margin-left: 2px;
  margin-right: 2px;
}

.resizer:hover {
  background-color: #c1c1c1;
}

/* ✅ 横屏时样式示例，可自定义 */
.layout.horizontal .left {
}

.menu {
  width: 200px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.iframe-container {
  width: 100%;
  height: 100vh;
}

iframe {
  width: 100%;
  height: 100%;
}

.btn-menu {
  margin-top: 10px;
}

.not-full-screen {
  background: #ffffff;
}
</style>

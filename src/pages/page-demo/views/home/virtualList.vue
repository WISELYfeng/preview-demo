<template>
  <div ref="list" class="infinite-list-container" @scroll="scrollEventHandle($event)">
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div ref="items" class="infinite-list-item" v-for="item in visibleData" :key="item.id" :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }">{{ item.value }}</div>
    </div>
  </div>
</template>
<script setup>
// script setup 部分
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';

const props = defineProps({
  listData: {
    type: Array,
    default: () => []
  }
});

const screenHeight = ref(0);
const itemSize = 150;
const startOffset = ref(0);
const start = ref(0);
const end = ref(0);
const list = ref(null);
const observer = ref(null); // 保存 observer 实例

const listHeight = computed(() => props.listData.length * itemSize);
const visibleCount = computed(() => Math.ceil(screenHeight.value / itemSize));
const getTransform = computed(() => `translate3d(0, ${startOffset.value}px, 0)`);
const visibleData = computed(() => {
  return props.listData.slice(start.value, Math.min(end.value, props.listData.length));
});

function scrollEventHandle() {
  const scrollTop = list.value.scrollTop;
  start.value = Math.floor(scrollTop / itemSize);
  end.value = start.value + visibleCount.value;
  startOffset.value = scrollTop - (scrollTop % itemSize);
}

// 👇 新增：使用 ResizeObserver 监听高度变化
function initResizeObserver() {
  if (!list.value) return;

  observer.value = new ResizeObserver(entries => {
    for (let entry of entries) {
      const height = entry.contentRect.height;
      if (height !== screenHeight.value) {
        screenHeight.value = height;
        // 高度变化后，重新计算 start/end
        const scrollTop = list.value.scrollTop;
        start.value = Math.floor(scrollTop / itemSize);
        end.value = start.value + visibleCount.value;
      }
    }
  });

  observer.value.observe(list.value);
}

onMounted(() => {
  initResizeObserver();

  // 初始化 start/end
  nextTick(() => {
    const height = list.value?.clientHeight;
    if (height > 0) {
      screenHeight.value = height;
    }
    start.value = 0;
    end.value = start.value + visibleCount.value;
  });
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<style scoped lang="less">
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
  height: 100%;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>

<template>
  <div ref="list" class="infinite-list-container" @scroll="scrollEventHandle($event)">
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div ref="items" class="infinite-list-item" v-for="item in visibleData" :key="item.id" :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }">{{ item.value }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';

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
const end = ref(null);
const list = ref(null);

const listHeight = computed(() => props.listData.length * itemSize); // 列表总高度
const visibleCount = computed(() => Math.ceil(screenHeight.value / itemSize)); // 可显示列表长度
const getTransform = computed(() => `translate3d(0, ${startOffset.value}px,0)`); // 动画过度样式
const visibleData = computed(() => props.listData.slice(start.value, Math.min(end.value, props.listData.length))); // 实际显示的列表数据

function scrollEventHandle() {
  // 当前滚动位置
  let scrollTop = list.value.scrollTop;
  // 此时的开始索引
  start.value = Math.floor(scrollTop / itemSize);
  // 此时的结束索引
  end.value = start.value + visibleCount.value;
  // 此时的偏移量
  startOffset.value = scrollTop - (scrollTop % itemSize);
}
onMounted(() => {
  screenHeight.value = list.value.clientHeight;
  start.value = 0;
  end.value = start.value + visibleCount.value;
});
</script>

<style scoped lang="less">
//.infinite-list-container {
//  height: 100%;
//  width: 100%;
//}
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
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>

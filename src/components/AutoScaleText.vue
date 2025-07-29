<template>
  <div ref="containerRef" class="auto-scale-container" :style="{ width: `${parentWidth}px` }">
    <div class="scale-wrapper" :style="{ transform: `scale(${scale})`, transformOrigin: 'left center' }">
      <div ref="textRef" class="auto-scale-text">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, onMounted, nextTick, shallowRef, onUnmounted } from 'vue';

const parentWidth = shallowRef(0);
const containerRef = ref(null);
const textRef = ref(null);
const scale = shallowRef(1);
let observer = null;

const updateScale = () => {
  nextTick(() => {
    const parent = containerRef.value?.parentElement;
    if (!parent || !textRef.value) return;
    const style = window.getComputedStyle(parent);
    const paddingLeft = parseFloat(style.paddingLeft);
    const paddingRight = parseFloat(style.paddingRight);
    parentWidth.value = parent.clientWidth - paddingLeft - paddingRight;
    const containerWidth = parentWidth.value;
    const textWidth = textRef.value.scrollWidth;
    if (textWidth < containerWidth) {
      scale.value = 1;
      return;
    }
    scale.value = Math.min(1, containerWidth / textWidth);
  });
};
let rafId = null;
const updateScaleThrottled = () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    updateScale();
    rafId = null;
  });
};
onMounted(() => {
  updateScale();
  // 使用 MutationObserver 监听内容变化
  observer = new MutationObserver(updateScaleThrottled);
  if (textRef.value) {
    observer.observe(textRef.value, {
      childList: true,// 观察子节点的变化
      subtree: true,
      characterData: true
    });
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<style scoped>
.auto-scale-container {
  overflow: hidden;
}

.scale-wrapper {
  display: inline-block;
}

.auto-scale-text {
  display: inline-block;
  white-space: nowrap;
}
</style>

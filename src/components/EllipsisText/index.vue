<template>
  <div class="truncate-container" ref="textRef">
    <span class="text-content">{{ props.text }}</span>
    <div class="action-wrapper" v-if="needToggle">
      <div class="split"></div>
      <div class="action">
        <slot name="action">
          <span style="color: var(--text_light)" @click.stop="actionExpand">...</span>
          <span style="color: var(--text_light); margin-left: 10px" @click.stop="actionExpand">详情</span>
        </slot>
      </div>
    </div>
  </div>
  <DetailDialog v-model:show="expanded" :text="props.text" />
</template>

<script setup lang="js">
import { ref, onMounted, nextTick, computed } from 'vue';
import { getTheme } from '@/utils/url';
import DetailDialog from './DetailDialog.vue';

const props = defineProps({
  text: String,
  lines: { type: Number, default: 2 }
});
const emit = defineEmits(['click-action']);
const expanded = ref(false);
const needToggle = ref(false);
const textRef = ref(null);

const actionExpand = () => {

  expanded.value = true;
  emit('click-action', props.text);
};

const checkOverflow = () => {
  nextTick(() => {
    const el = textRef.value;
    if (!el) return;

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    const maxHeight = props.lines * lineHeight;
    const actualHeight = el.scrollHeight;

    if (actualHeight > maxHeight) {
      needToggle.value = true;
    }
  });
};

onMounted(() => {
  checkOverflow();
});

const splitBackground = computed(() => {
  return getTheme()?.includes('dark')
    ? 'linear-gradient(90deg, rgba(28, 28, 28, 0) 0%, #1c1c1c 100%)'
    : 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #fff 100%)';
});
</script>

<style scoped>
.truncate-container {
  position: relative;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: v-bind(lines); /* 默认2行 */
  -webkit-box-orient: vertical;
}

.action-wrapper {
  position: absolute;
  right: 0;
  bottom: 0;
  padding-left: 10px; /* 减少渐变区域宽度 */
  background: transparent;
}

.split {
  width: 3px;
  height: 100%;
}

.action {
  padding-left: 3px;
  padding-right: 3px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  background: var(--bg_light);
}

/* 更窄的渐变区域 */
.split::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 15px; /* 缩小渐变宽度 */
  background: v-bind(splitBackground);
}
</style>

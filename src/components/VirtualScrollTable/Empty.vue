<template>
  <div class="empty-placeholder">
    <slot name="empty">
      <div class="empty-content">
        <div v-if="showEmptyImg" class="empty-bg" :class="getTheme()?.includes('dark') ? 'empty-bg-dark' : 'empty-bg-light'"></div>
        <span class="empty-text">暂无数据</span>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { getTheme } from '@/utils/url';
import { computed } from 'vue';

const props = defineProps({
  height: {
    type: Number,
    default: 140
  },
  text: {
    type: String,
    default: '暂无数据'
  },
  showEmptyImg: {
    type: Boolean,
    default: true
  }
});
const heightPX = computed(() => props.height + 'px');
</script>

<style scoped>
.empty-placeholder {
  height: v-bind(heightPX);
  width: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  overflow: hidden;
}

.empty-content {
  pointer-events: auto;
  text-align: center;
}

.empty-bg {
  display: block;
  height: 120px;
  width: 120px;
}

.empty-bg-dark {
  background: url('./images/empty-dark.svg') no-repeat center center;
}

.empty-bg-light {
  background: url('./images/empty-light.svg') no-repeat center center;
}

.empty-text {
  font-size: 14px;
  line-height: 20px;
  color: var(--text_light);
}
</style>

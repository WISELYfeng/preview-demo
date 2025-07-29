<!-- App Layout -->
<template>
  <div v-show="appStore.show && appStore.isVertical !== null" :key="appStore.pageKey" :class="[appStore.isVertical ? 'vertical-wrap' : 'orientation-wrap']">
    <div class="layout-wrapper">
      <header ref="header">
        <slot name="header" />
      </header>
      <main :class="[props.appStore.isVertical === false && 'orientation-main']">
        <van-loading v-if="appStore.pageLoading" type="spinner" size="24px" vertical class="loading-spinner" />
        <slot v-else />
      </main>
    </div>
  </div>
</template>

<script setup lang="js" name="PageLayout">
import { ref, computed } from 'vue';
import { useElementBounding } from '@vueuse/core';

const props = defineProps({
  // 应用store
  appStore: {
    type: Object,
    required: true
  },
  // 是否允许滚动
  scroll: {
    type: Boolean,
    default: true
  }
});

const header = ref(null);

const { height: headerHeight } = useElementBounding(header);

const mainHeight = computed(() => {
  try {
    return `calc(100% - ${headerHeight.value}px)`;
  } catch (err) {
    return '100%';
  }
});

const scrollState = computed(() => {
  return props.scroll ? 'auto' : 'hidden';
});
</script>

<style scoped lang="less">
.vertical-wrap,
.orientation-wrap {
  height: 100%;
  width: 100%;
}

.layout-wrapper {
  width: 100%;
  display: flex;
  height: 100%;
  flex-direction: column;

  header {
    width: 100%;
  }

  main {
    height: v-bind(mainHeight);
    overflow-y: v-bind(scrollState);
    scrollbar-width: none;
    -ms-overflow-style: none;
    background: var(--bg_light);
    width: 100%;

    .loading-spinner {
      margin: auto;
      height: v-bind(mainHeight);
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .orientation-main {
    width: 100%;
    width: calc(100vw - constant(safe-area-inset-left) - constant(safe-area-inset-right));
    width: calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right));
    max-width: 100%;
    margin: 0 auto;
  }
}
</style>

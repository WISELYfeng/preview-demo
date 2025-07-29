<template>
  <Sticky>
    <!-- class="sticky-con"  -->
    <div class="sticky-con" :class="[appStore.isVertical || appStore.isVertical === null ? '' : 'orientation']">
      <!-- 状态栏填充 -->
      <div class="status-bar" :class="['android', 'HarmonyOS'].includes(appStore.osType) ? 'android' : 'ios'" />

      <slot name="diyHeader">
        <!-- 标题栏 -->
        <div class="header-wrap" :style="{ height: titleBarHeight, backgroundColor: backgroundColor }">
          <!-- 左侧 -->
          <div class="header-left" ref="leftRef">
            <x-icon v-if="showBack" @click="goBack" class="back-icon" size="24">
              <x-arrow-left />
            </x-icon>
            <slot name="back-right" />
          </div>

          <!-- 中间标题，根据方向控制布局方式 -->
          <div :class="['header-middle', appStore.isVertical !== false ? 'middle-center' : 'middle-follow']" ref="middleRef">
            <slot name="title">
              <span class="title-text">{{ title || $route.meta.title }}</span>
            </slot>
          </div>

          <!-- 右侧 -->
          <div :class="appStore.isVertical ? 'header-right' : 'header-right-orientation'" ref="rightRef">
            <slot name="help-left" />
            <div class="ml-10 help" v-if="helpPath" @click="goHelp">
              <x-icon v-if="helpIcon === '?'" class="problem" size="24">
                <x-problem />
              </x-icon>
              <template v-else>{{ helpIcon }}</template>
            </div>
          </div>
        </div>
      </slot>
    </div>
  </Sticky>
</template>

<script setup lang="js" name="BaseHeader">
import { ref, computed, onMounted, nextTick, watchEffect, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { setAppBackColor } from '@/utils/native';

const $route = useRoute();
const $router = useRouter();

const props = defineProps({
  appStore: { type: Object, required: true },
  theme: { type: String, default: 'light' },
  verticalTheme: { type: String, default: 'light' },
  statusTheme: { type: String, default: 'default' },
  title: { type: String, default: null },
  helpPath: { type: String, default: null },
  helpIcon: { type: String, default: '?' },
  showBack: { type: Boolean, default: false }
});

const backgroundColor = ref('');
const frontColor = ref('');

const statusBarHeight = computed(() => `${props.appStore.statusHeight || 0}px`);
const titleBarHeight = computed(() => `${props.appStore.titleBarHeight || 44}px`);

const goBack = () => $router.back();
const goHelp = () => {
  $router.push({ path: props.helpPath, query: { ...$route.query } });
};

const headerStyleMap = {
  // bkColor设置客户端头部返回按钮颜色 (type 1:白色-竖屏 0:黑色-横屏)
  light: [
    { bg: 'var(--header-background-0)', color: 'var(--text_deep)', bkColor: 0 },//竖屏
    { bg: 'var(--header-background-0)', color: 'var(--text_deep)', bkColor: 0 }],//横屏
  deep: [
    { bg: 'var(--header-background-1)', color: 'var(--hh_wwgg_deep)', bkColor: 1 },
    { bg: 'var(--header-background-0)', color: 'var(--text_deep)', bkColor: 0 }],
  gradual: [ // 任务中心-home
    { bg: 'var(--header-background-2)', color: 'var(--hh_wwgg_deep)', bkColor: 1 },
    { bg: 'var(--header-background-2)', color: 'var(--hh_wwgg_deep)', bkColor: 1 }],
  prizeDiy1: [ // 任务中心-抽奖页面
    { bg: 'var(--header-background-3)', color: 'var(--hh_wwgg_deep)', bkColor: 1 },
    { bg: 'var(--header-background-4)', color: 'var(--hh_wwgg_deep)', bkColor: 1 }],
};

const setHeaderStyle = () => {
  const { bg, color, bkColor } = props.appStore.isVertical ? headerStyleMap[props.theme][0] : headerStyleMap[props.theme][1];
  backgroundColor.value = bg;
  frontColor.value = color;
  setAppBackColor(bkColor);
};

// 绑定 ref
const leftRef = ref(null);
const rightRef = ref(null);
const middleRef = ref(null);

const updateMiddlePadding = () => {
  nextTick(() => {
    const leftWidth = leftRef.value?.offsetWidth || 0;
    const rightWidth = rightRef.value?.offsetWidth || 0;
    const maxSide = Math.max(leftWidth, rightWidth);

    if (middleRef.value) {
      middleRef.value.style.left = `${maxSide}px`;
      middleRef.value.style.right = `${maxSide}px`;
    }
  });
};
let resizeObserver;
onMounted(() => {
  setHeaderStyle();
  updateMiddlePadding();

  // 监听左右元素宽度变化，动态调整中间标题
  resizeObserver = new ResizeObserver(updateMiddlePadding);
  if (leftRef.value) resizeObserver.observe(leftRef.value);
  if (rightRef.value) resizeObserver.observe(rightRef.value);
});
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
watchEffect(() => {
  if ($route.path !== '/' && typeof props.appStore.isVertical === 'boolean') {
    setHeaderStyle();
  }
});
</script>

<style scoped lang="less">
.sticky-con {
  width: 100%;
  background: v-bind(backgroundColor);
}

.status-bar {
  width: 100%;
  height: v-bind(statusBarHeight);
  background: v-bind(backgroundColor);
  color: transparent;
}

.header-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100vw - constant(safe-area-inset-left) - constant(safe-area-inset-right));
  width: calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right));
  margin: 0 auto;

  .header-left,
  .header-right,
  .header-right-orientation {
    padding: 0 12px;
    display: flex;
    align-items: center;
    min-width: 39px;
    z-index: 1;
    color: v-bind(frontColor);
  }

  .header-left .back-icon {
    font-size: 24px;
    color: v-bind(frontColor);
  }

  // 中间标题 - 竖屏居中，左右动态预留宽度
  .header-middle.middle-center {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // 中间标题 - 横屏顺序跟随
  .header-middle.middle-follow {
    position: static;
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .title-text {
    font-size: 18px;
    line-height: 24px;
    font-weight: 500;
    color: v-bind(frontColor);
  }

  .help .problem {
    font-size: 24px;
  }
}
</style>

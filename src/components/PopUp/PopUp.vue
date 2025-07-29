<template>
  <van-popup v-model:show="showPopup" :close-on-click-overlay="false" :position="drawerDirection" :style="popupStyle" teleport="body" z-index="100000" close-on-popstate @closed="close">
    <div class="diy-pop-container">
      <div class="pop-header">
        <div :style="{ width: '20px' }"></div>
        <span class="text_deep fs-18-24">{{ title }}</span>
        <x-icon size="16" class="text_light" @click="close">
          <x-close-x />
        </x-icon>
      </div>
      <div class="pop-content">
        <slot name="content"></slot>
      </div>
      <div class="pop-footer">
        <div class="btn-group">
          <div class="confirm-btn" @click="confirmCb">{{ confirmText }}</div>
        </div>
        <div class="bottom-safe-height"></div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="js" name="PopUp">
import { ref, computed, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '标题'
  },
  isVertical: {
    type: Boolean,
  },
  show: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '确定'
  }
});

const drawerDirection = computed(() => props.isVertical ? 'bottom' : 'right');
const popupStyle = computed(() => {
    if (props.isVertical) {
        return { height: '360px', width: '100%', overflow: 'hidden' }
    }
    return { height: '100%', width: '400px', overflow: 'hidden' }
});

const showPopup = ref(props.show);
const emits = defineEmits(['update:show', 'confirm']);

const close = () => {
  emits('update:show', false);
}
const confirmCb = () => {
  emits('confirm');
}

watch(
  () => props.show,
  () => {
    showPopup.value = props.show;
  },
  {
    immediate: true
  }
);
</script>

<style scoped lang="less">
.diy-pop-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 10px;
  background: var(--bg_light);
  padding-right: calc(env(safe-area-inset-right) + 10px);
  padding-right: calc(constant(safe-area-inset-right) + 10px);
  .pop-header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .close-x {
      font-size: 20px;
    }
  }
  .pop-content {
    flex: 1;
    overflow: auto;
  }
  .pop-footer {
    padding: 10px 0;
    .btn-group {
      display: flex;
      align-items: center;
      .confirm-btn {
        width: 100%;
        height: 44px;
        line-height: 44px;
        box-sizing: border-box;
        text-align: center;
        border-radius: 6px;
        background: var(--btn_fill_brand);
        font-size: 18px;
        font-weight: 500;
        color: var(--btn_text_on_fill_brand);
      }
    }
    .bottom-safe-height {
      height: env(safe-area-inset-bottom);
      height: constant(safe-area-inset-bottom);
    }
  }
}
</style>

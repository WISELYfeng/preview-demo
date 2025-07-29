<template>
  <div>
    <van-popup
      v-bind:show="popVisible"
      class="industry-picker"
      :class="{ orientation: props.direction === 'right' }"
      :position="direction"
      :lock-scroll="true"
      z-index="99999"
      @click-overlay="closeDrawer"
      :close-on-click-overlay="true"
      :destroy-on-close="true"
      teleport="body"
    >
      <div class="pop-content" v-if="popVisible">
        <div class="drawer-header" v-if="showHeader">
          <div class="drawer-header-left">
            <slot name="header-left"></slot>
          </div>
          <div class="drawer-header-title">
            <slot name="header-title"></slot>
          </div>
          <div class="drawer-header-right">
            <slot name="header-right"></slot>
          </div>
        </div>
        <div class="drawer-content">
          <slot name="content"></slot>
        </div>
        <div id="foot" class="drawer-footer" v-if="showFooter">
          <slot name="footer"></slot>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  popVisible: {
    type: Boolean,
    default: false
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  drawerSize: {
    //组件宽度
    type: String,
    default: '40%'
  },
  direction: {
    type: String,
    default: 'bottom'
  }
});
const popHeight = computed(() => {
  return props.drawerSize;
});
const popWidth = computed(() => {
  return props.direction === 'bottom' ? '100%' : props.drawerSize;
});
const emits = defineEmits(['update:popVisible']);
function closeDrawer() {
  console.log('close');
  emits('update:popVisible');
}
</script>

<style lang="less" scoped>
:deep(.van-popup) {
  height: v-bind(popHeight);
  width: v-bind(popWidth);
  background-color: var(--cell-bg);
}
.drawer-header {
  display: table;
  width: 100%;
  background: var(--bg_content);
  padding: 8px 10px;
  .drawer-header-left {
    display: table-cell;
    width: 50px;
  }
  .drawer-header-title {
    display: table-cell;
    text-align: center;
  }
  .drawer-header-right {
    display: table-cell;
    text-align: right;
    width: 50px;
  }
}

.drawer-content {
  height: fit-content;
  width: 100%;
  background: var(--bg_light);
  padding-top: 10px;
}

.drawer-footer {
  position: fixed;
  width: 100%;
  background: var(--bg_light);
  height: 52px;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 0.5px solid var(--table-border);
}

.industry-picker {
  &.orientation {
    width: 400px;
    background-color: var(--content_bg);
    right: constant(safe-area-inset-right);
    right: env(safe-area-inset-right);
    overflow: visible;
    &::after {
      width: constant(safe-area-inset-right);
      width: env(safe-area-inset-right);
      height: 100%;
      background-color: var(--cell-bg);
      content: '';
      position: absolute;
      top: 0;
      right: calc(0px - constant(safe-area-inset-right));
      right: calc(0px - env(safe-area-inset-right));
    }
    .van-popup--right {
      top: 50%;
      right: 0;
      -webkit-transform: translate3d(0, -50%, 0);
      transform: translate3d(0, -50%, 0);
    }
  }
}
</style>

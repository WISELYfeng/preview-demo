<template>
  <van-dialog
    teleport="body"
    style="overflow: visible; top: 50%"
    :width="width"
    v-model:show="showDialog"
    @close="close"
    :close-on-click-overlay="closeOnClickOverlay"
    :showConfirmButton="false"
    :showCancelButton="false"
    :duration="0"
    z-index="9999"
  >
    <template #title v-if="showHeader">
      <slot name="title">
        <div class="dialog-header">
          <span class="header">{{ title }}</span>
        </div>
      </slot>
    </template>
    <template #default>
      <div :style="showCloseIcon ? { padding: '10px' } : {}" class="dialog-content">
        <div class="content">
          <slot name="default">{{ contentText }}</slot>
        </div>
        <div v-if="showCloseIcon" class="dialog-close" @click="close">
          <x-icon color="var(--white_mid)" size="16">
            <x-close-x />
          </x-icon>
        </div>
      </div>
    </template>
    <template #footer v-if="showFooter">
      <div class="dialog-footer">
        <slot name="footer">
          <div @click="confirm" class="btn-confirm">{{ footerText }}</div>
        </slot>
      </div>
    </template>
  </van-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
/*
 *  使用示例：
 *
 *  <VDialog v-model:show="showDialog" title="这里是标题" contentText="这里是内容" footerText="我知道了">
 *      <template #title>顶部插槽</template>
 *      <template #default>中部插槽</template>
 *      <template #footer>底部插槽</template>
 *  </VDialog>
 *
 *  const showDialog = ref(true);
 * */
const props = defineProps({
  eid: {
    type: String,
    default: 'btt'
  },
  show: {
    type: Boolean,
    default: true
  },
  showHeader: {
    // 是否显示头部
    type: Boolean,
    default: true
  },
  showFooter: {
    // 是否显示底部
    type: Boolean,
    default: true
  },
  showCloseIcon: {
    // 是否显示关闭icon
    type: Boolean,
    default: false
  },
  closeOnClickOverlay: {
    //点击遮罩层是否关闭弹窗
    type: Boolean,
    default: true
  },
  title: {
    //标题文本
    type: String,
    default: ''
  },
  contentText: {
    //弹窗内容
    type: String,
    default: ''
  },
  footerText: {
    //底部按钮文本
    type: String,
    default: '确定'
  },
  width: {
    //宽度，非必传
    type: Number,
    default: 300
  }
});
const showDialog = ref(props.show);
const emit = defineEmits(['update:show', 'confirm']);
watch(
  () => props.show,
  () => {
    showDialog.value = props.show;
  },
  {
    immediate: true
  }
);

const close = () => {
  emit('update:show', false);
};

const confirm = () => {
  emit('confirm');
  close();
};
</script>

<style lang="less" scoped>
.dialog-header {
  display: flex;
  background: var(--bg_pop);
  align-items: center;
  justify-content: center;
  padding: 15px 15px 15px 15px;
  border-radius: 8px;
}

.header {
  color: var(--text_deep);
  font-size: 18px;
  line-height: 25px;
  font-weight: 500;
}

.dialog-content {
  // max-height: 60vh;
  width: 100%;
  background: var(--bg_pop);
  overflow-y: visible;
  padding: 0 15px 15px 15px;
  position: relative;
  border-radius: 8px;
}

.dialog-close {
  position: absolute;
  right: 0;
  top: -33px;
  font-size: 20px;
  // z-index: 9999;
}

.content {
  color: var(--text_deep);
  width: 100%;
  font-size: 15px;
  line-height: 24px;
  word-break: break-all;
  white-space: pre-wrap;
}

.dialog-footer {
  width: 100%;
  background: var(--bg_pop);
  height: 44px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid var(--line_deep);
}

.btn-confirm {
  color: var(--text_brand_deep);
  font-size: 16px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  width: 100%;
  text-align: center;
  cursor: pointer;
}
</style>

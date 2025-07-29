<template>
  <van-overlay v-model:show="showDialog" z-index="9999" teleport="body">
    <div class="wrapper" @click="close">
      <div class="dialog-content" @click.stop>
        <div class="content">
          {{ text }}
        </div>
        <div class="dialog-close" @click.stop="close">
          <svg-icon className="close-icon" name="close-icon" />
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
});
const showDialog = ref(false);
const emit = defineEmits(['update:show']);
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
  showDialog.value = false;
  emit('update:show', false);
};
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.dialog-content {
  width: 300px;
  background: var(--bg_light);
  padding: 10px;
  position: relative;
  z-index: 9999999;
  border-radius: 5px;
}

.dialog-close {
  position: absolute;
  right: 0;
  top: -33px;
  font-size: 20px;
}

.content {
  color: var(--text_deep);
  width: 100%;
  font-size: 15px;
  line-height: 24px;
  word-break: break-all;
  white-space: pre-wrap;
  text-align: justify;
  text-justify: inter-ideograph;
  max-height: 60vh;
  overflow-y: auto;
}
</style>

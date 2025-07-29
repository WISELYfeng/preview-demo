<template>
  <van-sticky :position="position" :offset-top="offsetTop + 1" :offset-bottom="offsetBottom" :z-index="zIndex" :container="container">
    <div style="margin-top: -1px">
      <slot />
    </div>
  </van-sticky>
</template>
<script setup lang="js">
const props = defineProps({
  position: { type: String, default: 'top' },
  offsetTop: { type: Number, default: 0 },
  offsetBottom: { type: Number, default: 0 },
  zIndex: { type: Number, default: 999 },
  container: { type: Element, default: null }
});
</script>

<style scoped lang="less"></style>

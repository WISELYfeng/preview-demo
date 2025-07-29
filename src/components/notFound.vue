<template>
  <VanEmpty style="height: 100%; width: 100%" :image="getTheme().includes('dark') ? emptyDark : Empty" description="请求页面不存在，请返回重试"> </VanEmpty>
</template>

<script setup lang="js">
import { getTheme } from '@/utils/url.js';
import emptyDark from '@/assets/images/empty_dark_2x.png';
import Empty from '@/assets/images/empty_1x.png';
</script>

<style scoped lang="less">
.van-empty {
  height: 80% !important;
  background: var(--bg_light);
}
</style>

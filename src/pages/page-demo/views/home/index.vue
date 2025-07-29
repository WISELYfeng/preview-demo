<template>
  <BaseLayout :app-store="appStore">
    <template #header>
      <BaseHeader :app-store="appStore" title="DEMO" help-icon="" helpPath="help"></BaseHeader>
    </template>
    <div class="home-wrapper">
      测试页
    </div>
  </BaseLayout>
</template>

<script setup name="Home">
import { useRouter } from 'vue-router';
import BaseLayout from '@/frame/BaseLayout.vue';
import { useApp } from '@demo/store/app.js';
import BaseHeader from '@/frame/BaseHeader.vue';

const appStore = useApp();
const $router = useRouter();
</script>

<style lang="less" scoped>
.home-wrapper {
  height: 100%;
  background-color: var(--bg_deep);
  display: flex;
  flex-direction: column;
}
</style>

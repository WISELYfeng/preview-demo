<template>
  <BaseLayout :app-store="appStore">
    <template #header>
      <BaseHeader :app-store="appStore" theme="deep" title="DEMO" help-icon="帮助" helpPath="help"></BaseHeader>
    </template>
    <div class="home-wrapper">
      <button @click="$router.push({ path: '/base-header' })" class="m-5">BaseHeader</button>
      <button @click="$router.push({ path: '/single-table' })" class="m-5">单表格</button>
      <button @click="$router.push({ path: '/double-table' })" class="m-5">双表格</button>
      <button @click="$router.push({ path: '/ellipsis-text' })" class="m-5">文本省略</button>
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

<template>
  <RouterView v-slot="{ Component }">
    <keep-alive :include="cachedViews">
      <component :is="Component" />
    </keep-alive>
  </RouterView>
</template>

<script setup lang="js">
import { onMounted, onUnmounted, computed } from 'vue';
import { useApp } from '@demo/store/app.js';
import { useInitApp } from '@/frame/useInitApp';
import { useCachedViewStoreHook } from '@/frame/useCachedViewStore.js'

const appStore = useApp();
const { mount, unmount } = useInitApp('DXZF', appStore, false);
const cachedViews = computed(() => useCachedViewStoreHook().cachedViewList);

onMounted(async () => {
  mount();
})

onUnmounted(() => {
  unmount();
})
</script>

<style lang="less"></style>

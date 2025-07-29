<template>
  <ResizableLayout :app-store="appStore" help-url="https://kdocs.cn/l/cclFwbbKaMCG">
    <template #left>
      <div class="block">
        <BaseLayout :app-store="appStore">
          <div class="mt-20">【基础用法】</div>
          <div class="block">
            <AppSearch bg-color="var(--btn_fill)" :search-call-back="searchCallBack" searchlimit="AB" />
          </div>
        </BaseLayout>
      </div>
    </template>
  </ResizableLayout>
</template>

<script setup name="AppSearch">
import BaseLayout from '@/frame/BaseLayout.vue';
import { useApp } from '@demo/store/app.js';
import ResizableLayout from '@/components/DemoPlugin/ResizableLayout.vue';
import AppSearch from '@/components/AppSearch/index.vue';

const appStore = useApp();

function searchCallBack() {
  console.log('searchCallBack>>>>>>>>');
}
</script>

<style lang="less" scoped>
.wrap {
  background: var(--bg_deep);
}

.block {
  padding: 10px;
}
</style>

<template>
  <ResizableLayout :app-store="appStore" help-url="https://kdocs.cn/l/ccwRnaSU4buG">
    <template #left>
      <div class="block">
        <BaseLayout :app-store="appStore">
          <template #header>
            <BaseHeader :app-store="appStore" title="文本省略" />
          </template>
          <div>【基础用法】</div>
          <div class="block">
            <EllipsisText :text="testText" />
          </div>
          <div>【设置行数】</div>
          <div class="block">
            <EllipsisText :text="testText" lines="3" />
          </div>
        </BaseLayout>
      </div>
    </template>
  </ResizableLayout>
</template>

<script setup name="EllipsisText">
import BaseLayout from '@/frame/BaseLayout.vue';
import { useApp } from '@demo/store/app.js';
import BaseHeader from '@/frame/BaseHeader.vue';
import ResizableLayout from '@/components/DemoPlugin/ResizableLayout.vue';
import EllipsisText from '@/components/EllipsisText/index.vue';

const appStore = useApp();
const testText = '这是一段超长文本,这是一段超长文本,这是一段超长文本,这是一段超长文本,这是一段超长文本,这是一段超长文本,这是一段超长文本,这是一段超长文本';
</script>

<style lang="less" scoped>
.wrap {
  background: var(--bg_deep);
}

.block {
  padding: 10px;
}
</style>

<template>
  <ResizableLayout :app-store="appStore" help-url="https://kdocs.cn/l/cluiHdzNoHJ9">
    <template #left>
      <div class="mt-20">【基础用法-浅色背景】</div>
      <div class="block">
        <BaseLayout :app-store="appStore">
          <template #header>
            <BaseHeader :app-store="appStore" title="标题" />
          </template>
        </BaseLayout>
      </div>
      <div class="mt-20">【基础用法-深色背景】</div>
      <div class="block">
        <BaseLayout :app-store="appStore">
          <template #header>
            <BaseHeader :app-store="appStore" title="标题" theme="deep" />
          </template>
        </BaseLayout>
      </div>

      <div class="mt-20">【显示返回】</div>
      <div class="block">
        <BaseLayout :app-store="appStore">
          <template #header>
            <BaseHeader :app-store="appStore" title="标题" :show-back="true"></BaseHeader>
          </template>
        </BaseLayout>
      </div>
      <div class="mt-20">【返回右侧插槽】</div>
      <div class="block">
        <BaseLayout :app-store="appStore">
          <template #header>
            <BaseHeader :app-store="appStore" title="标题" :show-back="true">
              <template #back-right>插槽</template>
            </BaseHeader>
          </template>
        </BaseLayout>
      </div>
      <div class="mt-20">【标题位置插槽】</div>
      <div class="block">
        <BaseLayout :app-store="appStore">
          <template #header>
            <BaseHeader :app-store="appStore">
              <template #title>
                <span>自定义标题</span>
                <svg-icon class="problem" name="problem" />
              </template>
            </BaseHeader>
          </template>
        </BaseLayout>
      </div>
      <div class="mt-20">【帮助-?样式】</div>
      <div class="block">
        <BaseLayout :app-store="appStore">
          <template #header>
            <BaseHeader :app-store="appStore" title="标题" help-path="help"></BaseHeader>
          </template>
        </BaseLayout>
      </div>
      <div class="mt-20">【帮助-文本样式】</div>
      <div class="block">
        <BaseLayout :app-store="appStore">
          <template #header>
            <BaseHeader :app-store="appStore" title="标题" help-icon="说明" help-path="help"></BaseHeader>
          </template>
        </BaseLayout>
      </div>
      <div class="mt-20">【帮助-左侧插槽】</div>
      <div class="block">
        <BaseLayout :app-store="appStore">
          <template #header>
            <BaseHeader :app-store="appStore" title="标题" help-path="help">
              <template #help-left>
                <span>插槽</span>
              </template>
            </BaseHeader>
          </template>
        </BaseLayout>
      </div>
      <div class="mt-20">【完全自定义】</div>
      <div class="block">
        <BaseLayout :app-store="appStore">
          <template #header>
            <BaseHeader :app-store="appStore">
              <template #diyHeader>
                <div style="height: 60px; display: flex; justify-content: center; align-items: center">这是一个完全自定义的header</div>
              </template>
            </BaseHeader>
          </template>
        </BaseLayout>
      </div>
    </template>
  </ResizableLayout>
</template>

<script setup name="BaseHeader">
import BaseLayout from '@/frame/BaseLayout.vue';
import { useApp } from '@demo/store/app.js';
import BaseHeader from '@/frame/BaseHeader.vue';
import ResizableLayout from '@/components/DemoPlugin/ResizableLayout.vue';

const appStore = useApp();
</script>

<style lang="less" scoped>
.wrap {
  background: var(--bg_deep);
}

.block {
  padding: 10px;
}
</style>

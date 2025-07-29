<template>
  <ResizableLayout :app-store="appStore">
    <template #left>
      <BaseLayout :app-store="appStore">
        <div class="wrap">
          <div class="icons-grid">
            <van-popover v-model:show="showPopover[name]" v-for="name in iconNames" :key="name">
              <template #reference>
                <div class="block">
                  <div class="icon-con">
                    <svg-icon :name="name" style="height: 100%; width: 100%" @click="iconCopy(name)" />
                  </div>
                  <span>{{ name }}</span>
                </div>
              </template>
              <div style="background: #efefef; padding: 10px">已复制 {{ name }}</div>
            </van-popover>
          </div>
        </div>
      </BaseLayout>
    </template>
  </ResizableLayout>
</template>

<script setup name="Icons">
import BaseLayout from '@/frame/BaseLayout.vue';
import { useApp } from '@demo/store/app.js';
import ResizableLayout from '@/components/DemoPlugin/ResizableLayout.vue';
import { ref } from 'vue';

const showPopover = ref({});
const appStore = useApp();

const iconNames = [
  'arrow-blue',
  'arrow-detail',
  'arrow-down',
  'arrow-left',
  'arrow-rt',
  'arrow-rt-detail',
  'arrow-up',
  'checkbox',
  'checkbox-selected',
  'checkbox-square',
  'checkbox-square-checked',
  'circle-dark',
  'circle-light',
  'close-icon',
  'delete-icon',
  'detail-arrow',
  'error-load',
  'problem',
  'search',
  'sort-desc'
];

const iconCopy = async name => {
  const templateValue = `<svg-icon name="${name}" />`;
  try {
    await navigator.clipboard.writeText(templateValue);
    showPopover.value = { ...showPopover.value, [name]: true };
    setTimeout(() => {
      showPopover.value = { ...showPopover.value, [name]: false };
    }, 1500);
  } catch (err) {
    console.error('复制失败:', err);
  }
};
</script>

<style lang="less" scoped>
.wrap {
  padding: 20px;
  background: var(--bg_deep);
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  width: 100%;
}

.block {
  margin: 0;
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
  }
}

.icon-con {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

span {
  font-size: 12px;
  word-break: break-all;
  text-align: center;
}
</style>

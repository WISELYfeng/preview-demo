<template>
  <ResizableLayout :app-store="appStore" help-url="">
    <template #left>
      <div class="block">
        <BaseLayout :app-store="appStore">
          <div class="mt-20">【基础用法】</div>
          <div class="block">行业筛选组件</div>
          <div class="select-area">
            <div class="trade-btn" @click="openIndustry">
              <div class="fs-14-20 text-btn filter-text">行业</div>
              <div class="icon-box">
                <div class="icon-down"></div>
              </div>
            </div>
          </div>
          <IndustryList :pop-visible="showIndustryPop" @isOpen="setPopVisible"></IndustryList>
        </BaseLayout>
      </div>
    </template>
  </ResizableLayout>
</template>

<script setup name="Industry">
import { ref } from 'vue';
import BaseLayout from '@/frame/BaseLayout.vue';
import { useApp } from '@demo/store/app.js';
import ResizableLayout from '@/components/DemoPlugin/ResizableLayout.vue';
import IndustryList from '@/components/Industry/index.vue';

const appStore = useApp();
const showIndustryPop = ref(false);
function openIndustry() {
  showIndustryPop.value = true;
}
function setPopVisible(type) {
  showIndustryPop.value = type;
}
</script>

<style lang="less" scoped>
.block {
  padding: 10px;
  background-color: var(--bg_light);
}
.select-area {
  background-color: var(--bg_content);
  padding: 10px 0 10px 10px;
}
.trade-btn {
  height: 28px;
  width: 58px;
  display: flex;
  background-color: var(--bg_light);
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  border-radius: 4px;
  position: relative;
  .text-btn {
    text-align: left;
  }
  .icon-box {
    padding-left: 5px;
  }
  .icon-down {
    margin: 0;
    position: unset;
  }
  .check {
    color: var(--text_deep);
  }
}
</style>

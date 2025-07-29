<template>
  <ResizableLayout :app-store="appStore" help-url="https://kdocs.cn/l/chXEpBwfv6NI">
    <template #left>
      <BaseLayout :app-store="appStore">
        <BaseHeader :app-store="appStore" theme="light" help-icon="说明" help-path="page2" />
        <VirtualScrollTable :store="tableAStore" auto-fetch :auto-fetch-fields="autoFetchFields" :app-header-height="appHeaderHeight">
          <!-- 表格上方内容插槽 -->
          <template #before>
            <Sticky :offset-top="appHeaderHeight">
              <div style="height: 30px; background: #7c6c5f; display: flex; justify-content: center; align-items: center">before插槽1</div>
            </Sticky>
            <div style="height: 400px; border: #d88825 1px solid; display: flex; justify-content: center; align-items: center">before插槽2</div>
          </template>

          <!-- ================tableA插槽================ -->
          <!-- 表头插槽 -->
          <template #[`${tableAStore.$id}-header-email`]="{ column }">
            <span :style="{ color: column.id === 'email' ? 'red' : 'black' }">{{ column.title }}</span>
          </template>
          <!-- 单元格插槽-email -->
          <template #[`${tableAStore.$id}-cell-email`]="{ value }">
            <EllipsisText :text="value" :lines="2"></EllipsisText>
          </template>
          <!-- 单元格插槽-balance -->
          <template #[`${tableAStore.$id}-cell-balance`]="{ value }">
            <AutoScaleText>
              <span
                style="font-weight: bold; font-size: 38px; text-align: right"
                :style="{
                  color: value > 500 ? '#ff0000' : value < 500 ? '#025702' : '#000000'
                }"
                >${{ value }}</span
              >
            </AutoScaleText>
          </template>

          <!-- ================表格底部声明插槽================ -->
          <template #disclaimer>
            <Tips />
          </template>
        </VirtualScrollTable>
      </BaseLayout>
    </template>
  </ResizableLayout>
</template>

<script setup lang="js" name="SingleTable">
import BaseLayout from '@/frame/BaseLayout.vue';
import BaseHeader from '@/frame/BaseHeader.vue';
import { useApp } from '@demo/store/app.js';
import { ref, onMounted } from 'vue';
import VirtualScrollTable from '@/components/VirtualScrollTable/index.vue';
import { useTableAStore } from '@demo/store/single-table/tableA';
import AutoScaleText from '@/components/AutoScaleText.vue';//文本自动缩放组件
import EllipsisText from '@/components/EllipsisText/index.vue';//文本省略组件，集成点击详情弹窗
import ResizableLayout from '@/components/DemoPlugin/ResizableLayout.vue';
import Sticky from '@/components/Sticky/index.vue';

const appStore = useApp();
const appHeaderHeight = ref(appStore.headerHeight);
const tableAStore = useTableAStore();
const autoFetchFields = ['extendedField1', 'extendedField2'];//添加扩展字段到表格，值变化时，表格自动请求数据
onMounted(() => {
  tableAStore.fetchData('init')
});
</script>

<style lang="less" scoped>
.wrap {
  background: var(--bg_deep);
}

.block {
  padding: 10px;
}
</style>

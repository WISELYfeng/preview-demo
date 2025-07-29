<template>
  <BaseLayout :app-store="appStore">
    <BaseHeader :appStore="appStore" />
    <VirtualScrollTable
      :store="curStore"
      auto-fetch
      :app-header-height="appHeaderHeight"
      @load-more="loadMore"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      @cell-click="handleCellClick"
      @row-click="handleRowClick"
    >
      <!-- 表格上方内容插槽 -->
      <template #before>
        <van-sticky :offset-top="appHeaderHeight">
          <div style="height: 30px; background: #7c6c5f; display: flex; justify-content: center; align-items: center">before插槽1</div>
        </van-sticky>
        <div style="height: 400px; border: #d88825 1px solid; display: flex; justify-content: center; align-items: center">before插槽2</div>
        <van-sticky :offset-top="appHeaderHeight + 30">
          <van-tabs v-model:active="tabActive">
            <van-tab title="TableA" :name="tableAStore.$id"></van-tab>
            <van-tab title="TableB" :name="tableBStore.$id"></van-tab>
          </van-tabs>
        </van-sticky>
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

      <!-- ================tableA插槽================ -->
      <template #[`${tableBStore.$id}-cell-email`]="{ value }">
        {{ value }}
      </template>
      <!-- 单元格插槽-operate -->
      <template #[`${tableBStore.$id}-cell-operate`]>
        <svg-icon className="text search" name="search" class="fs-15-21" />
      </template>
      <!-- 单元格插槽-balance -->
      <template #[`${tableBStore.$id}-cell-balance`]="{ value }">
        <span style="font-weight: bold; font-size: 28px">${{ value }}</span>
      </template>

      <!-- ================表格底部声明插槽================ -->
      <template #disclaimer>
        <div style="font-size: 12px; color: #7c7c7c">这里是免责声明(如果有)</div>
      </template>
    </VirtualScrollTable>
  </BaseLayout>
</template>

<script setup lang="js" name="DoubleTable">
import BaseLayout from '@/frame/BaseLayout.vue';
import BaseHeader from '@/frame/BaseHeader.vue';
import { useApp } from '@demo/store/app.js';
import { ref, computed } from 'vue';
import VirtualScrollTable from '@/components/VirtualScrollTable/index.vue';
import { useTableAStore } from '@demo/store/double-table/tableA';
import { useTableBStore } from '@demo/store/double-table/tableB';
import AutoScaleText from '@/components/AutoScaleText.vue';
import EllipsisText from '@/components/EllipsisText/index.vue';

const appStore = useApp();
const appHeaderHeight = ref(appStore.headerHeight);
const tableAStore = useTableAStore();
const tableBStore = useTableBStore();
const tabActive = ref(tableAStore.$id);
const curStore = computed(() => {
  return tabActive.value === tableAStore.$id ? tableAStore : tableBStore;
});
const sortChange = () => {
  console.log('排序 auto-fetch模式无需处理', curStore.value.sortInfo);
};
const loadMore = () => {
  console.log('加载更多 auto-fetch模式无需处理', curStore.value.currentPage);
};
const handleSelectionChange = selectedRowKeys => {
  console.log('复选变化', selectedRowKeys);
};
const handleCellClick = value => {
  console.log('单元格点击', value);
};
const handleRowClick = value => {
  console.log('行点击', value);
};
</script>

<style scoped lang="less"></style>

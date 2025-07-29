<template>
  <div class="search-box" @click="submitSearch">
    <div class="icon">
      <svg-icon className="text search" name="search" />
    </div>
    <div class="placeholder fs-14-20">{{ text }}</div>
  </div>
</template>
<script setup>
import { gotoAppSearch } from '@/utils/native';

const props = defineProps({
  bgColor: {
    type: String,
    default: 'var(--bg_deep)'
  },
  text: {
    type: String,
    default: '输入股票名称/代码'
  },
  textColor: {
    type: String,
    default: 'var(--text_exlight)'
  },
  searchlimit: {
    //搜索范围
    type: String,
    default: 'AB',
    required: true
  },
  searchCallBack: {
    //搜索回调
    type: Function,
    required: true
  }
});
const bgColor = props.bgColor;
window.onZnzflagCallback = () => {
  return { searchlimit: props.searchlimit };
};
window.searchCallBack = props.searchCallBack;
const submitSearch = () => {
  gotoAppSearch(props.searchCallBack.name);
};
</script>

<style lang="less" scoped>
.search-box {
  height: 100%;
  width: 100%;
  font-size: 14px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 6px 8px;
  background-color: v-bind(bgColor);

  .icon {
    display: flex;
    margin-right: 5px;

    .text {
      color: v-bind(textColor);
    }
  }

  .placeholder {
    color: v-bind(textColor);
  }
}
</style>

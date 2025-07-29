<script setup>
const props = defineProps({
  bgColor: {
    type: String,
    default: 'var(--cell-bg)'
  },
  text: {
    type: String,
    default: '输入股票名称/代码'
  },
  textColor: {
    type: String,
    default: 'var(--text_color_light)'
  }
});

const emits = defineEmits(['onSearch']);
const bgColor = props.bgColor;
const submitSearch = () => {
  emits('onSearch');
};
</script>

<template>
  <div class="search-box" @click="submitSearch">
    <div class="icon">
      <svg-icon className="text search" name="search" />
    </div>
    <div class="placeholder fs-14-20">{{ text }}</div>
  </div>
</template>

<style lang="less" scoped>
.search-box {
  height: 100%;
  width: 100%;
  font-size: 14px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 5px 8px;
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

<template>
  <!-- 表头复选框 -->
  <th v-if="isHeader" class="checkbox-column">
    <div class="checkbox-wrapper">
      <slot name="header-checkbox">
        <input type="checkbox" :indeterminate="isIndeterminate" :checked="isAllSelected" @change="toggleSelectAll" class="header-checkbox" />
      </slot>
    </div>
  </th>

  <!-- 行复选框 -->
  <td v-else class="checkbox-column">
    <div class="checkbox-wrapper">
      <slot name="cell-checkbox" :row="row">
        <input type="checkbox" :checked="isRowSelected(row)" @change="e => toggleSelectRow(row, e.target.checked)" class="row-checkbox" />
      </slot>
    </div>
  </td>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isHeader: {
    type: Boolean,
    default: false
  },
  row: {
    type: Object,
    default: null
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  selectedRowKeys: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['toggle-select-all', 'toggle-select-row']);

const isAllSelected = computed(() => {
  if (!props.data.length) return false;
  return props.data.every(row => props.selectedRowKeys.includes(row[props.rowKey]));
});

const isIndeterminate = computed(() => {
  return props.selectedRowKeys.length > 0 && !isAllSelected.value;
});

const isRowSelected = row => {
  return props.selectedRowKeys.includes(row[props.rowKey]);
};

const toggleSelectAll = e => {
  emit('toggle-select-all', e.target.checked);
};

const toggleSelectRow = (row, checked) => {
  emit('toggle-select-row', { row, checked });
};
</script>

<style scoped>
.checkbox-column {
  position: sticky;
  left: 0;
  width: 32px;
  box-sizing: border-box;
  height: 100%;
  padding: 0;
  background: var(--bg_light);
  z-index: 2;
}

.checkbox-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.header-checkbox,
.row-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  border: 1px solid var(--text_mid);
  border-radius: 2px;
  position: relative;
  vertical-align: middle;
  display: inline-block;
  background: var(--bg_light);
}

/* 边框底部分割线 */
.checkbox-column::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--line_light);
  transform: scaleY(0.5);
  transform-origin: 0 0;
}

/* 选中状态 */
.header-checkbox:checked,
.row-checkbox:checked {
  background-color: var(--text_brand_deep);
  border-color: var(--text_brand_deep);
}

.header-checkbox:checked::after,
.row-checkbox:checked::after {
  content: '';
  position: absolute;
  top: 35%;
  left: 50%;
  width: 5px;
  height: 8px;
  border: 2px solid var(--btn_text_on_fill_brand);
  border-top: 0;
  border-left: 0;
  transform: translate(-50%, -50%) rotate(45deg);
}

/* 半选状态 */
.header-checkbox:indeterminate {
  background-color: var(--text_brand_deep);
  border-color: var(--text_brand_deep);
}

.header-checkbox:indeterminate::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 2px;
  background: var(--line_light);
  transform: translate(-50%, -50%);
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .checkbox-column::after {
    height: 1px;
    transform: scaleY(0.5);
  }
}
</style>

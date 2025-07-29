<template>
  <div class="v-scroll" ref="containerRef" @scroll.passive="handleVScroll" :key="key">
    <div ref="beforeRef" class="before-slot-wrapper">
      <slot name="before"></slot>
    </div>
    <!-- 固定表头 -->
    <Sticky :offset-top="stickyElementsHeight">
      <div class="h-header-scroll" ref="headerRef" :class="{ 'scroll-header-h': store.data?.length <= 0 }" @scroll.passive="handleHeaderHScroll">
        <!-- 右侧滚动提示标签 -->
        <div class="scroll-right-tag" v-show="showTag && tableWidth > containerWidth">
          <x-icon size="16">
            <x-arrow-rt />
          </x-icon>
        </div>
        <div class="sticky-header-wrapper" :style="{ width: `${tableWidth}px` }">
          <table class="virtual-table">
            <thead>
              <tr>
                <!-- 表头复选框列 -->
                <checkbox-column
                  v-if="store.showCheckbox"
                  :is-header="true"
                  :data="store.data"
                  :selected-row-keys="store.selectedRowKeys"
                  :row-key="store.rowKey"
                  @toggle-select-all="toggleSelectAll"
                />
                <!-- 表头列 -->
                <th
                  v-for="(column, index) in computedColumns"
                  :style="getColumnStyle(column, index)"
                  :key="store.$id + column.id + store.sortField"
                  class="header-cell"
                  :class="{
                    sortable: column.sortable,
                    'sort-active': column.sortable && store.sortField === column.id
                  }"
                  @click="handleSort(column)"
                >
                  <div class="header-cell-wrapper" :style="{ justifyContent: getColumnJustify(column.align) }">
                    <div class="header-cell-content" :style="{ textAlign: column.align }">
                      <slot :name="`${store.$id}-header-${column.id}`" :column="column">
                        {{ column.title }}
                      </slot>
                    </div>
                    <!-- 排序图标 -->
                    <svg-icon v-if="column.sortable && store.sortField === column.id" class="sort-icon" :class="{ desc: store.sortOrder === 1 }" className="sort-desc" name="sort-desc" />
                  </div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </Sticky>
    <!-- 表格主体 -->
    <div class="h-body-scroll" ref="bodyRef" @scroll.passive="handleBodyHScroll">
      <!-- 虚拟滚动内容区 -->
      <div v-if="store.data?.length > 0" class="virtual-content" :style="{ height: `${totalContentHeight}px`, width: `${tableWidth}px`, willChange: 'transform' }">
        <table class="virtual-table">
          <tbody :style="{ transform: `translateY(${startOffset}px)` }">
            <!-- 表格行 -->
            <tr
              v-for="(row, index) in visibleRows"
              :key="store.$id + row[store.rowKey] + index + store.sortField"
              :style="{ height: `${store.rowHeight}px` }"
              :class="{ 'last-row-no-line': store.type === 1 && index === visibleRows.length - 1 }"
              class="row"
              @click="handleRowClick(row, $event)"
            >
              <!-- 行复选框列 -->
              <checkbox-column v-if="store.showCheckbox" :is-header="false" :row="row" :selected-row-keys="store.selectedRowKeys" :row-key="store.rowKey" @toggle-select-row="toggleSelectRow" />
              <!-- 表格单元格 -->
              <td
                v-for="(column, colIndex) in computedColumns"
                class="cell"
                :key="store.$id + row[store.rowKey] + colIndex + store.sortField"
                :style="getColumnStyle(column, colIndex)"
                @click="handleCellClick(row, column, $event)"
              >
                <slot :name="`${store.$id}-cell-${column.id}`" :row="row" :column="column" :value="row[column.id]">
                  <div
                    class="cell-content"
                    :style="{
                      height: `${store.rowHeight}px`,
                      minHeight: `${store.rowHeight}px`,
                      maxHeight: `${store.rowHeight}px`,
                      textAlign: column.align || 'left',
                      color: getCellColor(column.color, row[column.id]),
                      justifyContent: getColumnJustify(column.align)
                    }"
                  >
                    <template v-if="row[column.id] !== null">
                      {{ row[column.id] }}
                    </template>
                    <template v-else>
                      <span style="color: var(--text_light)">--</span>
                    </template>
                  </div>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 空数据占位 -->
      <Empty v-else-if="!store.loading" :height="emptyHeight" :showEmptyImg="store.type !== 1" />
      <!-- 页码 loading出现时隐藏 -->
      <div class="index-container" v-show="store.data?.length > 0 && showFooterIndex && !loadingIsVisible">
        <div class="index">
          <span class="fs-12-17 text_deep">{{ viewEndIndex }}</span
          ><span class="fs-12-17 text_light">/{{ store.total }}</span>
        </div>
      </div>
      <!-- 加载中 -->
      <div class="loading-container" ref="loadingRef" v-show="!noMoreData && store.data?.length > 0">
        <div class="loading"></div>
      </div>
      <!-- 加载结束及声明插槽 -->
      <div class="no-more" v-show="store.type !== 1 && noMoreData && store.data?.length > 0" ref="noMoreRef">
        <div class="no-more-text">已无更多数据~</div>
      </div>
    </div>
    <div ref="disclaimerRef" v-if="store.type !== 1 && noMoreData && store.data?.length > 0">
      <slot name="disclaimer"></slot>
    </div>
  </div>
</template>

<script setup>
import ResizeObserver from 'resize-observer-polyfill';
import 'intersection-observer';
import { ref, computed, watch, shallowRef, onMounted, onUnmounted, nextTick, onActivated, onDeactivated } from 'vue';
import { useDebounceFn, useElementBounding, useIntersectionObserver, useThrottleFn } from '@vueuse/core';
import CheckboxColumn from './CheckboxColumn.vue';
import Empty from '@/components/VirtualScrollTable/Empty.vue';
import { cloneDeep, debounce } from 'lodash-es';
import { getTheme } from '@/utils/url';
import Sticky from '@/components/Sticky/index.vue';
import { red_green_deep } from '@/utils/color';

// 组件属性
const props = defineProps({
  store: { type: Object, required: true, default: () => ({}) },
  autoFetch: { type: Boolean, default: false },
  autoFetchFilters: { type: Array, default: () => [] },
  appHeaderHeight: { type: Number, default: 0 }
});

const emit = defineEmits(['load-more', 'selection-change', 'sort-change', 'row-click', 'cell-click']);

const BUFFER_SIZE = 30; //预加载条数
const TAG_HIDE_OFFSET_LEFT = 20; //小三角消失需要滚动的距离
const CHECKBOX_WIDTH = 32; //复选宽度
const FOOT_INDEX_MISS_TIME = 1000; //页码角标消失时间
const EMPTY_MIN_HEIGHT = 140; //空状态最小高度

// 响应式引用
const key = ref(0);
const containerRef = ref(null);
const beforeRef = ref(null);
const headerRef = ref(null);
const bodyRef = ref(null);
const noMoreRef = ref(null);
const loadingRef = ref(null);
const disclaimerRef = ref(null);

const scrollPositionsCache = ref({});
const scrollTop = shallowRef(0);
const scrollLeft = shallowRef(0);
const isScrolling = shallowRef(false);
const isHScrolling = shallowRef(false);
const showFooterIndex = shallowRef(false);
let loadingIsVisible = false;
const showTag = ref(true);

const isStickySupport = shallowRef(isStickySupported());

// 尺寸相关引用
const containerHeight = shallowRef(0);
const containerWidth = shallowRef(0);
const headerHeight = shallowRef(0);
// const beforeHeight = shallowRef(0);
const { height: beforeHeight } = useElementBounding(beforeRef);
const loadingHeight = shallowRef(0);
const noMoreHeight = shallowRef(0);

const columnStyleCache = new Map();
let scrollTimeout = null;
let resizeObservers = [];

const emptyHeight = computed(() => {
  const height = containerHeight.value - stickyElementsHeight.value - beforeHeight.value - headerHeight.value;
  return Math.max(height, EMPTY_MIN_HEIGHT);
});
const tagBackground = computed(() => {
  return getTheme()?.includes('dark') ? 'linear-gradient(90deg, rgba(28, 28, 28, 0) 0%, #1c1c1c 100%)' : 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #fff 50%)';
});
// 计算属性
const computedColumns = computed(() => {
  if (!containerWidth.value) return [];
  columnStyleCache.clear(); //清除样式缓存
  const leftCols = [];
  const rightCols = [];
  const centerCols = [];
  const checkboxWidth = props.store.showCheckbox ? CHECKBOX_WIDTH : 0;
  const clonedColumns = cloneDeep(props.store.columns);
  clonedColumns.forEach(col => {
    if (col.fixed === 'left') leftCols.push(col);
    else if (col.fixed === 'right') rightCols.push(col);
    else centerCols.push(col);
  });
  // 计算固定列总宽
  const fixedWidth = [...leftCols, ...rightCols].reduce((sum, col) => sum + col.width, 0) + checkboxWidth;
  const dynamicWidth = Math.max(containerWidth.value - 20 - fixedWidth, 0);
  // 分配普通列宽度
  const resultCols = [...leftCols];
  let usedWidth = 0;
  let splitIndex = 0;
  // 找出能完整显示的列
  for (; splitIndex < centerCols.length; splitIndex++) {
    const col = centerCols[splitIndex];
    if (usedWidth + col.width <= dynamicWidth) {
      resultCols.push(col);
      usedWidth += col.width;
    } else {
      break;
    }
  }
  // 如果有剩余空间，平均分配给已显示的列
  const remainingSpace = dynamicWidth - usedWidth;
  if (remainingSpace > 0 && splitIndex > 0) {
    const extra = Math.floor(remainingSpace / splitIndex);
    const remainder = remainingSpace % splitIndex;
    let assigned = 0;

    for (let i = leftCols.length; i < resultCols.length; i++) {
      const add = i - leftCols.length < remainder ? extra + 1 : extra;
      resultCols[i] = {
        ...resultCols[i],
        width: resultCols[i].width + add
      };
      assigned += add;
    }
  }
  resultCols.push(...centerCols.slice(splitIndex));
  resultCols.push(...rightCols);
  return resultCols;
});
const getColumnStyle = (column, colIndex) => {
  const mapKey = props.store.$id + colIndex.toString();
  if (!columnStyleCache.has(mapKey)) {
    const style = {
      width: `${column.width}px`,
      'min-width': `${column.width}px`, // 防止列宽动态变化
      'max-width': `${column.width}px`,
      'padding-left': colIndex === 0 && !(column.fixed && column.align === 'center') ? '0px' : '10px'
    };
    if (column.fixed && isStickySupport.value) {
      style.position = 'sticky';
      style[column.fixed] = column.fixed === 'left' ? getLeftFixedPosition(colIndex) : getRightFixedPosition(colIndex);
      style['z-index'] = '2';
    }
    columnStyleCache.set(mapKey, style);
  }
  return columnStyleCache.get(mapKey);
};
const getCellColor = (type, value) => {
  let color = 'var(--text_deep)'; // 默认黑色

  if (!type) return color;

  if (type === 'link') {
    color = 'var(--link)';
  } else if (type === 'redOrGreen') {
    color = red_green_deep(value);
  }

  return color;
};
const getColumnJustify = align => {
  if (align === 'left') {
    return 'flex-start';
  } else if (align === 'right') {
    return 'flex-end';
  } else {
    return 'center';
  }
};
const viewportBodyHeight = computed(() => {
  return Math.max(0, containerHeight.value - headerHeight.value - beforeHeight.value - noMoreHeight.value);
});
const tableWidth = computed(() => {
  const checkboxWidth = props.store.showCheckbox ? CHECKBOX_WIDTH : 0;
  return computedColumns.value.reduce((sum, col) => sum + col.width, 0) + checkboxWidth + 20;
});
const totalContentHeight = computed(() => {
  return props.store.data?.length * props.store.rowHeight;
});
const pureVisibleRowCount = computed(() => {
  if (!viewportBodyHeight.value || !props.store.rowHeight) return 0;
  return Math.floor(viewportBodyHeight.value / props.store.rowHeight);
});
const visibleRowCount = computed(() => {
  return Math.min(pureVisibleRowCount.value + BUFFER_SIZE * 2, props.store.data?.length);
});
const startIndex = computed(() => {
  const calculatedStart = Math.floor(scrollTop.value / props.store.rowHeight) - BUFFER_SIZE;
  return Math.max(0, calculatedStart);
});
const endIndex = computed(() => {
  return Math.min(startIndex.value + visibleRowCount.value, props.store.data?.length, props.store.total);
});
const startOffset = computed(() => {
  return startIndex.value * props.store.rowHeight;
});
const visibleRows = computed(() => {
  return props.store.data?.slice(startIndex.value, Math.min(endIndex.value, props.store.data?.length));
});
const viewEndIndex = computed(() => {
  const scrollRowIndex = Math.floor(scrollTop.value / props.store.rowHeight);
  const visibleRowCount = Math.ceil(viewportBodyHeight.value / props.store.rowHeight);
  const calculatedEndIndex = scrollRowIndex + visibleRowCount;
  return Math.min(calculatedEndIndex, props.store.data?.length, props.store.total);
});
const scrollToTopOffset = computed(() => beforeHeight.value - stickyElementsHeight.value + props.appHeaderHeight);
const tagHeightPx = computed(() => `${headerHeight.value - 1}px`);
// const showScrollRightTag = computed(() => {
//   return scrollLeft.value <= TAG_HIDE_OFFSET_LEFT && tableWidth.value > containerWidth.value && props.store.data?.length > 0; // 只在有数据时显示
// });
const noMoreData = computed(() => {
  const isNoMore = props.store.data?.length >= props.store.total;
  if (isNoMore) loadingIsVisible = false;
  return isNoMore;
});

function isStickySupported() {
  const el = document.createElement('div');
  const style = el.style;
  style.cssText = 'position:sticky;position:-webkit-sticky';
  return style.position.indexOf('sticky') !== -1;
}

const getLeftFixedPosition = colIndex => {
  let position = props.store.showCheckbox ? CHECKBOX_WIDTH : 0;
  for (let i = 0; i < colIndex; i++) {
    if (computedColumns.value[i].fixed === 'left') {
      position += computedColumns.value[i].width;
    }
  }
  return position + 'px';
};
const getRightFixedPosition = colIndex => {
  let position = 10;
  for (let i = colIndex + 1; i < computedColumns.value.length; i++) {
    if (computedColumns.value[i].fixed === 'right') {
      position += computedColumns.value[i].width;
    }
  }
  return position + 'px';
};

const saveScrollPosition = useDebounceFn(() => {
  scrollPositionsCache.value[props.store.$id] = {
    top: scrollTop.value,
    left: scrollLeft.value
  };
}, 300);

const handleVScroll = useThrottleFn(e => {
  if (isScrolling.value) return;
  showFooterIndex.value = true;
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    showFooterIndex.value = false;
  }, FOOT_INDEX_MISS_TIME);

  isScrolling.value = true;
  requestAnimationFrame(() => {
    scrollTop.value = e.target.scrollTop;
    // saveScrollPosition();
    isScrolling.value = false;
  });
}, 32);
let animationFrameId = null;
const handleBodyHScroll = e => {
  if (!headerRef.value || isHScrolling.value) return;

  isHScrolling.value = true;
  // 取消之前的动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  animationFrameId = requestAnimationFrame(() => {
    headerRef.value.scrollLeft = e.target.scrollLeft;
    scrollLeft.value = e.target.scrollLeft;
    if (scrollLeft.value <= TAG_HIDE_OFFSET_LEFT) showTag.value = false;
    isHScrolling.value = false;
    saveScrollPosition();
  });
};

const handleHeaderHScroll = e => {
  if (isHScrolling.value || props.store.data?.length > 0) return;
  isHScrolling.value = true;
  // 取消之前的动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  animationFrameId = requestAnimationFrame(() => {
    scrollLeft.value = e.target.scrollLeft;
    if (scrollLeft.value <= TAG_HIDE_OFFSET_LEFT) showTag.value = false;
    isHScrolling.value = false;
    saveScrollPosition();
  });
};
const initResizeObservers = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight;
    containerWidth.value = containerRef.value.clientWidth;
  }
  if (headerRef.value) headerHeight.value = headerRef.value.clientHeight;
  if (beforeRef.value) beforeHeight.value = beforeRef.value.clientHeight;
  if (noMoreRef.value) noMoreHeight.value = noMoreRef.value.clientHeight;
  if (loadingRef.value) loadingHeight.value = loadingRef.value.clientHeight;
  const elements = [
    { ref: containerRef, name: 'containerRef', height: containerHeight, width: containerWidth },
    { ref: headerRef, name: 'headerRef', height: headerHeight },
    { ref: beforeRef, name: 'beforeRef', height: beforeHeight },
    { ref: noMoreRef, name: 'noMoreRef', height: noMoreHeight },
    { ref: loadingRef, name: 'loadingRef', height: loadingHeight }
  ];
  elements.forEach(({ ref, name, height, width }) => {
    if (!ref.value) return;
    const observer = new ResizeObserver(entries => {
      if (name === 'beforeRef') calculateStickyHeight();
      const entry = entries[0];
      if (entry) {
        height.value = entry.contentRect.height;
        if (width) width.value = entry.contentRect.width;
      }
    });

    observer.observe(ref.value);
    resizeObservers.push(observer);
  });
};

const stickyElementsHeight = shallowRef(0);
const calculateStickyHeight = () => {
  nextTick(() => {
    requestAnimationFrame(() => {
      if (!beforeRef.value) return;

      const stickyElements = beforeRef.value.querySelectorAll('.van-sticky');
      const totalHeight = Array.from(stickyElements).reduce((sum, el) => {
        return sum + el.getBoundingClientRect().height;
      }, 0);

      stickyElementsHeight.value = totalHeight + (props.appHeaderHeight || 44);
    });
  });
};

const loadMore = () => {
  props.store.setPageNum(props.store.pageNum + 1);
  if (props.autoFetch) props.store.fetchData('loadMore');
  emit('load-more');
};

const handleSort = column => {
  if (!column.sortable) return;
  let newSortInfo;
  if (props.store.sortField === column.id) {
    newSortInfo = {
      sortField: column.id,
      sortOrder: props.store.sortOrder === 0 ? 1 : 0
    };
  } else {
    newSortInfo = {
      sortField: column.id,
      sortOrder: 0
    };
  }
  props.store.setPageNum(1);
  props.store.setSortInfo(newSortInfo);
  if (props.autoFetch) props.store.fetchData('sort');
  emit('sort-change');
  scrollToTop();
};
const handleRowClick = (row, event) => {
  emit('row-click', {
    row,
    event,
    rowKey: props.store.rowKey,
    rowIndex: props.store.data?.findIndex(r => r[props.store.rowKey] === row[props.store.rowKey])
  });
};
const handleCellClick = (row, column, event) => {
  emit('cell-click', {
    row,
    column,
    value: row[column.id],
    event,
    rowKey: props.store.rowKey,
    columnIndex: computedColumns.value.findIndex(col => col.id === column.id),
    rowIndex: props.store.data?.findIndex(r => r[props.store.rowKey] === row[props.store.rowKey])
  });
};
const toggleSelectAll = checked => {
  const newSelectedRows = checked ? [...new Set([...props.store.selectedRowKeys, ...(props.store.data?.map(row => row[props.store.rowKey]) || [])])] : [];
  props.store.setSelectedRowKeys(newSelectedRows);
  emit('selection-change', newSelectedRows);
};
const toggleSelectRow = ({ row, checked }) => {
  const rowKeyValue = row[props.store.rowKey];
  let newSelectedRows;

  if (checked) {
    newSelectedRows = [...props.store.selectedRowKeys];
    if (!newSelectedRows.includes(rowKeyValue)) {
      newSelectedRows.push(rowKeyValue);
    }
  } else {
    newSelectedRows = props.store.selectedRowKeys.filter(id => id !== rowKeyValue);
  }
  props.store.setSelectedRowKeys(newSelectedRows);
  emit('selection-change', newSelectedRows);
};
const scrollTo = ({ top = undefined, left = undefined } = {}) => {
  if (!containerRef.value) return;
  if (top !== undefined) {
    containerRef.value.scrollTop = top;
  }
  if (left !== undefined) {
    bodyRef.value.scrollLeft = left;
  }
};
const scrollToTop = () => {
  setTimeout(() => {
    scrollTo({
      top: Math.min(scrollTop.value, scrollToTopOffset.value)
    });
  }, 10);
};
const scrollPositionToCache = async () => {
  const lastTop = scrollTop.value;
  await nextTick();
  let newTop;
  const savedPosition = scrollPositionsCache.value[props.store.$id];
  if (lastTop < scrollToTopOffset.value) {
    newTop = lastTop;
  } else {
    if (!savedPosition) {
      newTop = Math.min(lastTop, scrollToTopOffset.value);
    } else {
      newTop = Math.max(savedPosition.top, scrollToTopOffset.value);
    }
  }
  scrollTo({
    top: newTop,
    left: savedPosition?.left || 0
  });
};
// 加载更多
useIntersectionObserver(
  loadingRef,
  ([{ isIntersecting }]) => {
    // 添加条件判断，确保只有在未加载完且有数据时才触发加载
    if (isIntersecting && !noMoreData.value && props.store.data?.length > 0 && !props.store.loading) {
      loadingIsVisible = true;
      loadMore();
    } else {
      loadingIsVisible = false;
    }
  },
  {
    threshold: 0.1,
    rootMargin: '10px'
  }
);
// watch( //todo 双表格可能需要开启
//   () => props.store.$id,
//   () => {
//     scrollPositionToCache();
//   },
//   { immediate: true }
// );
watch(
  () => {
    if (!props.autoFetch || !props.autoFetchFilters || !props.store) return null;
    return props.autoFetchFilters.map(field => props.store[field]);
  },
  debounce((newValues, oldValues) => {
    if (!newValues || !oldValues || newValues.length !== oldValues.length) return;

    const hasChanged = newValues.some((val, index) => val !== oldValues[index]);
    if (hasChanged) {
      props.store.fetchData('filter');
      setTimeout(() => {
        scrollToTop();
      }, 10);
    }
  }, 100),
  { deep: true }
);
// 生命周期钩子
onMounted(() => {
  initResizeObservers();
  // calculateStickyHeight();
});
onUnmounted(() => {
  resizeObservers.forEach(observer => observer.disconnect());
  resizeObservers = [];
});
onActivated(() => {
  // 恢复滚动位置
  scrollPositionToCache();
});

onDeactivated(() => {
  // 保存当前滚动位置
  saveScrollPosition();
});
</script>

<style scoped>
.v-scroll {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  background: var(--bg_light);
}

.h-header-scroll {
  width: 100%;
  max-width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  background: var(--bg_light);
  margin-left: 10px;
  position: relative;
}

.scroll-header-h {
  overflow-x: auto;
}

.h-body-scroll {
  width: 100%;
  max-width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  margin-left: 10px;
  position: relative;
}

.v-scroll,
.h-header-scroll,
.h-body-scroll {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: none;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow-scrolling: touch;
}

.v-scroll::-webkit-scrollbar,
.h-header-scroll::-webkit-scrollbar,
.h-body-scroll::-webkit-scrollbar {
  display: none;
}

.before-slot-wrapper {
  will-change: height; /* 提示浏览器优化 */
}

.sticky-header-wrapper {
  width: max-content;
  padding-right: 20px;
  display: flex;
}

.header-cell {
  padding-bottom: 5px;
  padding-top: 5px;
  background: var(--bg_light);
  box-sizing: border-box !important;
  position: relative;
  cursor: pointer;
  width: 100%;
}

.scroll-right-tag {
  position: absolute;
  right: 0;
  z-index: 9999;
  width: 33px;
  height: v-bind(tagHeightPx);
  background: v-bind(tagBackground);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #8e8e8e;
}

.header-cell-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--bg_light);
}

.header-cell-content {
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-word;
  background: var(--bg_light);
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--text_light);
}

.header-cell.sort-active .sort-icon {
  display: inline-block;
}

.sort-icon {
  height: 16px;
  width: 8px;
  color: var(--text_mid);
  margin-left: 2px;
}

.desc {
  transform: rotate(180deg);
}

.virtual-content {
  position: relative;
  padding-right: 20px;
}

.virtual-table {
  border-collapse: separate;
  border-spacing: 0;
}

.cell {
  position: relative;
  background: var(--bg_light);
  box-sizing: border-box !important;
  height: 100%;
  width: 100%;
  max-height: 100%;
}

.cell-content {
  font-size: 15px;
  line-height: 22px;
  font-weight: 400;
  white-space: pre-wrap;
  word-break: break-word;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  font-family: znzNF-medium;
}

.header-cell::after,
.cell::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--line_light);
}

.last-row-no-line .cell::after {
  display: none !important;
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .header-cell::after,
  .cell::after {
    height: 1px;
    transform: scaleY(0.5);
  }
}

.index-container {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 10px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.index-container .index {
  width: fit-content;
  background: var(--bg_deep);
  padding: 2px 10px;
  border-radius: 30px;
  font-size: 10px;
}

.loading-container {
  width: calc(100% - 20px);
  height: 40px;
  position: sticky;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg_light);
}

.loading {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #27272b;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.no-more {
  width: calc(100% - 20px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: sticky;
  left: 0;
  padding-bottom: 10px;
}

.no-more-text {
  margin: 10px;
  font-size: 14px;
  line-height: 20px;
  color: var(--text_light);
}
</style>

<template>
  <drawer-bottom
    :direction="drawerDirection"
    ref="drawerRef"
    label="行业筛选"
    :showheader="true"
    :showFooter="false"
    :pop-visible="popVisible"
    :drawerSize="drawerHeight"
    @update:pop-visible="closeIndustryDrawer"
  >
    <template #header-left></template>
    <template #header-title><span class="fs-18-25 text_deep">行业筛选</span></template>
    <template #header-right>
      <svg-icon className="close-icon" name="close" />
    </template>
    <template #content>
      <div class="con-drawer-content">
        <index-bar
          v-if="tradeList.letters.length > 0"
          :data="tradeList.list"
          :letters="tradeList.letters"
          :active-checkbox="tradeCode"
          :pop-visible="popVisible"
          :is-vertical="appStore.isVertical"
          input-tips="请输入行业名称"
          filter-type="industry"
          @selectCheckbox="updateCode"
          @reset="resetIndustryType"
        ></index-bar>
        <div v-if="tradeList.letters.length === 0 && !props.industryQueryLoading" class="none-box">
          <img v-if="props.theme.includes('light')" src="@/assets/images/empty_1x.png" alt="暂无相关搜索结果" />
          <img v-if="props.theme.includes('dark')" src="@/assets/images/empty_dark_2x.png" alt="暂无相关搜索结果" />
          <p>您的数据正在统计中,请稍后再试</p>
        </div>
      </div>
    </template>
  </drawer-bottom>
</template>

<script setup>
import { ref, computed } from 'vue';
import indexBar from './indexBar.vue';
import DrawerBottom from './/DrawerBottom.vue';
import { useApp } from '@demo/store/app.js';
import tradeList from './tradeList.js';

const props = defineProps({
  popVisible: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: 'light'
  },
  industryQueryLoading: {
    type: Boolean,
    default: false
  }
});

const appStore = useApp();
const drawerDirection = computed(() => {
  return appStore.isVertical ? 'bottom' : 'right';
});
const tradeCode = ref([]);
const drawerHeight = appStore.isVertical ? '80%' : String(document.body.clientHeight).concat('px');

const emits = defineEmits(['updateCode', 'isOpen']);
const updateCode = code => {
  emits('updateCode', code);
  tradeCode.value = code;
  closeIndustryDrawer();
};
function resetIndustryType() {
  closeIndustryDrawer();
}
const closeIndustryDrawer = () => {
  emits('isOpen', false);
};
</script>

<style scoped lang="less">
.con-btn-type {
  display: flex;
  background-color: var(--bg_light);
  height: 28px;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  border-radius: 4px;
  position: relative;
  .text-btn {
    text-align: left;
    width: v-bind(filterTextWidth);
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

.none-box {
  height: 360px;
  text-align: center;
  color: var(--timeline_color);
  img {
    width: 140px;
    margin-top: 85px;
  }
}

.con-btn {
  display: flex;
  align-items: center;
  background-color: var(--bg_light);
  width: 100%;
  border-radius: 4px;
  position: relative;
  padding: 4px;
  height: 28px;
  .text-btn {
    color: var(--text_deep);
  }

  .icon-down {
    line-height: 30px;
    display: table-cell;
  }
}
</style>

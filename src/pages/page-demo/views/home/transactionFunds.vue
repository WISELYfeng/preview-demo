<template>
  <div class="card-container">
    <div class="fund-container">
      <div class="funds-item" @click="setIndicator('总榜成交')" :class="[indicatorType === '总榜成交' && showChart ? 'active' : '']">
        <div class="title fs-15-21">总榜成交</div>
        <div class="amount fs-20-28" :class="setColor(indicatorData.totalNetAmt)">{{ indicatorData.totalAmt ? `${formatNum(indicatorData.totalAmt, 2)}` : '' }}</div>
        <div class="align-item">
          <span class="type fs-10-14" :class="setColor(indicatorData.totalNetAmt)">{{ indicatorData.totalNetAmt >= 0 ? '净买' : '净卖' }}</span>
          <span class="money fs-12-17" :class="setColor(indicatorData.totalNetAmt)">{{ indicatorData.totalNetAmt ? `${formatNum(indicatorData.totalNetAmt, 3)}` : `&nbsp;` }}</span>
        </div>
        <div class="red-border" v-if="indicatorType === '总榜成交' && showChart">
          <img :src="indicatorData.totalNetAmt >= 0 ? redBorder : greenBorder" alt="" />
        </div>
      </div>
      <div class="funds-item" @click="setIndicator('机构成交')" :class="[indicatorType === '机构成交' && showChart ? 'active' : '']">
        <div class="title fs-15-21">机构成交</div>
        <div class="amount fs-20-28" :class="setColor(indicatorData.orgNetAmt)">{{ indicatorData.orgAmt ? `${formatNum(indicatorData.orgAmt, 2)}` : '' }}</div>
        <div class="align-item">
          <span class="type fs-10-14" :class="setColor(indicatorData.orgNetAmt)">{{ indicatorData.orgNetAmt >= 0 ? '净买' : '净卖' }}</span>
          <span class="money fs-12-17" :class="setColor(indicatorData.orgNetAmt)">{{ indicatorData.orgNetAmt ? `${formatNum(indicatorData.orgNetAmt, 3)}` : '' }}</span>
        </div>
        <div class="red-border" v-if="indicatorType === '机构成交' && showChart">
          <img :src="indicatorData.orgNetAmt >= 0 ? redBorder : greenBorder" alt="" />
        </div>
      </div>
    </div>
    <div class="chart-box">
      <div class="chart-item" v-if="showChart">
        <MaskDrop eid="dailyData" v-model:selectIndex="selectedMarket" :drops="marketType" @update:selectIndex="setMarketIndex" width="92px" height="30px" selectBtnAlign="left" />
        <KLine :charts-data="chartData" :data-label="selectedMarket" :data-type="indicatorType"></KLine>
        <div class="chart-tag fs-12-17">净买入</div>
      </div>
      <div class="operate" @click="toggleChart(2)">
        {{ showChart ? '收起' : '展开' }} <span><svg-icon name="arrow-left" class="arrow" :class="showChart ? 'show' : 'hide'" /></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useApp } from '@lhbd/store/modules/app';
import { useHome } from '@lhbd/store/modules/home';
import MaskDrop from '@/components/MaskDrop.vue';
import KLine from './kLine.vue';
import redBorder from '@lhbd/assets/images/red-border.png';
import greenBorder from '@lhbd/assets/images/green-border.png';

const appStore = useApp;
const homeStore = useHome();
const { chooseDate, indicatorData, lastMarketDate, firstMarketDate } = storeToRefs(homeStore);
const showChart = ref(false);
const isPortrait = computed(() => {
  return window.innerHeight > window.innerWidth;
});

const marketType = [
  {
    label: '新涨跌指数',
    index: '新涨跌指数',
    key: '0'
  },
  {
    label: '上证指数',
    index: '上证指数',
    key: '1'
  },
  {
    label: '深证成指',
    index: '深证成指',
    key: '2'
  },
  {
    label: '创业板指',
    index: '创业板指',
    key: '3'
  }
];
const selectedMarket = ref('新涨跌指数');
const indicatorType = ref('总榜成交');
const chartData = computed(() => {
  return homeStore.indicatorChart;
});
const setIndicator = str => {
  if (chooseDate.value) {
    indicatorType.value = str;
    toggleChart(0);
  }
};
const toggleChart = type => {
  if (type === 0) {
    showChart.value = true;
  } else {
    showChart.value = !showChart.value;
  }
};

watch(showChart, v => {
  homeStore.setShowChart(v);
});

const setMarketIndex = index => {
  selectedMarket.value = index;
};
const setColor = num => {
  const parseNum = parseFloat(num);
  if (parseNum > 0) {
    return 'red';
  } else if (parseNum < 0) {
    return 'green';
  } else {
    return 'black';
  }
};
function compareDates(selectedDate) {
  const selectYear = Number(selectedDate.toString().substring(0, 4));
  const selectMonth = Number(selectedDate.toString().substring(4, 6));
  const selectedDay = Number(selectedDate.toString().substring(6, 8));
  const selectDate = new Date(selectYear, selectMonth - 1, selectedDay);
  const lastYear = Number(lastMarketDate.value.toString().substring(0, 4));
  const lastMonth = Number(lastMarketDate.value.toString().substring(4, 6));
  const lastDay = Number(lastMarketDate.value.toString().substring(6, 8));
  const firstYear = Number(firstMarketDate.value.toString().substring(0, 4));
  const firstMonth = Number(firstMarketDate.value.toString().substring(4, 6));
  const firstDay = Number(firstMarketDate.value.toString().substring(6, 8));
  const lastStartDate = new Date(lastYear, lastMonth - 4, lastDay); // 最新交易日往前推三个月
  const lastEndDate = new Date(lastYear, lastMonth - 1, lastDay); // 最新交易日
  const firstStartDate = new Date(firstYear, firstMonth - 1, firstDay); // 最早交易日
  const firstEndDate = new Date(firstYear, firstMonth + 2, firstDay); // 最早交易日往后推三个月
  if (selectDate >= lastStartDate && selectDate <= lastEndDate) {
    return 1;
  }
  if (selectDate > firstEndDate && selectDate < lastStartDate) {
    return 2;
  }
  if (selectDate >= firstStartDate && selectDate <= firstEndDate) {
    return 3;
  }
}

const dateType = computed(() => {
  if (chooseDate.value) {
    return compareDates(chooseDate.value);
  }
  return null;
});

function formatNum(num, digit) {
  if (num === null || num === 0 || String(num) === '--' || String(num) === 'NaN' || String(num) === 'undefined') {
    return '';
  }
  const number = Math.abs(num);
  if (number <= 10000) {
    return String(number.toFixed(digit));
  } else if (number > 10000 && number < 100000000) {
    return String((number / 10000).toFixed(digit)) + '万';
  } else if (number >= 100000000) {
    return String((number / 100000000).toFixed(digit)) + '亿';
  }
}

watch(
  () => [dateType.value, chooseDate.value],
  (newVal, oldVal) => {
    if (newVal[0] !== oldVal[0] && oldVal[0] !== null) {
      // 当dateType变化，比如时间的改变属于不同的时间段规则，则重新请求数据
      homeStore.getTrendData({
        dealType: indicatorType.value,
        indexType: selectedMarket.value,
        date: chooseDate.value
      });
    }
    if (newVal[1] && dateType.value === 2) {
      // 当时间段为近3个月-9个月时，请求数据
      homeStore.getTrendData({
        dealType: indicatorType.value,
        indexType: selectedMarket.value,
        date: chooseDate.value
      });
    }
  }
);

watch(
  () => [selectedMarket.value, indicatorType.value, chooseDate.value],
  (newVal, oldVal) => {
    if (newVal[0] !== oldVal[0] || chooseDate.value) {
      homeStore.getIndicator({
        date: chooseDate.value
      });
    }
    if (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1]) {
      homeStore.getTrendData({
        dealType: indicatorType.value,
        indexType: selectedMarket.value,
        date: chooseDate.value
      });
    }
  }
);
watch(
  () => lastMarketDate.value,
  newVal => {
    if (newVal) {
      homeStore.getTrendData({
        dealType: indicatorType.value,
        indexType: selectedMarket.value,
        date: lastMarketDate.value
      });
    }
  }
);
onMounted(() => {
  showChart.value = !isPortrait.value; // 横屏时默认显示
  console.log('isVertical', appStore.isVertical);
});
</script>

<style scoped lang="less">
.card-container {
  width: 100%;
  //height: v-bind(fundsBoxHeight);
  height: auto;
  padding-bottom: 10px;
  background-color: var(--content-bg);
  //-webkit-overflow-scrolling: touch;
  //overscroll-behavior: none;
  //&.scroll {
  //  overflow: scroll;
  //}
}
.fund-container {
  width: auto;
  padding: 10px 10px 10px 0;
  display: flex;
  .funds-item {
    min-height: 86px;
    width: 50%;
    //flex: 0 0 calc(50% - 5px);
    background-color: var(--cell-bg);
    text-align: center;
    padding: 10px;
    margin-left: 10px;
    border-radius: 4px;
    position: relative;
    .amount {
      min-height: 28px;
    }
    .red-border,
    .green-border {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      img {
        width: 100%;
        height: 93px;
        //height: 100%;
        //object-fit: fill;
      }
    }
    .red {
      color: #f70512;
    }
    .green {
      color: #009a00;
    }
    .title {
      color: var(--text_color);
    }
    .align-item {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .type {
      padding: 0 3px;
      border-radius: 2px;
      margin-right: 3px;
      &.red {
        background-color: rgba(247, 5, 18, 0.1);
      }
      &.green {
        background-color: rgba(0, 154, 0, 0.13);
      }
    }
  }
}
.chart-box {
  .operate {
    text-align: center;
    color: var(--text_color_lighter);
    margin-top: 5px;
    .show {
      transform: rotate(90deg);
    }
    .hide {
      transform: rotate(270deg);
    }
  }
  .chart-item {
    padding: 0 10px;
    position: relative;
    .chart-tag {
      color: var(--text_color_light);
      background-color: var(--cell-bg);
      border: 0.5px solid var(--border-top);
      border-radius: 2px;
      padding: 1px 5px;
      position: absolute;
      bottom: 62px;
    }
  }
}
.fs-10-14 {
  font-size: 10px;
  line-height: 14px;
}
.fs-20-28 {
  font-size: 20px;
  line-height: 28px;
}
:deep(.con-btn) {
  border: none;
}
</style>

<template>
  <div class="time-box" :style="{ width: width + 'px' }">
    <span v-if="pickerLeftUsable" @click="dateAddAndSub('prev')" class="left" :class="props.appStore.isDark ? 'icon-picker-dark' : 'icon-picker'"> </span>
    <span v-if="!pickerLeftUsable" class="icon-picker-disable left"></span>
    <div @click="conBtnClick" class="time-text">
      <div class="con-btn-type text_deep" :class="{ disabled: props.disable }">
        <span v-if="props.dateString">{{ `${props.dateString.slice(0, 4)}-${props.dateString.slice(4, 6)}-${props.dateString.slice(6, 8)}` }}</span>
        <span v-else class="disabled">--</span>
      </div>
    </div>
    <span v-if="pickerRightUsable" @click="dateAddAndSub('next')" class="right" :class="props.appStore.isDark ? 'icon-picker-dark' : 'icon-picker'"> </span>
    <span v-if="!pickerRightUsable" class="icon-picker-disable right"> </span>
  </div>
  <van-popup
    z-index="9999"
    v-model:show="show"
    :position="direction"
    class="date-picker"
    :class="{ orientation: direction === 'right' }"
    @click-overlay="cancelClick"
    teleport="body"
    @close="closeModal"
  >
    <div class="drawer-header">
      <div class="drawer-header-left text_mid" @click="cancelClick">取消</div>
      <div class="drawer-header-title text_deep">日期选择</div>
      <div class="drawer-header-right" @click="confirmDate">确认</div>
    </div>
    <div class="right-box">
      <div class="choose">
        <div class="middle-box">
          <!--          <div v-if="direction === 'right'" class="text">当前选中日期</div>-->
          <div class="time">{{ currentDate[0] }}年{{ currentDate[1] }}月{{ currentDate[2] }}日</div>
        </div>
      </div>
      <div class="picker-box" :key="popupKey">
        <van-date-picker v-model="currentDate" title="选择年月" :show-toolbar="false" :min-date="minDate" :max-date="maxDate" :columns-type="props.columnsType" :filter="filter"> </van-date-picker>
        <div class="choose-time item-1"></div>
        <div class="choose-time item-2"></div>
        <div class="choose-time item-3"></div>
      </div>
    </div>
    <div class="safe-right"></div>
  </van-popup>
</template>
<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  dateString: {
    type: String,
    default: '20240312',
    required: true
  },
  appStore: {
    type: Object,
    default: () => {},
    required: true
  },
  width: {
    type: [Number, String],
    default: 200
  },
  columnsType: {
    type: Array,
    default: () => ['year', 'month', 'day']
  },
  marketRange: {
    type: Array,
    default: () => [],
    required: true
  },
  disable: {
    type: Boolean,
    default: false
  }
});
const show = ref(false);
let popupKey = ref(0);
let currentDate = ref(null);
const direction = computed(() => (props.appStore.isVertical ? 'bottom' : 'right'));

const emit = defineEmits(['updateDate']);

const minDate = computed(() => {
  const minDateString = String(props.marketRange[props.marketRange.length - 1]);
  return new Date(minDateString.substring(0, 4), minDateString.substring(4, 6) - 1, minDateString.substring(6, 8));
});

const maxDate = computed(() => {
  const maxDateString = String(props.marketRange[0]);
  return new Date(maxDateString.substring(0, 4), maxDateString.substring(4, 6) - 1, maxDateString.substring(6, 8));
});
const pickerLeftUsable = computed(() => {
  if (props.disable) return false;
  const dateNum = Number(props.dateString);
  const minDate = props.marketRange[props.marketRange.length - 1];
  return dateNum > minDate;
});
const pickerRightUsable = computed(() => {
  if (props.disable) return false;
  const dateNum = Number(props.dateString);
  const maxDate = props.marketRange[0];
  return dateNum < maxDate;
});

function confirmDate() {
  const _newDate = currentDate.value.join('');
  show.value = false;
  emit('updateDate', { date: _newDate + '', scroll: true });
}

function dateAddAndSub(type) {
  if (props.disable) return;
  let index = props.marketRange.indexOf(Number(props.dateString));
  let _newDate = props.dateString;
  switch (type) {
    case 'next':
      index--;
      _newDate = props.marketRange[index];
      if (index <= 0) {
        break;
      }
      break;
    case 'prev':
      index++;
      _newDate = props.marketRange[index];
      if (index >= props.marketRange.length - 1) {
        break;
      }
      break;
  }

  emit('updateDate', {
    date: _newDate + '',
    scroll: false
  });
}

const conBtnClick = () => {
  if (props.disable) return;
  show.value = true;
};

const filter = (type, options) => {
  if (type === 'day') {
    let filterDay = [];
    props.marketRange.map(item => {
      const date = item.toString();
      const year = date.slice(0, 4);
      const month = date.slice(4, 6);
      const day = date.slice(6, 8);
      if (year == currentDate.value[0]) if (month == currentDate.value[1]) filterDay.push(day);
      // console.log('filterDay', filterDay);
    });
    return options.filter(option => filterDay.includes(option.value));
  }
  if (type === 'month') {
    let filterMonth = [];
    props.marketRange.map(item => {
      const date = item.toString();
      const year = date.slice(0, 4);
      const month = date.slice(4, 6);
      if (year == currentDate.value[0]) if (!filterMonth.includes(month)) filterMonth.push(month);
      // console.log('filterMonth', filterMonth);
    });
    return options.filter(option => filterMonth.includes(option.value));
  }
  if (type === 'year') {
    let filterYear = [];
    props.marketRange.map(item => {
      const date = item.toString();
      const year = date.slice(0, 4);
      if (!filterYear.includes(year)) filterYear.push(year);
      // console.log('filterYear', filterYear);
    });
    // console.log('options', options);
    return options.filter(option => filterYear.includes(option.value));
  }

  return options;
};

const cancelClick = () => {
  show.value = false;
  setTimeout(() => {
    const date = props.dateString.toString();
    currentDate.value = [date.slice(0, 4), date.slice(4, 6), date.slice(6, 8)];
  }, 200);
};

const closeModal = () => {
  popupKey.value = popupKey.value + 1;
};

watch(
  () => props.dateString,
  newVal => {
    if (newVal) {
      const date = newVal.toString();
      currentDate.value = [date.slice(0, 4), date.slice(4, 6), date.slice(6, 8)];
    }
  },
  { immediate: true }
);

watch(
  () => show.value,
  newVal => {
    if (show.value) {
      nextTick(() => {
        const wrapper = document.getElementsByClassName('van-popup')[0];
        const dom = document.getElementsByClassName('van-picker-column__item--selected')[0];
        const position = dom.getBoundingClientRect();
        let bottom = 0;
        if (document.body.clientWidth > document.body.clientHeight) {
          bottom = position.bottom - (document.body.clientHeight - wrapper.clientHeight);
        } else {
          bottom = position.bottom - document.body.clientHeight;
        }

        const pickBorderList = document.getElementsByClassName('choose-time');
        for (let i = 0; i < pickBorderList.length; i++) {
          pickBorderList[i].style.top = bottom + 'px';
        }
      });
    }
  }
);
onUnmounted(() => {
  show.value = false;
});
</script>

<style scoped lang="less">
.time-box {
  height: 32px;
  background-color: var(--bg_light);
  border-radius: 4px;
  display: flex;
  overflow: hidden;
  .time-text {
    width: 100%;
  }
  .con-btn-type {
    height: 100%;
    width: 100%;
    font-size: 14px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &.disabled {
      opacity: 0.5;
    }
    .disabled {
      margin-left: calc(50% - 12px);
    }
  }
}

.drawer-header {
  display: table;
  width: 100%;
  padding: 10px;
  background-color: var(--bg_light);
  .drawer-header-left {
    display: table-cell;
    width: 50px;
    font-size: 16px;
  }

  .drawer-header-title {
    height: 24px;
    font-size: 18px;
    display: table-cell;
    text-align: center;
  }

  .drawer-header-right {
    font-size: 16px;
    color: var(--text_brand_deep);
    display: table-cell;
    text-align: right;
    width: 50px;
  }
}
.right-box {
  background-color: var(--bg_light);
}
.choose {
  width: 100%;
  background-color: var(--bg_light);
  padding: 15px 10px;
  .text {
    font-size: 14px;
  }
  .time {
    height: 36px;
    color: var(--text_brand_deep);
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid var(--btn_fill_brand);
  }
}

.choose-time {
  height: 1px;
  width: 25%;
  background-color: var(--text_brand_deep);
  position: absolute;
}
.item-1 {
  left: 4.5%;
}
.item-2 {
  left: 38%;
}
.item-3 {
  left: 71.5%;
}

.icon-picker,
.icon-picker-dark,
.icon-picker-disable {
  width: 32px;
  height: 100%;
  flex-shrink: 0;
}

:deep(.van-picker) {
  background-color: var(--bg_content);
  height: 100%;
}

:deep(.van-picker-column__item) {
  color: var(--text_deep);
}

:deep(.van-picker-column__item--selected) {
  color: var(--text_deep);
  font-weight: 500;
  font-size: 18px;
}

:deep(.van-picker__mask) {
  height: 0;
}

:deep(.van-hairline-unset--top-bottom:before) {
  height: 0;
}

:deep(.van-hairline-unset--top-bottom:after) {
  height: 0;
  border-width: 0;
}

:deep(.van-dialog .van-dialog__message) {
  color: red;
  font-weight: bold !important;
  font-size: 16px !important;
}
:deep(.van-overlay) {
  height: 110%;
}

.date-picker {
  &.orientation {
    width: 400px;
    right: 0;
    right: constant(safe-area-inset-right);
    right: env(safe-area-inset-right);
    overflow: visible;
    height: 100%;
    //&::after {
    //  width: calc(constant(safe-area-inset-right) + 1px);
    //  width: calc(env(safe-area-inset-right) + 1px);
    //  height: 100%;
    //  background-color: var(--bg_light);
    //  content: '';
    //  position: absolute;
    //  top: 0;
    //  right: calc(0 - constant(safe-area-inset-right));
    //  right: calc(0 - env(safe-area-inset-right));
    //}
    .safe-right {
      width: calc(constant(safe-area-inset-right) + 1px);
      width: calc(env(safe-area-inset-right) + 1px);
      height: 100%;
      background-color: var(--bg_light);
      position: absolute;
      top: 0;
      right: calc(0px - constant(safe-area-inset-right));
      right: calc(0px - env(safe-area-inset-right));
    }
    .right-box {
      height: calc(100% - 40px);
      .picker-box {
        height: calc(100% - 91px);
      }
    }
    .van-popup--right {
      top: 50%;
      right: 0;
      -webkit-transform: translate3d(0, -50%, 0);
      transform: translate3d(0, -50%, 0);
    }
    .text {
      width: 100%;
      min-width: 84px;
      color: #9e9e9e;
      margin-bottom: 5px;
    }
    .time {
      width: 100%;
      max-width: 100%;
    }
  }
}
.left,
.right {
  position: relative;
  &::before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
    content: '';
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 6.5px solid var(--text_mid);
    border-radius: 3px;
  }
  &::after {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    content: '';
    width: 1px;
    height: 16px;
    background-color: var(--btn_outline);
  }
}
.left {
  &::before {
    transform: translate(-50%, -50%) rotate(-90deg);
  }
  &::after {
    right: 0;
  }
}
.right {
  &::before {
    transform: translate(-50%, -50%) rotate(90deg);
  }
  &::after {
    left: 0;
  }
}
.icon-picker-disable {
  &::before {
    opacity: 0.3;
  }
}
</style>

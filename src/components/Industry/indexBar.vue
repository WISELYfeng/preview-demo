<template>
  <div class="search-box" ref="searchBox">
    <van-field v-model="inputText" class="w-50 m-2 search-input" :placeholder="props.inputTips" :left-icon="searchIcon" style="margin: 0" @update:model-value="toListItem">
      <template #right-icon>
        <svg-icon v-show="theme.includes('light') && inputText" @click="clearInput" className="clear" name="clear" />
        <svg-icon v-show="theme.includes('dark') && inputText" @click="clearInput" className="clear" name="clear-dark" />
      </template>
    </van-field>
  </div>
  <div class="select-box" v-show="isIndexBarVisible && letterList.length > 0">
    <p style="display: none">{{ y }} {{ activeIndex }} {{ isScroll }} {{ isIndexBarVisible }}</p>
    <div class="data-box" ref="myIndustry">
      <ul class="list-box">
        <li class="list" v-for="(i, idx) in letterList" :key="idx">
          <div>
            <p class="anchor">{{ i }}</p>
            <div v-for="k in itemList[i]" :key="k.code" style="position: relative; margin-bottom: 18px">
              <!--              <svg-icon v-if="k.type === 'checkbox' && !checkedArr.includes(k.label)" name="checkbox-square" />-->
              <!--              <svg-icon v-if="k.type === 'checkbox' && checkedArr.includes(k.label)" name="checkbox-square-checked" />-->
              <!--              <span v-if="k.type === 'radio'" :class="checkedValue === k.code ? 'icon-radio-selected' : 'icon-radio'" class="mr-10"></span>-->
              <!--              <input v-if="k.type === 'radio'" type="radio" name="industry" :id="k.code" :value="k.code" v-model="checkedValue" />-->
              <!--              <label v-if="k.type === 'radio'" :for="k.code" @click="setName(k.label)">{{ k.label }} {{ k.codeText }}</label>-->
              <span v-if="k.type === 'checkbox'" :class="[theme.includes('light') ? 'light' : 'dark', checkedArr.includes(k.code) ? 'icon-checkbox-selected' : 'icon-checkbox']"></span>
              <input v-if="k.type === 'checkbox'" type="checkbox" :name="k.label" :id="k.code" :value="k.code" v-model="checkedArr" />
              <label v-if="k.type === 'checkbox'" :for="k.code">{{ k.label }} {{ k.codeText }}</label>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="letter-wrapper" ref="sideIndex" @touchstart="handleTouch(1, $event)" @touchmove="handleTouch(2, $event)" @touchend="handleTouch(3, $event)">
      <div class="letter-box" ref="sideBar">
        <ul class="letter-list">
          <li v-for="(i, index) in letterList" :key="index" class="side-item">
            <div class="letter-item" :class="{ active: activeIndex === index }">
              {{ i }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-show="sideScrolling" class="bubble-box" ref="sideBubble">
      <span class="bubble"> {{ letterList[activeIndex] }}</span>
    </div>
  </div>
  <div v-if="!isIndexBarVisible" class="none-box">
    <img v-if="theme.includes('dark')" src="@/assets/images/empty_dark_2x.png" alt="暂无相关搜索结果" />
    <img v-if="theme.includes('light')" src="@/assets/images/empty_1x.png" alt="暂无相关搜索结果" />
    <p>暂无相关搜索结果</p>
  </div>
  <div class="footer-box" ref="footerBox">
    <div class="con-drawer-footer">
      <div class="con-restore text_color_light fs-16-22" @click="retSetTypes()">恢复默认</div>
      <div class="con-confirm fs-16-22 ml-8" @click="confirmTypes()">确认</div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useScroll } from '@vueuse/core';
import lightIcon from '@/assets/images/search.png';
import darkIcon from '@/assets/images/search-dark.png';

const props = defineProps({
  inputTips: {
    type: String,
    default: ''
  },
  letters: {
    type: Array,
    default: () => []
  },
  data: {
    type: Object,
    default: () => {}
  },
  activeRadio: {
    // 已选的行业
    type: String,
    default: ''
  },
  activeCheckbox: {
    // 已选的checkbox
    type: Array,
    default: () => []
  },
  filterType: {
    type: String,
    default: 'industry'
  },
  popVisible: {
    type: Boolean,
    default: false
  },
  isVertical: {
    type: Boolean,
    default: true
  }
});

const myIndustry = ref(null);
const sideIndex = ref(null);
const sideBar = ref(null);
const { x, y } = useScroll(myIndustry);
let activeIndex = ref(0); // 被激活的索引序号
let inputText = ref('');
let anchorCoordinate = []; // 记录选项锚点坐标
let sideIndexCoordinate = []; // 记录侧边栏描点坐标
let checkedValue = ref(''); // 选中的radio
let checkedArr = ref([]); // 选中的checkbox
let checkName = ref(''); // 选中的行业名称
let isScroll = ref(false);
let sideScrolling = ref(false); // 侧边栏滑动状态
let isClickSide = ref(false); // 点击侧边栏跳转标志
let isIndexBarVisible = ref(true);

// 选项和侧边导航的最大高度
// let sideHeight = ref('0');
// let selectHeight = ref('0');
const sideDistance = !props.isVertical ? 10 + 'px' : 6 + 'px';
const theme = document.documentElement.getAttribute('theme');
const bubbleOpacity = theme.includes('light') ? 0.5 : 0.8;
const searchIcon = computed(() => {
  return theme.includes('light') ? lightIcon : darkIcon;
});
// 底部按钮
let drawerWidth = props.isVertical ? document.body.clientWidth : document.body.clientHeight;
let btnRestoreWidth = String((drawerWidth - 36) / 3) + 'px';
let btnConfirmWidth = String(((drawerWidth - 36) / 3) * 2 + 8) + 'px';
// let btnPaddingBottom = ref('0');

let letterList = ref([]); // 索引列表
let itemList = ref({}); // 选项列表
let inputSearch = ref(false); // 搜索匹配状态

const searchBox = ref(null);
const footerBox = ref(null);
/* 更新描点坐标 */
function setAnchor() {
  const anchorList = document.querySelectorAll('.anchor');
  anchorCoordinate = [];
  sideIndexCoordinate = [];
  anchorList.forEach((item, index) => {
    anchorCoordinate.push({
      anchor: letterList.value[index],
      top: item.offsetTop
    });
  });
  const indexList = document.querySelectorAll('.side-item');
  indexList.forEach((item, index) => {
    sideIndexCoordinate.push({
      anchor: letterList.value[index],
      top: item.offsetTop
    });
  });
}

const selectHeight = computed(() => {
  if (!props.isVertical) {
    return document.body.clientHeight - 160 + 'px'; // 选项区域，剪掉的部分是其它元素margin高度
  } else {
    // 真机上需要的高度是数据数组的长度+1，真机的像素和模拟器不一致
    return document.body.clientHeight * 0.8 - 170 + 'px';
  }
});
const sideHeight = computed(() => {
  if (!props.isVertical) {
    return 14 * 5 + 'px'; // 选项区域，剪掉的部分是其它元素margin高度
  } else {
    // 真机上需要的高度是数据数组的长度+1，真机的像素和模拟器不一致
    const footerHeight = footerBox.value.getBoundingClientRect().height;
    return document.body.clientHeight * 0.8 - 128 - footerHeight + 'px';
  }
});
const btnPaddingBottom = computed(() => {
  if (!props.isVertical) {
    return '15px';
  } else {
    return '25px';
  }
});

function scrollTo(index) {
  nextTick(() => {
    myIndustry.value.scrollTo({
      top: anchorCoordinate[index].top - 100,
      behavior: 'smooth'
    });
    isClickSide.value = false;
  });
}

// 滚动处理
function handleScroll() {
  isScroll.value = true;
  const scrollTop = myIndustry.value.scrollTop + 30; // 30是偏移量，不加时表示元素滚动到滚动区左上角才改变当前索引，偏移量越大则改变索引的区域越靠下
  for (let i = 0; i < anchorCoordinate.length; i++) {
    // 需要加偏移量，偏移量为距顶部的距离（用body还是别的元素取决有没有设置position)
    if (scrollTop >= anchorCoordinate[i].top) {
      activeIndex.value = i;
    }
  }
}

function setName(name) {
  checkName.value = name;
}

onMounted(() => {
  checkedValue.value = props.activeRadio;
  checkedArr.value = props.activeCheckbox;
  myIndustry.value.addEventListener('scroll', handleScroll);
  letterList.value = props.letters;
  itemList.value = props.data;
  isIndexBarVisible.value = letterList.value.length > 0;
  setTimeout(() => {
    setAnchor();
  }, 100);
});

watch(
  () => props.popVisible,
  () => {
    // 当弹窗的可见状态改变时，更新选中的radio
    checkedValue.value = props.activeRadio;
    clearInput();
  }
);

/** 监听索引栏中手指所处位置 **/
let touchSideIndex = ref(0);

function handleTouch(str, e) {
  if (str === 1 || str === 2) {
    isScroll.value = true;
    sideScrolling.value = true;
    const touch = e.touches[0];
    const targetElement = sideIndex.value;
    const rect = targetElement.getBoundingClientRect();
    setLetterScrollTop(touch.pageY - rect.top);
    const positionY = touch.pageY;
    const headHeight = document.querySelector('.drawer-header').offsetHeight;
    const searchHeight = document.querySelector('.search-box').offsetHeight;
    const selectHeight = document.querySelector('.select-box').offsetHeight;
    const basicOffset = headHeight + searchHeight + 20 + (selectHeight - 70) / 2; // 手指点击有效范围值起点
    const maxOffset = basicOffset + 70; // 手指点击范围有效值终点
    const validOffset = []; // 有效值数组
    let scrolledIndexNum = sideBar.value.scrollTop / 14; // 已经滚动的索引个数
    let touchedIndex = 0; // 当前点击的索引
    for (let i = 0; i < 5; i++) {
      validOffset[i] = basicOffset + 14 * (i + 1);
    }
    if (positionY >= basicOffset && positionY <= maxOffset) {
      for (let i = 0; i < 5; i++) {
        if (positionY >= validOffset[i] && positionY <= validOffset[i + 1]) {
          touchedIndex = i + 1;
        }
      }
    }
    touchSideIndex.value = Math.round(scrolledIndexNum + 0.3) + touchedIndex;
  }
  if (str === 3) {
    isScroll.value = false;
    sideScrolling.value = false;
  }
}

/* 计算手指落点对应的索引位置 */
function setLetterScrollTop(touchValue) {
  const isVertical = document.body.clientHeight > document.body.clientWidth;
  if (isVertical) {
    const yValue = touchValue;
    const len = sideIndexCoordinate.length;
    let index = 0;
    for (let i = 0; i < len; i++) {
      if (yValue > sideIndexCoordinate[len - 1].top) {
        index = len - 1;
        break;
      }
      if (sideIndexCoordinate[i].top <= yValue && yValue < sideIndexCoordinate[i + 1].top) {
        index = i;
        break;
      }
    }
    myIndustry.value.scrollTop = anchorCoordinate[index].top;
  } else {
    myIndustry.value.scrollTop = anchorCoordinate[touchSideIndex.value].top;
  }
}

function clearInput() {
  inputText.value = '';
  inputSearch.value = false;
  letterList.value = props.letters;
  itemList.value = props.data;
  isIndexBarVisible.value = letterList.value.length > 0;
  nextTick(() => {
    setAnchor();
  });
}
function toListItem() {
  // 保存侧边索引高度
  const height = sideIndex.value.style.height;
  // 第一个字符定位top，整体字符定位是否存在
  const searchText = inputText.value;
  if (searchText) {
    inputSearch.value = true;
    const searchItem = {};
    const searchLetters = [];
    for (let i = 0; i < props.letters.length; i++) {
      for (let j = 0; j < props.data[props.letters[i]].length; j++) {
        if (props.data[props.letters[i]][j].label.includes(searchText)) {
          if (!searchItem[props.letters[i]]) {
            searchItem[props.letters[i]] = [];
          }
          searchItem[props.letters[i]].push(props.data[props.letters[i]][j]);
          if (searchLetters.indexOf(props.letters[i]) < 0) {
            searchLetters.push(props.letters[i]);
          }
        }
      }
    }
    letterList.value = searchLetters;
    itemList.value = searchItem;
  } else {
    letterList.value = props.letters;
    itemList.value = props.data;
    inputSearch.value = false;
  }
  console.log('输入后：', letterList.value);
  isIndexBarVisible.value = letterList.value.length > 0;
  nextTick(() => {
    setAnchor();
  });
}

//重置筛选
const emit = defineEmits(['reset', 'selectRadio', 'selectCheckbox', 'updateName']);
const retSetTypes = () => {
  checkedValue.value = '';
  checkedArr.value = [];
  checkName.value = '';
  emit('reset', props.filterType);
};
//确认筛选
const confirmTypes = () => {
  emit('selectRadio', checkedValue.value);
  emit('selectCheckbox', checkedArr.value);
  emit('updateName', checkName.value);
};
</script>

<style lang="less" scoped>
ul,
ul li {
  list-style: none;
  padding: 0;
  margin: 0;
}
.search-box {
  background-color: var(--cell-bg);
  margin: 0 10px 10px 10px;
  border-radius: 4px;
  .search-input {
    background-color: var(--btn_fill);
    border-radius: 4px;
  }
  :deep(.van-field__control::-webkit-input-placeholder) {
    color: var(--timeline_color);
  }
  :deep(.van-field__control) {
    color: var(--text_exlight);
  }
  :deep(.van-cell) {
    line-height: 22px;
    padding: 7px 8px;
  }
  .search,
  .clear {
    display: inline-block;
    height: 20px;
    width: 20px;
  }
  .search {
    height: 16px;
    width: 16px;
    margin-left: 10px;
    margin-right: 0;
  }

  p {
    margin: 10px 0;
  }
}
.select-box {
  padding: 0 10px 10px 10px;
  max-height: v-bind(selectHeight);
  overflow: hidden;
  position: relative;
  label {
    font-size: 16px;
    color: var(--text_deep);
    position: absolute;
    left: 0;
    padding-left: 24px;
  }
}
.anchor {
  color: var(--text_light);
  margin-top: 0;
  margin-bottom: 9px;
  font-weight: 500;
  font-family: PingFang SC, PingFang SC;
}

.select-box input[type='radio'] {
  display: none;
}

.select-box input[type='checkbox'] {
  display: none;
}

.data-box {
  max-height: v-bind(selectHeight);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-right: 20px;
  .list-box {
    max-height: v-bind(selectHeight);
    padding-bottom: 50px;
    li:last-child {
      color: red;
      min-height: v-bind(selectHeight);
    }
  }
  &::-webkit-scrollbar {
    height: 0 !important;
    width: 0 !important;
    color: transparent;
    -webkit-appearance: none;
    display: none;
  }
}

.none-box {
  min-height: v-bind(selectHeight);
  text-align: center;
  margin-bottom: 0;
  img {
    width: 140px;
    margin-top: 85px;
  }
  p {
    font-size: 14px;
    color: #a5a5a7;
  }
}
.letter-wrapper {
  width: 30px;
  max-height: v-bind(sideHeight);
  padding-left: 15px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: v-bind(sideDistance);
  overflow: auto;
  z-index: 99999;
}
.letter-box {
  width: 14px;
  max-height: v-bind(sideHeight);
  font-family: PingFang SC, PingFang SC, sans-serif;
  background-color: var(--bg_content);
  text-align: center;
  border-radius: 12px 12px 12px 12px;
  overflow: auto;
  &::-webkit-scrollbar {
    height: 0 !important;
    width: 0 !important;
    color: transparent;
    -webkit-appearance: none;
    display: none;
  }
}
.letter-item {
  width: 14px;
  height: 14px;
  font-size: 10px;
  color: #757577;
}
.active {
  color: #f70512;
}
.bubble-box {
  width: 70px;
  height: 70px;
  background-color: #000000;
  text-align: center;
  opacity: v-bind(bubbleOpacity);
  border-radius: 4px;
  position: absolute;
  top: 30%;
  right: 50%;
  transform: translateY(-35px) translateX(35px);
  .bubble {
    font-size: 30px;
    font-weight: 600;
    line-height: 70px;
    color: #ffffff;
  }
}
.footer-box {
  width: 100%;
  padding: 0 10px;
  border-top: 1px solid var(--line_deep);
  background-color: var(--bg_light);
}
.con-drawer-footer {
  width: 100%;
  padding-top: 6px;
  padding-bottom: v-bind(btnPaddingBottom);
  display: flex;
}
.con-restore {
  background: var(--btn_fill);
  height: 40px;
  width: v-bind(btnRestoreWidth);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.con-confirm {
  background: var(--btn_fill_brand);
  height: 40px;
  width: v-bind(btnConfirmWidth);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.icon-checkbox {
  //background-size: 16px;
  &.light {
    background: url('./image/checkbox.png') no-repeat center center;
    background-size: 18px;
  }
  &.dark {
    background: url('./image/checkbox-dark.png') no-repeat center center;
    background-size: 18px;
  }
}

.icon-checkbox:before {
  content: '替';
  font-size: 16px;
  line-height: 16px;
  visibility: hidden;
}
.icon-checkbox-selected {
  background: url('./image/checkbox-selected.png') no-repeat center center;
  background-size: 16px;
}

.icon-checkbox-selected:before {
  content: '替';
  font-size: 16px;
  line-height: 16px;
  visibility: hidden;
}
:deep(.van-field__left-icon) {
  display: flex;
  align-items: center;
}
:deep(.van-icon__image) {
  width: 17.5px;
  height: 17.5px;
}
</style>

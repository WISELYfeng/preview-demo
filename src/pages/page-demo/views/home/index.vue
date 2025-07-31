<template>
  <BaseLayout :app-store="appStore" :scroll="false">
    <template #header>
      <BaseHeader :app-store="appStore" title="DEMO" help-icon="" helpPath="help"></BaseHeader>
    </template>
    <div class="home-container" ref="containerRef">
      <div class="head">
        <div class="block">
          <ZnzDatePicker :appStore="appStore" :dateString="String(dateString)" @updateDate="updateDate" :marketRange="marketDate"></ZnzDatePicker>
        </div>
      </div>
      <div class="funds-box" ref="fundsBoxRef">
        <div>内容区域</div>
        <div class="item-block">占位内容</div>
        <div v-show="showMore">{{ dateString }}</div>
        <div class="operate" @click="toggleDetail">
          {{ showMore ? '收起' : '展开' }} <span><svg-icon name="arrow-left" class="arrow" :class="showMore ? 'show' : 'hide'" /></span>
        </div>
      </div>
      <div class="ranking-box" ref="rankingRef" :style="{ height: listHeight }">
        <div class="fs-14-20">虚拟列表</div>
        <div class="list-box">
          <virtual-list :list-data="data"></virtual-list>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup name="Home">
import { ref, computed } from 'vue';
import { useApp } from '@page-demo/store/app.js';
import BaseLayout from '@/frame/BaseLayout.vue';
import BaseHeader from '@/frame/BaseHeader.vue';
import ZnzDatePicker from '@/components/ZnzDatePicker/index.vue';
import { marketDate } from './data.js';
import dayjs from 'dayjs';
import { useElementBounding } from '@vueuse/core';
import virtualList from './virtualList.vue';

const appStore = useApp();
let dateString = ref(dayjs().format('YYYYMMDD'));
const showMore = ref(false);

const fundsBoxRef = ref(null);
const containerRef = ref(null);
const { height: fundsHeight } = useElementBounding(fundsBoxRef);
const { height: containerHeight } = useElementBounding(containerRef);

const listHeight = computed(() => {
  if (!appStore.isVertical) {
    return containerHeight.value - 52 + 'px';
  }
  return containerHeight.value - fundsHeight.value - 52 + 'px';
});

let data = [];
for (let i = 0; i < 50; i++) {
  data.push({ id: i, value: i });
}

const updateDate = dateObj => {
  console.log('dateString', dateString.value);
  dateString.value = dateObj.date;
  // 根据日期变化做出对应操作
  // do something...
};

const toggleDetail = () => {
  showMore.value = !showMore.value;
};
</script>

<style lang="less" scoped>
.home-wrapper {
  height: 100%;
  background-color: var(--bg_deep);
  display: flex;
  flex-direction: column;
}
.head {
  background: var(--bg_content);
  .block {
    width: 220px;
    padding: 10px 0;
  }
}
.funds-box {
  border: 1px solid darkred;
  height: fit-content;
  .item-block {
    width: 100%;
    height: 100px;
  }
  .operate {
    text-align: center;
    margin-top: 5px;
    .show {
      transform: rotate(90deg);
    }
    .hide {
      transform: rotate(270deg);
    }
  }
}
.ranking-box {
  width: 100%;
  height: 700px;
  .list-box {
    height: calc(100% - 20px);
  }
}
.vertical-wrap {
  .home-container {
    height: 100%;
    //overflow: scroll;
    //-webkit-overflow-scrolling: touch;
    //overscroll-behavior: none;
    background-color: var(--content_bg);

    .funds-box {
      position: relative;
      z-index: 500;
    }
    //.ranking-box {
    //  height: calc(100% - 201px);
    //}
  }

  .split {
    height: 5px;
    background-color: var(--cell-bg);
    position: relative;
  }
}

.orientation-wrap {
  .home-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    height: 100%;
    //overflow: scroll;
    //-webkit-overflow-scrolling: touch;
    //overscroll-behavior: none;
  }

  .split {
    display: none;
  }

  .head {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 5000;
  }

  .funds-box,
  .ranking-box {
    position: sticky;
    top: 0;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: none;
    //height: calc(100% - 45px);
    //flex: 0 0 calc(50% - 2.5px);
    flex-basis: calc(50% - 2.5px);
    max-width: calc(50% - 2.5px);
  }
}
</style>

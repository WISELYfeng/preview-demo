<template>
  <div class="chart-wrap">
    <div id="ChartBarId" ref="chartContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, computed, ref, watch, onDeactivated, onActivated } from 'vue';
import echarts from '@lhbd/utils/echarts';
import ResizeObserver from 'resize-observer-polyfill';
import buyIcon from '@lhbd/assets/icons/buy.png';
import sellIcon from '@lhbd/assets/icons/sell.png';
import { getQueryString } from '@/service/url';

const props = defineProps({
  chartsData: {
    type: Array,
    default: () => []
  },
  dataLabel: {
    type: String,
    default: ''
  },
  dataType: {
    type: String,
    default: ''
  }
});
const theme = document.documentElement.getAttribute('theme');
const osType = computed(() => {
  return getQueryString('os');
});
const legend = ['K线图', '买入额'];
let chartOptions;
function initChart() {
  myChart.clear();
  if (props.chartsData && props.chartsData.length > 0) {
    // 引入缩放后设置初始化数据
    const zoomStart = 60;
    const zoomEnd = 100;
    const startIndex = Math.round((zoomStart / 100) * (props.chartsData.length - 1));
    const endIndex = Math.round((zoomEnd / 100) * props.chartsData.length);
    // 计算日期范围
    const dates = props.chartsData.map(item => item.date);
    // 计算 K 线图数据
    const klineData = props.chartsData.map(item => item.kline);
    const kComputeObj = computeMaxAndMin(klineData.flat(), 4);
    // 计算柱状图数据
    const barData = props.chartsData.map(item => item.netAmount);
    const barComputeObj = computeMaxAndMin(barData, 2);
    // 涨幅
    const upData = props.chartsData.map(item => item.upRange);
    // 柱状图标记
    const markPoints = barData
      .map(function (value, index) {
        if ((props.dataType.includes('总榜') && Math.abs(value) >= 10) || (props.dataType.includes('机构') && Math.abs(value) >= 5)) {
          return {
            coord: [index, value], // 使用坐标指定位置
            symbol: value > 0 ? 'image://' + buyIcon : 'image://' + sellIcon, // 设置标记的形状
            symbolSize: [20, 12]
          };
        }
      })
      .filter(item => item !== undefined); // 移除不满足条件的项
    chartOptions = {
      legend: {
        data: legend,
        show: false
      },
      tooltip: {
        trigger: 'axis',
        extraCssText: 'z-index: 999',
        showContent: true, // 是否显示提示框浮层，默认显示
        alwaysShowContent: false, // 是否永远显示提示框内容，默认情况下在移出可触发提示框区域后一定时间后隐藏
        confine: true, // 是否将 tooltip 框限制在图表的区域内
        backgroundColor: 'rgba(0, 0, 0, 0.60)', // 提示框浮层的背景颜色
        borderWidth: 0,
        padding: 10, // 提示框浮层内边距，单位px
        triggerOn: 'mousemove|click',
        position: function (point, params, dom, rect, size) {
          // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
          const x = point[0] > size.viewSize[0] / 2 ? 10 : size.viewSize[0] - dom.clientWidth - 10;
          return [x, 20];
        },
        formatter: params => {
          const date = params[0].axisValue;
          const index = params[0].dataIndex;
          let layA = props.dataLabel;
          const valueA = `${klineData[index][1]} ${upData[index] > 0 ? '+' + upData[index] + '%' : +upData[index] + '%'}`;
          let layB = '净买入';
          const valueB = barData[index];
          return `<span style="font-size: 14px;line-height: 17px;margin-bottom: 5px;display: flex;"> ${date}</span>
                  <div style="font-size: 14px;line-height: 20px;display: flex;justify-content: space-between;">
                      <div style="margin-right: 15px">${layA}：</div>
                      <div style="text-align: right">${valueA}</div>
                  </div>
                  <div style="font-size: 14px;line-height: 20px;display: flex;justify-content: space-between;">
                      <div style="margin-right: 15px">${layB}：</div>
                      <div style="text-align: right">${valueB}亿</div>
                  </div>
                  `;
        },
        textStyle: {
          color: '#ffffff', // 文字的颜色
          fontsize: 14,
          height: 22,
          fontStyle: 'normal', // 文字字体的风格（'normal'，无样式；'italic'，斜体；'oblique'，倾斜字体）
          fontWeight: 'normal' // 文字字体的粗细（'normal'，无样式；'bold'，加粗；'bolder'，加粗的基础上再加粗；'lighter'，变细；数字定义粗细也可以，取值范围100至700）
        }
      },
      axisPointer: {
        lineStyle: {
          type: 'solid',
          color: theme === 'light' ? '#2A2A2C' : '#EBECED'
        },
        link: [
          {
            xAxisIndex: 'all'
          }
        ]
      },
      grid: [
        {
          left: 10,
          right: 5,
          top: 20,
          height: 115
        },
        {
          left: 10,
          right: 5,
          bottom: 5,
          height: 55
        }
      ],
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: dates,
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: theme === 'light' ? '#F2F2F3' : '#151515'
            }
          },
          axisLabel: {
            color: theme === 'light' ? '#A5A5A7' : '#5A5B5D',
            showMaxLabel: true,
            interval: 0,
            formatter: function (value, index) {
              if (index === 0) {
                return `{textStyle1|${value}}`;
              }
              if (index === dates.length - 1) {
                return `{textStyle2|${value}}`;
              }
              return '';
            },
            rich: {
              textStyle1: {
                fontSize: '10px',
                padding: [0, 0, 0, 50] // 第一个标签向右偏移
              },
              textStyle2: {
                fontSize: '10px',
                marginRight: '10px',
                padding: [0, 50, 0, 0] // 第二个标签向左偏移
              }
            }
          },
          axisPointer: {
            label: {
              show: true,
              padding: osType.value === 'ios' ? [5, 15, 5, 5] : 5,
              fonSize: 10,
              lineHeight: 14,
              color: theme === 'light' ? '#FFFFFF' : '#1C1C1C',
              backgroundColor: '#538DE5',
              formatter: function (params) {
                return params.value;
              }
            }
          }
        },
        {
          type: 'category',
          gridIndex: 1,
          boundaryGap: false,
          data: dates,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          max: kComputeObj.max,
          min: kComputeObj.min,
          interval: kComputeObj.interval,
          axisLabel: {
            inside: true,
            color: theme === 'light' ? '#A5A5A7' : '#5A5B5D',
            verticalAlign: 'bottom',
            align: 'center',
            margin: 15,
            formatter: function (value) {
              return `${value.toFixed(2)}`;
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: theme === 'light' ? '#F2F2F3' : '#131313'
            }
          }
        },
        {
          type: 'value',
          gridIndex: 1,
          max: barComputeObj.max,
          min: barComputeObj.min,
          interval: barComputeObj.interval,
          axisLabel: {
            inside: true,
            color: theme === 'light' ? '#A5A5A7' : '#5A5B5D',
            verticalAlign: 'bottom',
            align: 'center',
            margin: 20,
            formatter: function (value, index) {
              if (index === 0) {
                return `${value.toFixed(2)} 亿`;
              }
              if (index === 2) {
                return `{a|${value.toFixed(2)} 亿}`;
              } else {
                return '';
              }
            },
            rich: {
              a: {
                verticalAlign: 'top',
                lineHeight: 0,
                padding: [5, 0, 0, 0]
              }
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: theme === 'light' ? '#F2F2F3' : '#131313'
            }
          }
        }
      ],
      series: [
        {
          name: legend[0],
          type: 'candlestick',
          data: klineData,
          barMaxWidth: 5,

          itemStyle: {
            color: '#F70512',
            color0: '#009A00'
          },
          markLine: {
            symbol: ['none', 'none'], // 不显示两端的标记点
            label: {
              show: false
            },
            lineStyle: {
              color: theme === 'light' ? '#F2F2F3' : '#131313',
              width: 1, // 线的宽度
              type: 'solid' // 线的类型
            },
            data: [
              {
                name: '最大值',
                yAxis: kComputeObj.max - 0.01
              }
            ]
          }
        },
        {
          name: '净买入',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: barData,
          barMaxWidth: 5,
          itemStyle: {
            color: function (params) {
              // 根据数据值或其他逻辑返回颜色
              return params.value > 0 ? '#f70512' : '#009a00';
            }
          },
          markPoint: {
            data: markPoints
          },
          markLine: {
            symbol: ['none', 'none'], // 不显示两端的标记点
            label: {
              show: false
            },
            lineStyle: {
              color: theme === 'light' ? '#F2F2F3' : '#131313',
              width: 1, // 线的宽度
              type: 'solid' // 线的类型
            },
            data: [
              {
                name: '最大值',
                yAxis: barComputeObj.max - 0.01
              },
              {
                name: '最小值',
                yAxis: barComputeObj.min > 0 ? barComputeObj.min - 0.01 : barComputeObj.min + 0.01
              }
            ]
          }
        }
      ]
    };
  } else {
    chartOptions = {
      xAxis: [
        {
          type: 'category',
          data: [],
          axisLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'no-data',
          type: 'bar',
          data: []
        }
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: '暂无数据',
            textAlign: 'center',
            fill: theme === 'light' ? '#A5A5A7' : '#5A5B5D', //文字的颜色
            fontSize: 14,
            lineHeight: 20
          }
        }
      ]
    };
  }
  myChart.setOption(chartOptions);
}
const computeMaxAndMin = (data, num) => {
  const max = Math.max(...data) * 1.05;
  const min = Math.min(...data) > 0 ? Math.min(...data) * 0.95 : Math.min(...data) * 1.05;
  const interval = (max - min) / num;
  return {
    max: min + interval * num,
    min,
    interval
  };
};
const zoomHandler = () => {
  const option = myChart.getOption();
  const zoom = option.dataZoom;
  const start = zoom[0].start;
  const end = zoom[0].end;
  const startIndex = Math.round((start / 100) * (props.chartsData.length - 1));
  const endIndex = Math.round((end / 100) * props.chartsData.length);
  // 计算 K 线图数据
  const klineData = props.chartsData.map(item => item.kline);
  const kFlatData = klineData.slice(startIndex, endIndex).flat();
  const kComputeObj = computeMaxAndMin(kFlatData, 4);
  // 计算柱状图数据
  const barData = props.chartsData.map(item => item.netAmount);
  const barComputeObj = computeMaxAndMin(barData.slice(startIndex, endIndex), 2);
  // 设置y轴最大最小值
  option.yAxis[0].max = kComputeObj.max;
  option.yAxis[0].min = kComputeObj.min;
  option.yAxis[0].interval = kComputeObj.interval;
  option.yAxis[1].max = barComputeObj.max;
  option.yAxis[1].min = barComputeObj.min;
  option.yAxis[1].interval = barComputeObj.interval;
  option.yAxis[1].interval = barComputeObj.interval;
  // 设置标记线
  option.series[0].markLine.data[0].yAxis = kComputeObj.max - 0.01;
  option.series[1].markLine.data[0].yAxis = barComputeObj.max - 0.01;
  option.series[1].markLine.data[1].yAxis = barComputeObj.min > 0 ? barComputeObj.min - 0.01 : barComputeObj.min + 0.01;
  myChart.setOption(option, {
    lazyUpdate: true
  });
};
let myChart;
const chartContainer = ref(null);
let ro = null;
let touch = ref(0);
const handleTouchStart = () => {
  touch.value = 0;
};

const handleTouchEnd = () => {
  touch.value = 1;
};
watch(
  () => touch.value,
  newVal => {
    if (newVal === 1) {
      closeTip();
    }
  }
);
function throttleWithReset(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId); // 清除之前的计时器
    }

    // 创建新的计时器
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function delayedFunction() {
  myChart.dispatchAction({
    type: 'hideTip'
  });
  myChart.dispatchAction({
    type: 'updateAxisPointer',
    currTrigger: 'leave'
  });
}
const closeTip = throttleWithReset(delayedFunction, 0);
watch(
  () => props.chartsData,
  () => {
    initChart();
  },
  { deep: true }
);
onMounted(() => {
  const dom = getCurrentInstance().refs.chartContainer;
  myChart = echarts.init(dom, { renderer: 'svg' });
  initChart();
  ro = new ResizeObserver(() => {
    myChart.resize();
  });
  ro.observe(chartContainer.value);
  myChart.on('dataZoom', zoomHandler);
  chartContainer.value?.addEventListener('touchstart', handleTouchStart);
  chartContainer.value?.addEventListener('touchend', handleTouchEnd);
});
onActivated(() => {
  chartContainer.value?.addEventListener('touchstart', handleTouchStart);
  chartContainer.value?.addEventListener('touchend', handleTouchEnd);
});
onDeactivated(() => {
  chartContainer?.value?.removeEventListener('touchstart', handleTouchStart);
  chartContainer?.value?.removeEventListener('touchend', handleTouchEnd);
});
</script>

<style scoped lang="less">
.chart-wrap {
  text-align: center;
  width: 100%;
  #ChartBarId {
    width: 100%;
    margin: 0 auto;
    height: 240px;
  }
}
</style>

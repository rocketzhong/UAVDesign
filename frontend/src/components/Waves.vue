<template>
  <div>
    <canvas id="chart1" width="200" height="37"></canvas>
    <canvas id="chart2" width="200" height="37"></canvas>
    <canvas id="chart3" width="200" height="37"></canvas>
    <canvas id="chart4" width="200" height="37"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import * as echarts from 'echarts/core';
import { planeStatus } from '../sw'
import {
  BarChart,
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineChart,
  LineSeriesOption
} from 'echarts/charts';
import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  // 数据集组件
  DatasetComponent,
  DatasetComponentOption,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>;

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);
const option1 = {
  xAxis: {
    data: []
  },
  yAxis: {
    axisLabel: {
      show: false, // 不显示坐标轴上的文字
    }
  },
  series: [
    {
      data: [0, 0, 0, 0],
      type: 'line',
      areaStyle: {}
    }
  ],
  grid: {
    left: '0',
    right: '0',
    bottom: '1%',
    top: 0,
    containLabel: true
  }
};
const option2 = { ...option1 };
const option3 = { ...option1 };
const option4 = { ...option1 };
option2.series = [{ data: [0, 0, 0, 0], type: 'line', areaStyle: {} }];
option3.series = [{ data: [0, 0, 0, 0], type: 'line', areaStyle: {} }];
option4.series = [{ data: [0, 0, 0, 0], type: 'line', areaStyle: {} }];
onMounted(() => {
  const myChart1 = echarts.init(document.getElementById('chart1')!);
  const myChart2 = echarts.init(document.getElementById('chart2')!);
  const myChart3 = echarts.init(document.getElementById('chart3')!);
  const myChart4 = echarts.init(document.getElementById('chart4')!);
  myChart1.setOption(option1);
  myChart2.setOption(option2);
  myChart3.setOption(option3);
  myChart4.setOption(option4);
  watch(planeStatus, () => {
    option1.series[0].data.push(planeStatus.ROL);
    if (option1.series[0].data.length > 500) option1.series[0].data.shift();
    myChart1.setOption(option1);

    option2.series[0].data.push(planeStatus.PIT);
    if (option2.series[0].data.length > 500) option2.series[0].data.shift();
    myChart2.setOption(option2);

    option3.series[0].data.push(planeStatus.YAW);
    if (option3.series[0].data.length > 500) option3.series[0].data.shift();
    myChart3.setOption(option3);

    option4.series[0].data.push(planeStatus.ALT_USE);
    if (option4.series[0].data.length > 500) option4.series[0].data.shift();
    myChart4.setOption(option4);

  })

})
</script>

<style scoped></style>
<template>
  <div class="box" ref="box"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'BarChart',
  mounted() {
    let barChart = echarts.init(this.$refs.box)
    barChart.setOption({
      xAxis: {
        show: false,
        // x 轴最小值和最大值的设置
        min: 0,
        max: 100
      },
      yAxis: {
        type: 'category',
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [85],
          color: 'green',
          // 柱条的宽度
          barWidth: 10,
          // 显示柱条的背景色
          showBackground: true,
          // 柱条的背景色
          backgroundStyle: {
            color: '#eee'
          },
          // 文本
          lable: {
            show: true,
            formatter: '|',
            position: 'right'
          }
        }
      ],
      tooltip: {},
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })
  }
}
</script>

<style >
  .box {
    width: 100%;
    height: 100%;
  }
</style>
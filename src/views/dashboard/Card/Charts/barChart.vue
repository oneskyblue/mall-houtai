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
        type: 'category',
        show: false
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [10, 40, 70, 30, 50, 20, 60, 80],
          color: 'purple'
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
<template>
  <div class="box" ref="box"></div>
</template>

<script>
// 引入 echarts
import * as echarts from 'echarts'

export default {
  name: 'lineChart',
  mounted() {
    // 基于准备好的 DOM ，初始化 echarts 实例
    let lineChart = echarts.init(this.$refs.box)
    // 配置数据
    lineChart.setOption({
      xAxis: {
        show: false, // 不显示 x 轴
        type: 'category'
      },
      yAxis: {
        show: false // 不显示 y 轴
      },
      series: [
        {
          type: 'line',
          data: [10, 50, 20, 30, 60, 40],
          // 折线拐点标志的样式
          itemStyle: {
            opacity: 0 // 透明度为 0 ，不显示拐点
          },
          // 区域填充的颜色
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                  offset: 0, color: 'blue' // 0% 处的颜色
              }, {
                  offset: 1, color: 'white' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ],
      // 图表的位置
      grid: {
        left: 0,
        right: 0,
        top: 3,
        bottom: 0
      }
    })
  }
}
</script>

<style scoped>
  .box {
    width: 100%;
    height: 100%;
  }
</style>
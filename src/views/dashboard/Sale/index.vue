<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- tabs 标签页 -->
      <el-tabs class="tabs" v-model="activeName">
        <el-tab-pane label="销售额" name="first"></el-tab-pane>
        <el-tab-pane label="访问量" name="second"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="day">今日</span>
        <span @click="week">本周</span>
        <span @click="month">本月</span>
        <span @click="year">本年</span>
        <!-- 日期选择器 -->
        <el-date-picker
          class="date"
          size="mini"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="date"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 图表 -->
          <div class="chart" ref="chart"></div>
        </el-col>
        <el-col :span="6">
          <h3>门店销售额排行</h3>
          <ul>
            <li>
              <span>1</span>
              <span>茶百道</span>
              <span class="value">916</span>
            </li>
            <li>
              <span>2</span>
              <span>茶百道</span>
              <span class="value">916</span>
            </li>
            <li>
              <span>3</span>
              <span>茶百道</span>
              <span class="value">916</span>
            </li>
            <li>
              <span>4</span>
              <span>茶百道</span>
              <span class="value">916</span>
            </li>
            <li>
              <span>5</span>
              <span>茶百道</span>
              <span class="value">916</span>
            </li>
            <li>
              <span>6</span>
              <span>茶百道</span>
              <span class="value">916</span>
            </li>
            <li>
              <span>7</span>
              <span>茶百道</span>
              <span class="value">916</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import dayjs from 'dayjs'
import * as echarts from 'echarts'

export default {
  name: 'Sale',
  data() {
    return {
      // 销售额和访问量的切换
      activeName: 'first',
      // 日期
      date: [],
      // 图表
      chart: null
    }
  },
  // 组件挂载时生成图表
  mounted() {
    // 获取图表容器
    let div = this.$refs.chart
    // 初始化一个 echarts 实例
    this.chart = echarts.init(div)
    // 设置相关配置
    this.chart.setOption({
      title: {
        text: '销售额趋势'
      },
      xAxis: {
        data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      },
      yAxis: {
        max: 1500,
        axisLine: {
          show: true
        },
        axisTick: {
          show: true
        }
      },
      // 提示框组价
      tooltip: {},
      // 系列切换组件
      legend: {
        data: ['柱状图', '折线图']
      },
      series: [
        {
          name: '柱状图',
          type: 'bar',
          data: [900, 630, 950, 1200, 860, 700, 1000, 590, 760, 850, 770, 600],
          color: 'skyblue'
        },
        {
          name: '折线图',
          type: 'line',
          data: [900, 630, 950, 1200, 860, 700, 1000, 590, 760, 850, 770, 600],
          color: 'red'
        }
      ],
      grid: {
        right: 100
      }
    })
  },
  methods: {
    day() {
      const day = dayjs().format('YYYY-MM-DD') // 今日
      this.date = [day, day]
    },
    week() {
      const startWeek = dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD') // 本周第一天
      const endWeek = dayjs().endOf('week').add(1, 'day').format('YYYY-MM-DD') // 本周最后一天
      this.date = [startWeek, endWeek]
    },
    month() {
      const startMonth = dayjs().startOf('month').format("YYYY-MM-DD") // 本月第一天
      const endMonth = dayjs().endOf('month').format("YYYY-MM-DD") // 本月最后一天
      this.date = [startMonth, endMonth]
    },
    year() {
      const startYear = dayjs().startOf('year').format("YYYY-MM-DD") // 本年第一天
      const endYear = dayjs().endOf('year').format("YYYY-MM-DD") // 本年最后一天
      this.date = [startYear, endYear]
    }
  },
  // 监听 activeName 数据的变化，该数据有两个值：'first'和'second'
  // 其中 'first' 代表销售额趋势表，'second' 代表访问量趋势表
  watch: {
    activeName(newValue, oldValue) {
      this.chart.setOption({
        title: {
          text: newValue === 'second' ? '访问量趋势' : '销售额趋势'
        },
        series: [
          {
            name: '柱状图',
            type: 'bar',
            data: newValue === 'second' ? [700, 850, 650, 1000, 900, 750, 900, 800, 700, 760, 900, 630] : [900, 630, 950, 1200, 860, 700, 1000, 590, 760, 850, 770, 600],
            color: newValue === 'second' ? 'orange' : 'skyblue'
          },
          {
            name: '折线图',
            type: 'line',
            data: newValue === 'second' ? [700, 850, 650, 1000, 900, 750, 900, 800, 700, 760, 900, 630] : [900, 630, 950, 1200, 860, 700, 1000, 590, 760, 850, 770, 600],
            color: newValue === 'second' ? 'cyan' : 'red'
          }
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .box-card {
    margin: 20px 0;
  }

  .clearfix {
    position: relative;
    display: flex;
    justify-content: space-between;
  }

  .tabs {
    width: 100%;
  }

  .right {
    position: absolute;
    top: 5px;
    right: 0;

    span {
      margin: 0 10px;
    }
  }

  .date {
    width: 250px;
    margin: 0 20px;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin: 18px 0;

      span {
        margin-right: 10px;
      }

      .value {
        float: right;
      }
    }
  }

  h3 {
    margin-top: 0;
  }
  
  // 为图表容器设置宽高
  .chart {
    width: 100%;
    height: 300px;
  }
</style>
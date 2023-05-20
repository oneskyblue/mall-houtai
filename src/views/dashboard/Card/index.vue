<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <!-- 第一个 card -->
      <el-card>
        <Detail title="总销售额" count="￥12345678">
          <template slot="chart">
            <span>周同比 52.1%<svg t="1682783837981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2379" width="16" height="16"><path d="M255.998 488.11h167.253l0.909 322.563h166.4v-322.56l167.253 0.455L506.819 165.61l-250.821 322.5z" fill="#1296DB" p-id="2380"></path></svg></span>
            &nbsp;
            <span>日同比 13.14%<svg t="1682783960547" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2887" width="16" height="16"><path d="M768.002 535.89H600.749l-0.909-322.563h-166.4v322.56l-167.253-0.455L517.181 858.39l250.821-322.5z" fill="#FD3333" p-id="2888"></path></svg></span>
          </template>
          <template slot="footer">
            <span>日销售额￥99999</span>
          </template>
        </Detail>
      </el-card>
    </el-col>
    <el-col :span="6">
      <!-- 第二个 card -->
      <el-card>
        <Detail title="访问量" count="987654">
          <template slot="chart">
            <!-- 折线图 -->
            <LineChart/>
          </template>
          <template slot="footer">
            <span>日访问量12345</span>
          </template>
        </Detail>
      </el-card>
    </el-col>
    <el-col :span="6">
      <!-- 第三个 card -->
      <el-card>
        <Detail title="支付笔数" count="654321">
          <template slot="chart">
            <BarChart/>
          </template>
          <template slot="footer">
            <span>转换率50%</span>
          </template>
        </Detail>
      </el-card>
    </el-col>
    <el-col :span="6">
      <!-- 第四个 card -->
      <el-card>
        <Detail title="运营活动效果" count="85%">
          <template slot="chart">
            <ProgressChart/>
          </template>
          <template slot="footer">
            <span>周同比 52.1%<svg t="1682783837981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2379" width="16" height="16"><path d="M255.998 488.11h167.253l0.909 322.563h166.4v-322.56l167.253 0.455L506.819 165.61l-250.821 322.5z" fill="#1296DB" p-id="2380"></path></svg></span>
            &nbsp;
            <span>日同比 13.14%<svg t="1682783960547" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2887" width="16" height="16"><path d="M768.002 535.89H600.749l-0.909-322.563h-166.4v322.56l-167.253-0.455L517.181 858.39l250.821-322.5z" fill="#FD3333" p-id="2888"></path></svg></span>
          </template>
        </Detail>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Detail from './Detail'
import LineChart from './Charts/lineChart.vue'
import BarChart from './Charts/barChart.vue'
import ProgressChart from './Charts/progressChart.vue'

export default {
  name: 'Card',
  components: {
    Detail,
    LineChart,
    BarChart,
    ProgressChart
  }
}
</script>

<style>

</style>
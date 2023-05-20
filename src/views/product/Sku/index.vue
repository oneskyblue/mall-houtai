<template>
  <el-card style="margin-top: 20px">
    <el-table style="width: 100%" :data="records" border>
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column prop="prop" label="默认图片" width="width">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"></el-table-column>
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="{ row }">
          <el-button type="success" icon="el-icon-top" size="mini" title="Sku上架" v-if="row.isSale === 0" @click="onSale(row)"></el-button>
          <el-button icon="el-icon-bottom" size="mini" title="Sku下架" v-else @click="cancelSale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" title="查看Sku详情" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align: center"
      :current-page="page"
      :page-sizes="[5, 10, 15]"
      :page-size="limit"
      :total="total"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSkuList"
      @size-change="handleSizeChange">
    </el-pagination>
    <!-- 抽屉弹框 -->
    <el-drawer :visible.sync="drawer" size="40%" :show-close="false">
      <el-row>
        <el-col :span="6">名称</el-col>
        <el-col :span="15">{{ skuInfo.skuName }}</el-col>
        <el-col :span="6">描述</el-col>
        <el-col :span="15">{{ skuInfo.skuDesc }}</el-col>
        <el-col :span="6">价格</el-col>
        <el-col :span="15">{{ skuInfo.price }}</el-col>
        <el-col :span="6">平台属性</el-col>
        <el-col :span="15">
          <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id">{{ attr.attrName }}</el-tag>
        </el-col>
        <el-col :span="6">商品图片</el-col>
        <el-col :span="15">
          <el-carousel height="390px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="width: 400px; height: 390px">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      // 当前页数
      page: 1,
      // 每一页显示多少条数据
      limit: 10,
      // 一共多少条数据
      total: 0,
      // 存储 Sku 列表数据
      records: [],
      // 存储 Sku 详情信息
      skuInfo: {},
      // 控制抽屉的显示与隐藏
      drawer: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 发送请求获取 Sku 列表数据
    async getSkuList(pager = 1) {
      this.page = pager
      const { page, limit } = this
      let result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    // 更改分页器每页显示多少条数据的回调
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // Sku 上架，点击上架按钮的回调
    async onSale(sku) {
      // 发请求通知服务器修改 Sku 的 isSale 为 1
      let result = await this.$API.sku.reqOnSale(sku.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: 'Sku上架成功' })
        // 再次发送请求获取 Sku 列表数据
        this.getSkuList(this.page)
      }
    },
    // Sku 下架，点击下架按钮的回调
    async cancelSale(sku) {
      let result = await this.$API.sku.reqCancelSale(sku.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: 'Sku下架成功' })
        // 再次发送请求获取 Sku 列表数据
        this.getSkuList(this.page)
      }
    },
    // 修改按钮的回调
    edit() {
      this.$message('正在开发中')
    },
    // 查看 Sku 详情的回调
    async getSkuInfo(sku) {
      this.drawer = true
      // 发送请求获取 Sku 详情信息
      let result = await this.$API.sku.reqSkuInfo(sku.id)
      if (result.code === 200) {
        this.skuInfo = result.data
      }
    }
  }
}
</script>

<style>
  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  /* .el-carousel__button {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: gray;
  }
  .el-drawer__header {
    padding: 0;
  } */
</style>

<style scoped lang="less">
  .el-row {
    .el-col {
      margin: 20px 10px;
    }
    .el-col-6 {
      text-align: right;
    }
  }
  .el-tag {
    margin: 0 10px 10px 0;
  }
  // 深度选择器
  // >>> css
  // /deep/ less
  // ::v-deep scss
  /deep/.el-carousel__button {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: gray;
  }
  /deep/.el-drawer__header {
    padding: 0;
  }
</style>
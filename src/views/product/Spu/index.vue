<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene !== 0"/>
    </el-card>
    <!-- 第二个 card 卡片是有三部分进行切换 -->
    <el-card>
      <!-- 第一部分 Spu 数据列表 -->
      <div v-show="scene === 0">
        <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" :disabled="!category3Id" @click="addSpu">
          添加Spu
        </el-button>
        <!-- table 表格 -->
        <el-table style="width: 100%" border :data="list">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="Spu名称" width="width"></el-table-column>
          <el-table-column prop="description" label="Spu描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button type="success" icon="el-icon-plus" size="mini" title="添加Sku" @click="addSku(row)"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改Spu" @click="updateSup(row)"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="查看当前Spu全部Sku列表" @click="handler(row)"></el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <el-button style="margin-left: 10px" type="danger" icon="el-icon-delete" size="mini" title="删除Spu" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器    -->
        <el-pagination
          style="text-align: center; margin-top: 20px"
          :current-page="page"
          :page-sizes="[3, 6, 9]"
          :page-size="limit"
          :total="total"
          layout="prev, pager, next, jumper, ->, sizes, total"
          @current-change="getSpuList"
          @size-change="handleSizeChange">
        </el-pagination>
        <!-- 查看当前 Spu 全部 Sku 列表的对话框 -->
        <el-dialog :title="`${spu.spuName}的全部Sku列表`" :visible.sync="dialogTableVisible" @closed="closed">
          <el-table :data="skuList" style="width: 100%" border v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
            <el-table-column prop="skuName" label="名称"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column prop="weight" label="重量"></el-table-column>
            <el-table-column label="图片">
              <template slot-scope="{ row }">
                <img :src="row.skuDefaultImg" style="width: 100px; height: 100px">
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
      <!-- 第二部分 添加和修改 Spu -->
      <SpuForm v-show="scene === 1" @changeScene="changeScene" ref="spu"/>
      <!-- 第三部分 添加 Sku -->
      <SkuForm v-show="scene === 2" @changeScenes="changeScenes" ref="sku"/>
    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'

export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 当前页
      page: 1,
      // 每一页的数据个数
      limit: 3,
      // 数据的总个数
      total: 0,
      // Spu 列表数据
      list: [],
      // 用于切换三部分：Spu 数据列表、添加和修改 Spu、添加 Sku
      scene: 0,
      // 用于查看 Sku 列表对话框的显示与隐藏
      dialogTableVisible: false,
      // 当前 Spu 全部 Sku 列表的数据
      skuList: [],
      spu: {},
      // Sku 列表对话框 loading 加载
      loading: true
    }
  },
  methods: {
    // 收集一二三级分类 id
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        // 清除二三级分类 id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        // 清除三级分类 id
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 收集完一二三级分类 id ，发送请求获取数据
        this.getSpuList()
      }
    },
    // 获取 Spu 列表数据的方法
    async getSpuList(pager = 1) {
      this.page = pager
      const { page, limit, category3Id } = this
      // 发送请求获取 Spu 列表数据
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      // 请求成功
      if (result.code === 200) {
        // Spu 列表数据
        this.list = result.data.records
        // 数据总个数
        this.total = result.data.total
      }
    },
    // 更改每一页展示多少条数据个数的回调
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit
      // 再次发送请求获取 Spu 列表数据
      this.getSpuList()
    },
    // 添加 Spu 按钮的回调
    addSpu() {
      this.scene = 1
      // 这里需要让子组件发两个请求，获取品牌和销售属性的数据
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改 Spu 按钮的回调
    updateSup(row) {
      this.scene = 1
      // 这里需要让 SpuForm 子组件发四个请求
      // 获取 SpuForm 子组件，在父组件中可以通过 $ref 获取子组件
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件，给 SpuForm 子组件绑定事件，子组件触发该事件给父组件传递数据
    // 这里子组件传递的数据为 0 ，即 scene 为 0 ，用于切换场景
    changeScene({ scene, flag }) {
      this.scene = scene
      // 再次获取 Spu 列表数据
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除 Spu 按钮的回调
    async deleteSpu(row) {
      // 发请求
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      // 请求成功
      if (result.code === 200) {
        // 提示
        this.$message({ type: 'success', message: '删除成功' })
        // 再次获取 Spu 列表数据
        this.getSpuList(this.list.length < 1 ? this.page - 1 : this.page)
      }
    },
    // 添加 Sku 按钮的回调
    addSku(row) {
      // 切换场景
      this.scene = 2
      // 父组件通知子组件发送请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // 自定义事件的回调
    changeScenes(scene) {
      this.scene = scene
    },
    // 点击查看当前 Spu 全部 Sku 列表按钮的回调
    async handler(spu) {
      // 保存 spu 信息
      this.spu = spu
      // 显示 Sku 列表对话框
      this.dialogTableVisible = true
      // 发请求获取当前 Spu 全部 Sku 列表数据
      let result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code === 200) {
        this.skuList = result.data
        // 去掉 loading 加载
        this.loading = false
      }
    },
    // dialog 关闭动画结束时的回调
    closed() {
      this.loading = true
      // 清除当前 Spu 全部 Sku 列表的数据，防止数据回显
      this.skuList = []
    }
  }
}
</script>
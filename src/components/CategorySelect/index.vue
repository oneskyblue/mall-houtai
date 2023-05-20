<template>
  <div>
    <!-- 行内表单 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      // 获取的一级分类数据
      list1: [],
      // 获取的二级分类数据
      list2: [],
      // 获取的三级分类数据
      list3: [],
      // 收集的一级、二级、三级分类id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      }
    }
  },
  // 组件挂载调用函数
  mounted() {
    this.getCategory1List()
  },
  methods: {
    // 发送请求获取一级分类数据
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    // 一级分类选择框改变时的回调（回调的名字change是自定义事件）
    async handler1() {
      // 清除数据，防止再次点击一级分类选择框时，上一次的二级和三级分类选择框的内容还在
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.list2 = []
      this.list3 = []
      // 解构出一级分类id
      const { category1Id } = this.cForm
      // 向Attr组件传递一级分类id
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      // 发送请求获取二级分类数据，参数为一级分类id
      let result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    // 二级分类选择框改变时的回调
    async handler2() {
      // 清除数据，防止再次点击二级分类选择框时，上一次的三级分类选择框的内容还在
      this.cForm.category3Id = ''
      this.list3 = []
      // 解构出二级分类id
      const { category2Id } = this.cForm
      // 向Attr组件传递二级分类id
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      // 发送请求获取三级分类数据，参数为二级分类id
      let result = await this.$API.attr.reqCategory3List(category2Id)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    // 三级分类选择框改变时的回调
    handler3() {
      // 解构出三级分类id
      const { category3Id } = this.cForm
      // 向Attr父组件传递三级分类id
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style>

</style>
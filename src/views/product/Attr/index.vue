<template>
  <div>
    <!-- card卡片1 -->
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"/>
    </el-card>

    <!-- card卡片2 -->
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0"
          :disabled="!category3Id"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <!-- 表格 -->
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag type="success" style="margin: 0 10px"
                v-for="attrvalue in row.attrValueList"
                :key="attrvalue.id"
              >
                {{ attrvalue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="edit(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowTable">
        <!-- 行内表单 -->
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <!-- 表格 -->
        <el-table style="width: 100%; margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input placeholder="请输入属性值名称" size="mini"
                v-model="row.valueName"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="row.flag = false"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
        >
          保存
        </el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 获取的商品基础属性数据
      attrList: [],
      // 控制card卡片2中div的显示与隐藏
      isShowTable: true,
      // 收集 新增属性或修改属性 所需的数据
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [ // 属性值列表
          // {
          //   attrId: 0, // 属性的id
          //   valueName: '' // 属性值
          // }
        ],
        categoryId: 0, // category3Id
        categoryLevel: 3,
      }
    }
  },
  methods: {
    getCategoryId(object) {
      // 判断CategorySelect子组件传递过来的数据是几级分类id
      if (object.level === 1) {
        // level等1表示传递过来的数据是一级分类id
        this.category1Id = object.categoryId
        // 清除上一次的二三级分类id
        this.category2Id = ''
        this.category3Id = ''
      } else if (object.level === 2) {
        // level等2表示传递过来的数据是二级分类id
        this.category2Id = object.categoryId
        // 清除上一次的三级分类id
        this.category3Id = ''
      } else {
        // level等3表示传递过来的数据是三级分类id
        this.category3Id = object.categoryId
        // 当一二三级分类id都有时，发送请求获取数据
        this.getAttrList()
      }
    },
    async getAttrList() {
      // 解构出一二三级分类id
      const { category1Id, category2Id, category3Id } = this
      // 发送请求获取商品基础属性，参数为一二三级分类id
      let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      this.attrList = result.data
    },
    // 点击添加属性值按钮的回调
    addAttrValue() {
      // 向attrValueList中添加对象（属性的id和属性值）
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 对于修改某一个属性的时候，可以在已有的属性值基础上新增新的属性值，需要把已有的属性的id带上
        valueName: '' ,
        flag: true // 给每一个属性值添加一个标记flag，用于切换查看模式和编辑模式，这样每一个属性值可以控制自己的模式切换
      })
      // 实现input框自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 点击添加属性按钮的回调
    addAttr() {
      this.isShowTable = false
      // 清除数据，防止点击添加按钮上次添加的属性和属性值还在
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        // 在这里收集category3Id，而不是在data中收集是因为在data中不能使用this
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    // 点击修改按钮的回调
    edit(row) {
      this.isShowTable = false
      // 数据结构当中存在对象里面套数组，数组里面套对象，因此需要使用深拷贝
      this.attrInfo = cloneDeep(row)
      // 在修改某一个属性的时候，将相应的属性值元素加上flag标记
      // console.log(this.attrInfo.attrValueList.length)
      this.attrInfo.attrValueList.forEach(item => {
        // 这样写可以给属性值添加flag属性，但是视图不会跟着变化（input和span不会切换），因为flag不是响应式数据
        // Vue无法探测普通的新增属性，这样写的属性不是响应式属性
        // item.flag = false
        // 响应式属性，第一个参数：对象，第二个参数：添加的响应式属性，第三个参数：响应式属性的值
        this.$set(item, 'flag', false)
      })
    },
    // input框失去焦点的回调
    toLook(row) {
      // row是新增的属性值
      // console.log(row)
      // input框输入的属性值名称不能为空
      if (!row.valueName.trim()) {
        this.$message.error('属性值名称不能为空')
        return
      }
      // input框输入的属性值名称不能重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // row是新增的属性值，也就是数组的最后一项元素
        // 需要将row从数组里面去除
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      // console.log(isRepeat)
      if (isRepeat) {
        this.$message.error('该属性值名称已存在')
        return
      }
      // input切换成span
      row.flag = false
    },
    // 点击span的回调，查看模式变为编辑模式
    toEdit(row, index) {
      // span切换成input
      row.flag = true
      // 实现input框自动聚焦
      // 不能这样写，因为这时input框还没渲染出来，取不到input框
      // console.log(this.$refs[index]) // undefined
      // this.$refs[index].focus()
      // 使用nextTick，在input框渲染出来后再执行箭头函数，这样就能够取到input
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 点击气泡确认框中确定按钮的回调
    deleteAttrValue(index) {
      // 当前删除属性值的操作时不需要发请求的
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 点击保存按钮的回调
    async addOrUpdateAttr() {
      // 把属性值名称不为空的过滤出来，形成新数组，赋值给data中的attrInfo
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName !== '') {
          // 删除flag属性，因为发请求时参数对象中没有flag属性
          delete item.flag
          return true
        }
      })
      try {
        // 发请求添加属性或修改属性
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        // 请求成功后的操作
        this.$message({ message: '保存成功', type: 'success' })
        this.isShowTable = true
        // 发送请求获取商品基础属性
        this.getAttrList()
      } catch (error) {}
    },
    // 删除属性的回调
    deleteAttr(row) {
      // 确认消息弹框
      this.$confirm('确定删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发请求删除属性
        let result = await this.$API.attr.reqDeleteAttr(row.id)
        // 请求成功后的操作
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          // 发送请求获取商品基础属性
          this.getAttrList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>

</style>
<template>
  <div>
    <!-- 表单 -->
    <el-form label-width="80px">
      <el-form-item label="Spu名称">
        <el-input placeholder="Spu名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Spu描述">
        <el-input type="textarea" placeholder="Spu描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="Spu图片">
        <!-- 照片墙 -->
        <!-- action：图片上传的地址 :file-list：照片墙需要展示的数据（数组：数组里面的对象中需要有 name 和 url 字段） -->
        <!-- on-preview：图片预览 on-remove：删除图片 on-success：图片上传成功 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="imageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${noSelect.length}个未选择`" v-model="attrIdAndAttrName">
          <el-option
            :label="item.name"
            :value="`${item.id}:${item.name}`"
            :key="item.id"
            v-for="item in noSelect">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">
          添加销售属性
        </el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <!-- 销售属性值 tag 标签  -->
              <el-tag  
                closable
                :disable-transitions="false"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.id"
                @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <!-- 这部分是 input 和 button 之间的切换 -->
              <el-input
                class="input-new-tag"
                ref="saveTagInput"
                size="small"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdate">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      // 图片预览对话框中的图片地址
      dialogImageUrl: '',
      // 控制图片预览对话框的显示与隐藏
      dialogVisible: false,
      // 未选择的销售属性的 id 和 name
      attrIdAndAttrName: '',
      // 存储 Spu 信息的数据，分为两种情况：
      // 当添加 Spu 时，spu 为下面的对象（对象里面的属性要看文档，根据文档来写）
      // 当修改 Spu 时，spu 为服务器返回的数据
      spu: {
        "category3Id": 0,
        // Spu 名称
        "spuName": "",
        // 品牌 id
        "tmId": '',
        // Spu 描述
        "description": "",
        // Spu 图片
        "spuImageList": [
          // {
          //   "id": 0,
          //   "imgName": "",
          //   "imgUrl": "",
          //   "spuId": 0
          // }
        ],
        // 销售属性
        "spuSaleAttrList": [
          // {
          //   "baseSaleAttrId": 0,
          //   "id": 0,
          //   "saleAttrName": "",
          //   "spuId": 0,
          //   "spuSaleAttrValueList": [
          //     {
          //       "baseSaleAttrId": 0,
          //       "id": 0,
          //       "isChecked": "",
          //       "saleAttrName": "",
          //       "saleAttrValueName": "",
          //       "spuId": 0
          //     }
          //   ]
          // }
        ]
      },
      // 存储品牌信息的数据
      trademarkList: [],
      // 存储 Spu 图片信息的数据
      imageList: [],
      // 存储销售属性信息的数据
      saleList: []
    }
  },
  computed: {
    // 计算出未选择的销售属性
    noSelect() {
      // 项目的全部销售属性 saleList ：颜色、版本、尺码
      // 当前 Spu 具有的销售属性 spu.spuSaleAttrList : 颜色
      // 数组的过滤方法：从已有的数组当中过滤出需要的元素，并返回一个新的数组
      // 数组的 every 方法：测试一个数组内的所有元素是否都能通过指定函数的测试，它返回一个布尔值
      let noSelectArr = this.saleList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
      return noSelectArr
    }
  },
  methods: {
    // 图片预览的回调
    handlePictureCardPreview(file) {
      // file 参数：代表预览的那张图片
      // console.log(file)
      // 将图片地址赋值给这个属性
      this.dialogImageUrl = file.url
      // 预览图片对话框显示
      this.dialogVisible = true
    },
    // 删除图片的回调
    handleRemove(file, fileList) {
      // file 参数：代表删除的那张图片
      // fileList 参数：删除后剩下的图片列表
      // console.log(file, fileList)
      this.imageList = fileList
    },
    // 图片上传成功的回调
    handleSuccess(response, file, fileList) {
      // response 参数：上传图片成功后服务器返回的信息
      // file 参数：代表上传成功的那张图片
      // fileList 参数：上传成功后全部的图片列表
      // console.log(response, file, fileList)
      this.imageList = fileList
    },
    // 初始化 SpuForm 数据
    async initSpuData(spu) {
      // 获取 Spu 信息（名称和描述）
      let spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌
      let trademarkListResult = await this.$API.spu.reqTrademark()
      if (trademarkListResult.code === 200) {
        this.trademarkList = trademarkListResult.data
      }
      // 获取 Spu 图片
      let imageResult = await this.$API.spu.reqImage(spu.id)
      if (imageResult.code === 200) {
        // 由于照片墙显示图片的数据需要数组，并且数组里面的对象中需要有 name 和 url 字段
        // 但是这里服务器返回的数组里面的对象中没有 name 和 url 字段，所以要为数组里面的对象进行添加 name 和 url 字段
        // 服务器返回的数组
        let arrList = imageResult.data
        // 遍历服务器返回的数组，为数组里面的每个对象添加 name 和 url 字段，值为对象中 imgName 和 imgUrl 字段的值
        arrList.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 把整理好的数组赋值给 imageList
        this.imageList = arrList
      }
      // 获取销售属性
      let saleResult = await this.$API.spu.reqSale()
      if (saleResult.code === 200) {
        this.saleList = saleResult.data
      }
    },
    // 添加销售属性按钮的回调
    addSaleAttr() {
      // 将收集到的销售属性（格式：" : "）进行分割，然后解构赋值
      const [ baseSaleAttrId, saleAttrName ] = this.attrIdAndAttrName.split(':')
      // 向 spu 对象的 spuSaleAttrList 属性中添加新的销售属性
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清空选择框中的文字
      this.attrIdAndAttrName = ''
    },
    // 点击 + 按钮的回调
    showInput(row) {
      // row 中的 inputVisible 属性，用来控制 el-input 和 el-button 的切换
      // 展示 el-input 框
      // row 中没有 inputVisible 属性，并且不是响应式的，需要设置为响应式
      this.$set(row, 'inputVisible', true)
      // row 中的 inputValue 属性，用来收集 el-input 框中的数据
      this.$set(row, 'inputValue', '')
      // el-input 框自动聚焦
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    // el-input 失去焦点的回调
    handleInputConfirm(row) {
      // 解构出来销售属性 id 和销售属性值
      const { baseSaleAttrId, inputValue } = row
      // 销售属性值不能为空
      if (!inputValue.trim()) {
        this.$message({ type: 'error', message: '属性值名称不能为空' })
        return
      }
      // 销售属性值不能重复
      let result = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === inputValue)
      if (result) {
        this.$message({ type: 'error', message: '属性值名称已经存在' })
        return
      }
      // 新的销售属性值，是一个对象，里面是解构出来的销售属性 id 和销售属性值
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      // 将新的销售属性值添加到属性值数组中
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 展示 el-button 按钮
      row.inputVisible = false
    },
    // 保存按钮的回调
    async addOrUpdate() {
      // 整理参数：需要整理照片墙的数据
      // 对于图片，需要携带 imgName 和 imgUrl 字段
      this.spu.spuImageList = this.imageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data
        }
      })
      // 发请求
      let result = await this.$API.spu.reqAddOrUpdate(this.spu)
      if (result.code === 200) {
        // 请求成功后消息提示框
        this.$message({ type: 'success', message: '保存成功' })
        // 切换场景，通知父组件回到场景 0
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 初始化 SpuForm 数据（获取品牌和销售属性的数据）
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id
      // 获取品牌
      let trademarkListResult = await this.$API.spu.reqTrademark()
      if (trademarkListResult.code === 200) {
        this.trademarkList = trademarkListResult.data
      }
      // 获取销售属性
      let saleResult = await this.$API.spu.reqSale()
      if (saleResult.code === 200) {
        this.saleList = saleResult.data
      }
    },
    // 点击取消按钮的回调
    cancel() {
      // 切换场景，通知父组件回到场景 0
      this.$emit('changeScene', { scene: 0, flag: '修改'})
      // 清除数据
      // Object.assign:合并对象
      // 组件实例 this._data ，可以操作 data 中的响应式数据
      // this.$options 可以获取配置对象，配置对象的 data() 函数执行，返回的响应式数据为空的
      // console.log(this._data, this.$options.data())
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
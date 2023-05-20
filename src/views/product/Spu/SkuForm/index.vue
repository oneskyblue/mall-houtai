<template>
  <el-form ref="form" label-width="100px">
    <el-form-item label="Spu名称">
      {{ spu.spuName }}
    </el-form-item>
    <el-form-item label="Sku名称">
      <el-input placeholder="Sku名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格（元）">
      <el-input placeholder="价格（元）" type="number" v-model="skuInfo.price"></el-input>
    </el-form-item>
    <el-form-item label="重量（千克）">
      <el-input placeholder="重量（千克）" v-model="skuInfo.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
          <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
            <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in saleAttrList" :key="saleAttr.id">
          <el-select placeholder="请选择" v-model="saleAttr.saleAttrIdAndValueId">
            <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="{ row }">
            <img :src="row.imgUrl" style="width: 100px; height: 100px">
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="primary" v-if="row.isDefault === 0" @click="changeIsDefault(row)">设置默认</el-button>
            <el-button v-else>默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 存储平台属性信息
      attrInfoList: [],
      // 存储销售属性信息
      saleAttrList: [],
      // 存储图片信息
      spuImageList: [],
      // spu
      spu: {},
      // table 表格中选中的图片信息
      imageList: [],
      // 收集 skuInfo 信息
      skuInfo: {
        // 父组件传递过来的数据
        category3Id: '',
        spuId: '',
        tmId: '',
        // 双向绑定的数据
        skuName: '',
        price: '',
        weight: '',
        skuDesc: '',
        skuDefaultImg: '',
        // 平台属性的数据
        "skuAttrValueList": [
          // {
          //   "attrId": 0,
          //   "valueId": 0
          // }
        ],
        // 销售属性的数据
        "skuSaleAttrValueList": [
          // {
          //   "saleAttrId": 0,
          //   "saleAttrValueId": 0,
          // }
        ],
        // 图片的数据
        "skuImageList": [
          // {
          //   "imgName": "string",
          //   "imgUrl": "string",
          //   "isDefault": "string",
          //   "spuImgId": 0
          // }
        ]
      }
    }
  },
  methods: {
    // 初始化数据
    async getData(category1Id, category2Id, spu) {
      this.spu = spu
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      // 发请求获取平台属性
      let attrResult = await this.$API.spu.reqAttrInfo(category1Id, category2Id, spu.category3Id)
      if (attrResult.code === 200) {
        this.attrInfoList = attrResult.data
      }
      // 发请求获取销售属性
      let saleResult = await this.$API.spu.reqSaleAttr(spu.id)
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
      // 发请求获取图片
      let imageResult = await this.$API.spu.reqSpuImage(spu.id)
      if (imageResult.code === 200) {
        // 为服务器返回的图片列表中每一个对象添加 isDefault 属性，用于设置默认图片
        imageResult.data.forEach(item => item.isDefault = 0)
        this.spuImageList = imageResult.data
      }
    },
    // table 表格中当选择项发生变化时会触发该事件
    handleSelectionChange(selection) {
      // selection 是选中的选项 为数组
      this.imageList = selection
    },
    // 点击设置默认按钮的回调
    changeIsDefault(row) {
      // 使服务器返回的图片列表中每个对象的 isDefault 为 0
      this.spuImageList.forEach(item => item.isDefault = 0)
      // 点击的对象的 isDefault 为 1
      row.isDefault = 1
    },
    // 点击取消按钮的回调
    cancel() {
      this.$emit('changeScenes', 0)
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 点击保存按钮的回调
    async save() {
      // 整理参数
      const { attrInfoList, saleAttrList, skuInfo } = this
      // 整理平台属性的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((pre, item) => {
        if (item.attrIdAndValueId) {
          const [ attrId, valueId ] = item.attrIdAndValueId.split(':')
          pre.push({ attrId, valueId })
        }
        return pre
      }, [])
      // 整理销售属性的数据
      skuInfo.skuSaleAttrValueList = saleAttrList.reduce((pre, item) => {
        if (item.saleAttrIdAndValueId) {
          const [ saleAttrId, saleAttrValueId ] = item.saleAttrIdAndValueId.split(':')
          pre.push({ saleAttrId, saleAttrValueId })
        }
        return pre
      }, [])
      // 整理图片的数据
      skuInfo.skuImageList = this.imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 发请求
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '添加Sku成功' })
        this.$emit('changeScenes', 0)
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>
// 这个模块主要获取的是Spu管理的数据
import request from '@/utils/request'

// 获取 Spu 列表的接口
// /admin/product/{page}/{limit} get 携带三个参数：page, limit, category3Id
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

// 获取某一个 Spu 信息的接口
// /admin/product/getSpuById/{spuId} get spuId
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌的接口
// /admin/product/baseTrademark/getTrademarkList get
export const reqTrademark = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

// 获取 Spu 图片的接口
// /admin/product/spuImageList/{spuId} get spuId
export const reqImage = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性（ 3 个）的接口
// /admin/product/baseSaleAttrList get
export const reqSale = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })

// 添加 Spu 或修改 Spu 的接口
export const reqAddOrUpdate = (spuInfo) => {
  // 如果携带的参数有 id ，那么代表修改 Spu
  if (spuInfo.id) {
    return request({ url: `/admin/product/updateSpuInfo`, method: 'post', data: spuInfo })
  } else {
    // 反之则代表添加 Spu
    return request({ url: `/admin/product/saveSpuInfo`, method: 'post', data: spuInfo })
  }
}

// 删除 Spu 的接口
// /admin/product/deleteSpu/{spuId} delete spuId
export const reqDeleteSpu = spuId => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// 点击添加 Sku 按钮所需的接口
// 获取平台属性的接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrInfo = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 获取销售属性的接口
// /admin/product/spuSaleAttrList/{spuId} get
export const reqSaleAttr = spuId => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取图片的接口
// /admin/product/spuImageList/{spuId} get
export const reqSpuImage = spuId => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 添加 Sku 的接口
// /admin/product/saveSkuInfo post skuInfo
export const reqAddSku = skuInfo => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })

// 查看 Sku 列表的接口
// /admin/product/findBySpuId/{spuId} get spuId
export const reqSkuList = spuId => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })
import request from '@/utils/request'

// 获取 Sku 列表的接口
// /admin/product/list/{page}/{limit} get page、limit
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

// Sku 上架的接口
// /admin/product/onSale/{skuId} skuId get
export const reqOnSale = skuId => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

// Sku 下架的接口
// /admin/product/cancelSale/{skuId} skuId get
export const reqCancelSale = skuId => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

// 获取 Sku 详情的接口
// /admin/product/getSkuById/{skuId} get skuId
export const reqSkuInfo = skuId => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })
// 这个模块主要获取的是品牌管理的数据
import request from '@/utils/request'

// 获取品牌列表的接口
export const reqTradeMark = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 添加品牌的接口
// /admin/product/baseTrademark/save post 携带两个参数：品牌名称和品牌LOGO（tmName,logoUrl）
// 修改品牌的接口
// /admin/product/baseTrademark/update put 携带三个参数：品牌id、品牌名称和品牌LOGO
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request({ url: `/admin/product/baseTrademark/update`, method: 'put', data: tradeMark })
  } else {
    return request({ url: `/admin/product/baseTrademark/save`, method: 'post', data: tradeMark })
  }
}

// 删除品牌的接口
// /admin/product/baseTrademark/remove/{id} delete 携带一个参数：品牌id
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
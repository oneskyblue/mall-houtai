// 这个模块主要获取的是品牌属性管理的数据
import request from '@/utils/request'

// 获取一级分类的接口
// /admin/product/getCategory1 get
export const reqCategory1List = () => request({ url: `/admin/product/getCategory1`, method: 'get' })

// 获取二级分类的接口
// /admin/product/getCategory2/{category1Id} get 携带一个参数：一级分类id
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

// 获取三级分类的接口
// /admin/product/getCategory3/{category2Id} get 携带一个参数：二级分类id
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

// 获取商品基础属性的接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get 携带三个参数：一二三级分类id
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加或修改属性的接口
// /admin/product/saveAttrInfo post
// {
//   "attrName": "string", // 属性名
//   "attrValueList": [ // 属性值列表
//     {
//       "attrId": 0, // 属性的id
//       "valueName": "string" // 属性值
//     }
//   ],
//   "categoryId": 0, // category3Id
//   "categoryLevel": 3,
// }
export const reqAddOrUpdateAttr = (data) => request({ url: `/admin/product/saveAttrInfo`, method: 'post', data })

// 删除属性的接口
// /admin/product/deleteAttr/{attrId} delete 携带一个参数：属性id
export const reqDeleteAttr = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' })
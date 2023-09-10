import request from '@/utils/request'

// =======================品牌管理相关========================
/**
 * @Date 2023-09-09 14:16:15
 * @introduction 获取品牌数据（分页）
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getBarndPage(params) {
  return request({
    url: `/admin/product/baseTrademark/${params.page}/${params.limit}`,
    method: 'get'
  })
}

/**
 * @Date 2023-09-09 17:29:48
 * @introduction 新增品牌
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function addTrademark(data) {
  return request({
    url: '/admin/product/baseTrademark/save',
    method: 'post',
    data
  })
}
/**
 * @Date 2023-09-09 17:56:47
 * @introduction 修改品牌
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function updateTrademark(data) {
  return request({
    url: '/admin/product/baseTrademark/update',
    method: 'put',
    data
  })
}
/**
 * @Date 2023-09-09 18:18:42
 * @introduction 删除品牌
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function removeTrademark(id) {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
}

// =======================平台属性管理相关========================
/**
 * @Date 2023-09-10 00:28:25
 * @introduction 获取一级分类
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getCategory1() {
  return request({
    url: '/admin/product/getCategory1',
    method: 'get'
  })
}
/**
 * @Date 2023-09-10 00:28:41
 * @introduction 获取二级分类
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getCategory2(category1Id) {
  return request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'get'
  })
}
/**
 * @Date 2023-09-10 00:28:51
 * @introduction 获取三级分类
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getCategory3(category2Id) {
  return request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'get'
  })
}
/**
 * @Date 2023-09-10 01:28:41
 * @introduction 根据分类获取属性信息列表
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getAttrInfoList(category1Id, category2Id, category3Id) {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })
}
/**
 * @Date 2023-09-10 12:27:47
 * @introduction 保存属性信息
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function saveAttrInfo(data) {
  return request({
    url: '/admin/product/saveAttrInfo',
    method: 'post',
    data
  })
}
/**
 * @Date 2023-09-10 16:45:24
 * @introduction 删除属性
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function delAttr(attrId) {
  return request({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: 'delete'
  })
}

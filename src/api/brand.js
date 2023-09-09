import request from '@/utils/request'

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

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
/* =======================spu管理相关======================== */
/**
 * @Date 2023-09-10 17:09:46
 * @introduction 获取spu分页列表
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getSpuPage(page, limit, params) {
  return request({
    url: `/admin/product/${page}/${limit}`,
    params
  })
}
/**
 * @Date 2023-09-17 22:56:18
 * @introduction 获取品牌数据
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getTrademarkList() {
  return request({
    url: '/admin/product/baseTrademark/getTrademarkList'
  })
}
/**
 * @Date 2023-09-21 23:20:42
 * @introduction 获取销售属性
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getBaseSaleAttrList() {
  return request({
    url: '/admin/product/baseSaleAttrList'
  })
}
/**
 * @Date 2023-09-22 10:32:17
 * @introduction 保存spu信息
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function saveSpuInfo(data) {
  return request({
    url: '/admin/product/saveSpuInfo',
    method: 'post',
    data
  })
}
/**
 * @Date 2023-09-22 16:53:23
 * @introduction 修改spu信息
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function updateSpuInfo(data) {
  return request({
    url: '/admin/product/updateSpuInfo',
    method: 'post',
    data
  })
}
/**
 * @Date 2023-09-22 16:59:20
 * @introduction 删除spu信息
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function deleteSpuInfo(spuId) {
  return request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
  })
}
/**
 * @Date 2023-09-22 15:18:53
 * @introduction 根据spuId获取spuInfo
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getSpuInfoById(spuId) {
  return request({
    url: `/admin/product/getSpuById/${spuId}`,
  })
}
/**
 * @Date 2023-09-22 16:32:24
 * @introduction 根据spuId获取spuImage
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getSpuImgsById(spuId) {
  return request({
    url: `/admin/product/spuImageList/${spuId}`,
  })
}
/**
 * @Date 2023-09-23 00:45:29
 * @introduction 根据spuId获取销售属性
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getSpuSaleAttrListById(spuId) {
  return request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
  })
}
/**
 * @Date 2023-09-23 15:29:52
 * @introduction 保存sku信息
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function saveSkuInfo(data) {
  return request({
    url: '/admin/product/saveSkuInfo',
    method: 'post',
    data
  })
}
/**
 * @Date 2023-09-23 17:41:14
 * @introduction 获取spu下的sku列表
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function findBySpuId(spuId) {
  return request({
    url: `/admin/product/findBySpuId/${spuId}`
  })
}
/**
 * @Date 2023-09-23 18:45:52
 * @introduction 获取Sku列表（分页）
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getSkuList(page,limit) {
  return request({
    url: `/admin/product/list/${page}/${limit}`
  })
}

/**
 * @Date 2023-09-23 20:33:33
 * @introduction 上架
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function onSale(skuId) {
  return request({
    url: `/admin/product/onSale/${skuId}`
  })
}
/**
 * @Date 2023-09-23 20:33:47
 * @introduction 下架
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function cancelSale(skuId) {
  return request({
    url: `/admin/product/cancelSale/${skuId}`
  })
}
/**
 * @Date 2023-09-23 21:01:13
 * @introduction 根据id获取sku信息
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getSkuById(skuId) {
  return request({
    url: `/admin/product/getSkuById/${skuId}`
  })
}
/**
 * @Date 2023-09-23 22:13:42
 * @introduction 删除sku
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function deleteSku(skuId) {
  return request({
    url: `/admin/product/deleteSku/${skuId}`,
    method: 'delete'
  })
}

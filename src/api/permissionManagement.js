// permissionManagement
import request from '@/utils/request'

/**
 * @Date 2023-09-27 15:42:48
 * @introduction 获取管理用户分页列表
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getUserPage(page, limit, params) {
  return request(
    {
      url: `/admin/acl/user/${page}/${limit}`,
      params
    }
  )
}

/**
 * @Date 2023-09-27 16:40:27
 * @introduction 新增管理用户
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function saveUser(data) {
  return request(
    {
      url: '/admin/acl/user/save',
      method: 'post',
      data
    }
  )
}
/**
 * @Date 2023-09-27 16:50:02
 * @introduction 删除管理用户
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function removeUser(id) {
  return request(
    {
      url: `/admin/acl/user/remove/${id}`,
      method: 'delete'
    }
  )
}
/**
 * @Date 2023-09-27 18:46:09
 * @introduction 根据id数组批量删除管理用户
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function removeUsers(idList) {
  return request({
    url: '/admin/acl/user/batchRemove',
    method: 'delete',
    data: idList
  })
}

/**
 * @Date 2023-09-27 17:11:29
 * @introduction 修改管理用户
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function updateUser(data) {
  return request(
    {
      url: '/admin/acl/user/update',
      method: 'put',
      data
    }
  )
}
/**
 * @Date 2023-09-27 22:57:08
 * @introduction 根据用户id获取用户角色
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getUserAssignRoles(userId) {
  return request({
    url: `/admin/acl/user/toAssign/${userId}`
  })
}

/**
 * @Date 2023-09-27 23:23:40
 * @introduction 设置用户角色
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function setUserAssignRole(data) {
  return request({
    url: '/admin/acl/user/doAssignRole',
    method: 'post',
    data
  })
}

/**
 * @Date 2023-09-27 19:27:39
 * @introduction 获取角色分页列表
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function getRolePage(page, limit, params) {
  return request(
    {
      url: `/admin/acl/role/${page}/${limit}`,
      params
    }
  )
}
/**
 * @Date 2023-09-27 21:22:48
 * @introduction 添加角色
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function saveRole(data) {
  return request({
    url: '/admin/acl/role/save',
    method: 'post',
    data
  })
}
/**
 * @Date 2023-09-27 21:28:29
 * @introduction 删除角色
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function removeRole(id) {
  return request({
    url: `/admin/acl/role/remove/${id}`,
    method: 'delete'
  })
}
/**
 * @Date 2023-09-27 21:41:54
 * @introduction 批量删除角色
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function removeRoles(idList) {
  return request({
    url: '/admin/acl/role/batchRemove',
    method: 'delete',
    data: idList
  })
}
/**
 * @Date 2023-09-27 21:40:22
 * @introduction 修改角色
 * @description 详细描述
 * @param {参数类型} 参数 参数说明
 */
export function updateRole(data) {
  return request({
    url: '/admin/acl/role/update',
    method: 'put',
    data
  })
}

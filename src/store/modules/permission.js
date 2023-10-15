import { constantRoutes, asyncRoutes } from '@/router'

// 递归过滤异步路由表
function filterAsyncRoutes(routes, routeNames) {
  return routes.filter(route => {
    if (routeNames.includes(route.name) || !route.name) {
      if (route.children && route.children.length > 0) {
        route.children = filterAsyncRoutes(route.children, routeNames)
      }
      return true
    }
  })
}

const state = {
  routes: [], // 当前用户可访问的路由表（由常量路由和当前用户可访问的异步路由列表组合而成）
  addRoutes: [] // 当前用户可访问的异步路由表
}

const mutations = {
  SET_ROUTES(state, routes) {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 生成异步路由, 可直接添加到router实例中
  generateRoutes({ commit }, routeNames) {
    return new Promise(resolve => {
      const accessedAsyncRoutes = filterAsyncRoutes(asyncRoutes, routeNames)
      commit('SET_ROUTES', accessedAsyncRoutes)
      resolve(accessedAsyncRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

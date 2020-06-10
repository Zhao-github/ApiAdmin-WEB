/**
 * ①添
 * @@新增 定义初始化菜单
 */
import store from '@/store'
import lazyLoading from './lazy-loading'
import { getAccessMenu } from '@/api/user'
import Main from '@/components/main' // Main 是架构组件，不在后台返回，在文件里单独引入

// 初始化路由
export const initRouter = () => {
  return dynamicRouterAdd()
}

// 加载路由菜单,从localStorage拿到路由,在创建路由时使用
export const dynamicRouterAdd = () => {
  let dynamicRouter = []
  let data = sessionStorage.getItem('dynamicRouter')
  if (!data) {
    getAccessMenu().then(res => {
      data = JSON.stringify(res.data.data) // 后台拿到路由
      sessionStorage.setItem('dynamicRouter', data) // 存储路由到localStorage
      store.commit('updateMenuList', data)

      dynamicRouter = filterAsyncRouter(JSON.parse(data))
      return dynamicRouter
    })
  } else {
    dynamicRouter = filterAsyncRouter(JSON.parse(data))
    return dynamicRouter
  }
}

// @函数: 遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRouter = (asyncRouterMap) => {
  let accessedRouters = []
  asyncRouterMap.filter(route => {
    if (route.show === 1) {
      let accessedRouter = {}
      accessedRouter.path = route.router
      accessedRouter.name = route.title
      accessedRouter.meta = {
        icon: route.icon,
        title: route.title
      }
      if (route.component) {
        if (route.component === '') {
          accessedRouter.component = Main
        } else {
          accessedRouter.component = lazyLoading(route.component)
        }
      }
      if (route.children && route.children.length) {
        accessedRouter.children = filterAsyncRouter(route.children)
      }
      accessedRouters.push(accessedRouter)
    }
  })

  return accessedRouters
}

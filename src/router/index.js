import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'view-design'
import { setToken, getToken, setTitle } from '@/libs/util'
import { oneOf } from '@/libs/tools'

Vue.use(Router)
const createRouter = () => new Router({
  routes
})

const router = createRouter()

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (to.name.indexOf('wiki_') === -1) {
    if (!token && to.name !== 'login') {
      // 未登录且要跳转的页面不是登录页
      next({
        name: 'login'
      })
    } else if (!token && to.name === 'login') {
      // 未登陆且要跳转的页面是登录页
      next()
    } else if (token && to.name === 'login') {
      // 已登录且要跳转的页面是登录页
      next({
        name: 'home'
      })
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 路由中有相关配置才会识别并且鉴权，否则认为不需要鉴权
        if (to.meta && to.meta.access) {
          if (oneOf(to.meta.access, user.access)) {
            // 有权限，可访问
            next()
          } else {
            // 无权限，重定向到401页面
            next({ replace: true, name: 'error_401' })
          }
        } else {
          next()
        }
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  } else {
    if (!token && to.name !== 'wiki_login') {
      // 未登录且要跳转的页面不是登录页
      next({
        name: 'wiki_login'
      })
    } else if (!token && to.name === 'wiki_login') {
      // 未登陆且要跳转的页面是登录页
      next()
    } else if (token && to.name === 'wiki_login') {
      // 已登录且要跳转的页面是登录页
      next({
        name: 'wiki_list'
      })
    } else {
      next()
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // the relevant part
}

export default router
